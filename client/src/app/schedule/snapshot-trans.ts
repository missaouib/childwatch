// TODO: Rename this file
import * as _ from 'lodash';

import { Participant, DateType, Room, Staff, Schedule, Timeline } from './interfaces';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~ VIEW MODEL FOR POINT-IN-TIME GRID ~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

type ScheduledStatus = 'Arriving' | 'Planned' | 'Departed' | 'NotScheduled';
type RoomCapacityStatus = 'Target' | 'AboveTarget' | 'AboveMax';

interface SnapshotSlot {
  present: boolean;
  scheduled: ScheduledStatus;
  scheduledStart?: DateType;
  scheduledEnd?: DateType;

}
interface ParticipantSnapshotSlot extends SnapshotSlot {
  roomCapacity: RoomCapacityStatus;
  who: Participant;

}

interface StaffSnapshotSlot extends SnapshotSlot {
  who: Staff;

}

const EMPTY_SLOT: SnapshotSlot = {
  present: false,
  scheduled: 'NotScheduled'
};

export interface SnapshotRoom extends Room {
  staffSlots: StaffSnapshotSlot[];
  slots: ParticipantSnapshotSlot[];
}

// TODO refactor?
// interface Input {
//   rooms: Room[];
//   staff: Staff[];
//   participants: Participant[];
//   staffTimeline: { [personId: string]: Timeline };
//   participantTimeline: { [personId: string]: Timeline };
// }

export function snapshotRooms(
  rooms: Room[],
  staff: Staff[],
  participants: Participant[],
  staffTimeline: { [personId: string]: Timeline },
  participantTimeline: { [personId: string]: Timeline },
  timestamp: DateType,
  liveView: boolean
): SnapshotRoom[] {
  return rooms.map(room => ({
    ...room,
    staffSlots: staffSlots(staff, staffTimeline, room, timestamp, liveView),
    slots: participantSlots(participants, participantTimeline, room, timestamp, liveView)
  }));
}

function participantSlots(
  participants: Participant[],
  participantTimeline: { [personId: string]: Timeline },
  room: Room,
  timestamp: DateType,
  liveView: boolean): ParticipantSnapshotSlot[] {
  const filteredParticipants: Timeline[] = _(participantTimeline)
    .values()
    .filter((att: Timeline) => isPresentOrScheduled(att, room.id, timestamp, liveView))
    .value() as Timeline[];

  const slots = _(filteredParticipants)
    .map((p: Timeline) => {
      const schedule: Schedule = findNearestSchedule(p, room.id, timestamp);
      // TODO replace ternary with if/else (favor readability)
      const scheduled: ScheduledStatus = schedule
        ? (timestamp < schedule.start
          ? 'Arriving'
          : (timestamp < schedule.end
            ? 'Planned'
            : 'Departed'))
        : 'NotScheduled';
      return {
        who: _.find(participants, { id: p.personId }),
        present: isPresent(p, room.id, timestamp, liveView),
        scheduled,
        scheduledStart: schedule && schedule.start,
        scheduledEnd: schedule && schedule.end
      };
    })
    .sortBy(p => {
      if (p.present) {
        return [0, p.scheduledEnd];
      }
      if (p.scheduled === 'Planned') {
        return [1, p.scheduledStart];
      }
      if (p.scheduled === 'Arriving') {
        return [2, p.scheduledStart];
      }
      return [3, p.scheduledEnd];
    })
    .value() as ParticipantSnapshotSlot[];

  while (slots.length < room.maxCapacity) {
    let roomCapacity: RoomCapacityStatus;
    if (slots.length < room.targetCapacity) {
      roomCapacity = 'Target';
    } else {
      roomCapacity = 'AboveTarget';
    }
    slots.push({ ...EMPTY_SLOT, roomCapacity, who: undefined });

  }
  return slots;
}

function staffSlots(
  staff: Staff[],
  staffTimeline: { [personId: string]: Timeline },
  room: Room,
  timestamp: DateType,
  liveView: boolean): StaffSnapshotSlot[] {

  const filteredStaff: Timeline[] = _(staffTimeline)
    .values()
    .filter((att: Timeline) => isPresentOrScheduled(att, room.id, timestamp, liveView))
    .value() as Timeline[];

  const slots: StaffSnapshotSlot[] = _.map(filteredStaff, (s: Timeline) => {
    const schedule: Schedule = findNearestSchedule(s, room.id, timestamp);
    const scheduled: ScheduledStatus = schedule
      ? (timestamp < schedule.start
        ? 'Arriving'
        : (timestamp < schedule.end
          ? 'Planned'
          : 'Departed'))
      : 'NotScheduled';
    return {
      who: _.find(staff, { id: s.personId }),
      present: isPresent(s, room.id, timestamp, liveView),
      scheduled,
      scheduledStart: schedule && schedule.start,
      scheduledEnd: schedule && schedule.end
    };
  });
  while (slots.length < room.staffCapacity) {
    slots.push({ ...EMPTY_SLOT, who: undefined });
  }
  return slots;
}

function isPresentOrScheduled(timeline: Timeline, roomId: string, timestamp: DateType, liveView: boolean): boolean {
  return isPresent(timeline, roomId, timestamp, liveView) || isScheduled(timeline, roomId, timestamp, liveView);
}

function isPresent(timeline: Timeline, roomId: string, timestamp: DateType, liveView: boolean): boolean {
  if (liveView) {
    return !!_.find(timeline.presence, p => p.roomId === roomId && p.start <= timestamp && (!p.end || p.end > timestamp));
  } else {
    return !!_.find(timeline.presence, p => p.roomId === roomId && p.start <= timestamp && p.end && timestamp < p.end);
  }
}

function isScheduled(timeline: Timeline, roomId: string, timestamp: DateType, liveView: boolean): boolean {
  if (liveView) {
    return !!_.find(timeline.schedule, p => p.roomId === roomId && timestamp < p.end);
  } else {
    return !!_.find(timeline.schedule, p => p.roomId === roomId && timestamp < p.end && timestamp >= p.start);
  }
}

function findNearestSchedule(timeline: Timeline, roomId: string, timestamp: DateType): Schedule {
  return _(timeline.schedule)
    .filter(s => s.roomId === roomId)
    .sortBy(s => Math.min(Math.abs(s.start - timestamp), Math.abs(s.end - timestamp)))
    .head();
}
