import * as _ from 'lodash';

import {
  Room,
  Participant,
  DateType,
  Staff,
  Presence,
  Assignment,
  Person,
  PersonTimeline
} from '../../interfaces';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~ VIEW MODEL FOR GRID WITH STRIPES ~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export interface TimelineRoom extends Room {
  staffSlots: TimelineGridSlot[];
  slots: TimelineGridSlot[];
}

// AS -> As Scheduled
// PNS -> Present, Not Scheduled
// SNP -> Scheduled, Not Present
// ANS -> After Now, Schedule
// AN -> After Now, not scheduled
// I -> Invalid (Draw no segment)
export type SegmentType = 'AS' | 'PNS' | 'SNP' | 'ANS' | 'AN' | 'I';

// Represents one of the time segments in the graph visualization
export interface GraphTimeSegment {
  start: number;
  end: number;
  type: SegmentType;
}

export interface TimelineGridSlot {
  who: Person;
  timeline: GraphTimeSegment[];
  presentNow: boolean;
}

// State is for one day
export function timelineRooms(
  rooms: Room[],
  staff: Staff[],
  participants: Participant[],
  staffTimeline: PersonTimeline,
  participantTimeline: PersonTimeline,
  now: DateType
): TimelineRoom[] {
  return rooms.map(room => {
    const staffSlots = slots(staff, staffTimeline, room.id, now);
    const roomSlots = slots(participants, participantTimeline, room.id, now);
    return {
      ...room,
      staffSlots,
      slots: roomSlots
    };
  });
}

export function slots(people: Person[], timeline: PersonTimeline, roomId: string, now: DateType): TimelineGridSlot[] {
  let slots: TimelineGridSlot[] = [];
  for (const person of _.values(timeline)) {
    const schedule = _.filter(person.roomAssignments, { roomId });
    const presence = _(person.presence)
      .filter({ roomId })
      .map(p => ({ ...p }))
      .value();
    let presentNow = false;
    for (const p of presence) {
      if (!p.end) {
        p.end = now;
        presentNow = true;
      }
    }
    const graphTimeline = calculateTimeline(schedule, presence, now);
    if (presence.length > 0 || schedule.length > 0) {
      slots.push({
        who: _.find(people, { id: person.personId }),
        timeline: graphTimeline,
        presentNow
      });
    }
  }
  slots = _.sortBy(slots, s =>
    [
      _(s.timeline).map(t => t.start).min(),
      _(s.timeline).map(t => t.end).max(),
      s.who.lastName
    ]
  );
  return slots;
}

// P => Presence event
// S => Schedule event
// N => Current time event
type EventType = 'P' | 'S' | 'N';

export interface TimeEvent {
  time: number;
  start: boolean;
  type: EventType;
}

export function calculateTimeline(schedule: Assignment[], presence: Presence[], now: DateType): GraphTimeSegment[] {
  const timeEvents = calculateTimeEvents(schedule, presence, now);
  const timeSegments: GraphTimeSegment[] = [];
  let previousEvent: TimeEvent;
  if (timeEvents.length <= 1) {
    // Easy case, no entries
  } else {
    // Setup the process of proccessing state transitions
    let isPresent = false;
    let isScheduled = false;
    let isAfterNow = false;
    let newType: SegmentType;

    // Process each event
    timeEvents.forEach(event => {
      // Do not create a segment for the first entry
      // Need minimum of two events to create a segment
      if (previousEvent) {
        newType = timelineStateToSegmentType(isPresent, isScheduled, isAfterNow);
        // Only some segment types generate entries
        if (_.includes(['AS', 'PNS', 'SNP', 'ANS'], newType)) {
          timeSegments.push({
            start: previousEvent.time,
            end: event.time,
            type: newType
          });
        }
      }
      [isPresent, isScheduled, isAfterNow] = transitionState(isPresent, isScheduled, isAfterNow, event);
      previousEvent = event;
    });
  }

  return timeSegments;
}

// Combines the presence and schedule into a linear series of time events
// TODO: expand to include start of day and end of day events
export function calculateTimeEvents(schedule: Assignment[], presence: Presence[], now: DateType): TimeEvent[] {
  const timeEvents: TimeEvent[] = [];
  schedule.forEach(s => {
    timeEvents.push({
      time: s.start,
      type: 'S',
      start: true
    });
    timeEvents.push({
      time: s.end,
      type: 'S',
      start: false
    });
  });
  presence.forEach(p => {
    timeEvents.push({
      time: p.start,
      type: 'P',
      start: true
    });
    timeEvents.push({
      time: p.end,
      type: 'P',
      start: false
    });
  });
  timeEvents.push({
    time: now,
    type: 'N',
    start: true
  });
  return _.sortBy(timeEvents, 'time', 'type');
}

// Understands how to transition timeline state based on an incoming event
export function transitionState(
  isPresent: boolean,
  isScheduled: boolean,
  isAfterNow: boolean,
  event: TimeEvent): [boolean, boolean, boolean] {
  switch (event.type) {
    case 'P':
      if (event.start) {
        isPresent = true;
      } else {
        isPresent = false;
      }
      break;
    case 'S':
      if (event.start) {
        isScheduled = true;
      } else {
        isScheduled = false;
      }
      break;
    default:
      if (event.start) {
        isAfterNow = true;
      } else {
        isAfterNow = false;
      }
  }
  return [isPresent, isScheduled, isAfterNow];
}

// If after now we assume that the only thing left to draw is a pending scheduled block => S
// If they are present and schedule => AS
// Present but not scheduled => PNS
// Schedule but not present => SNP
export function timelineStateToSegmentType(isPresent: boolean, isScheduled: boolean, isAfterNow: boolean): SegmentType {
  if (isAfterNow && isScheduled) {
    return 'ANS';
  }

  if (isAfterNow) {
    return 'AN';
  }

  if (isPresent) {
    if (isScheduled) {
      return 'AS';
    }
    return 'PNS';
  }
  if (isScheduled) {
    return 'SNP';
  }
  return 'I';
}
