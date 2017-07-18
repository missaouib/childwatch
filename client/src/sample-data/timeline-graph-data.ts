import { GraphTimeSegment, TimelineGridSlot, TimelineRoom, TimeEvent } from '../app/schedule/room-timeline/timeline-calculations';
import { Presence, Schedule, Room, Staff, Participant, PersonTimeline } from '../app/schedule/interfaces';

export const NOW = new Date('July 1, 2017 17:00:00').valueOf();

export const staff1: Staff = {
  firstName: 'Aiden',
  lastName: 'Spence',
  id: '1'
};

export const participant1: Participant = {
  dateOfBirth: new Date('4-21-85').valueOf(),
  firstName: 'John',
  lastName: 'Doe',
  id: '0',
  imgUrl: '',
};

const graphTimeSegment0: GraphTimeSegment = {
  start: new Date('July 1, 2017 12:00:00').valueOf(),
  end: new Date('July 1, 2017 12:00:00').valueOf(),
  type: 'PNS'
}
export const graphTimeSegment1: GraphTimeSegment = {
  start: new Date('July 1, 2017 12:00:00').valueOf(),
  end: new Date('July 1, 2017 13:00:00').valueOf(),
  type: 'AS'
};

 const graphTimeSegment2: GraphTimeSegment = {
  start: new Date('July 1, 2017 13:00:00').valueOf(),
  end: new Date('July 1, 2017 13:00:00').valueOf(),
  type: 'SNP'
 }

const graphTimeSegment3: GraphTimeSegment = {
  start: new Date('July 1, 2017 14:00:00').valueOf(),
  end: new Date('July 1, 2017 14:00:00').valueOf(),
  type: 'PNS'
}

export const graphTimeSegment4: GraphTimeSegment = {
  start: new Date('July 1, 2017 14:00:00').valueOf(),
  end: new Date('July 1, 2017 16:00:00').valueOf(),
  type: 'AS'
};

const graphTimeSegment5: GraphTimeSegment = {
  start: new Date('July 1, 2017 16:00:00').valueOf(),
  end: new Date('July 1, 2017 16:00:00').valueOf(),
  type: 'SNP'
};

export const graphTimeline1 = [graphTimeSegment0, graphTimeSegment1, graphTimeSegment2];
export const graphTimeline2 = [graphTimeSegment3, graphTimeSegment4, graphTimeSegment5];

const gridSlot0: TimelineGridSlot = {
  presentNow: false,
  who: participant1,
  timeline: graphTimeline1
};

const gridSlot1: TimelineGridSlot = {
  presentNow: false,
  who: staff1,
  timeline: graphTimeline2
};

export const timelineGridSlots: TimelineGridSlot[] = [gridSlot0];
export const staffGridSlots: TimelineGridSlot[] = [gridSlot1];

export const room: Room = {
  id: '101',
  maxCapacity: 20,
  name: 'Test Room',
  staffCapacity: 6,
  targetCapacity: 15
};

export const timelineRoom: TimelineRoom = {
  ...room,
  slots: timelineGridSlots,
  staffSlots: staffGridSlots,
};

export const testRooms: Room[] = [room];
export const staff: Staff[] = [staff1];
export const participants: Participant[] = [participant1];
export const presence1: Presence = {
  start: new Date('July 1, 2017 14:00:00').valueOf(),
  end: new Date('July 1, 2017 16:00:00').valueOf(),
  roomId: '101'
};
export const schedule1: Schedule = {
  start: new Date('July 1, 2017 14:00:00').valueOf(),
  end: new Date('July 1, 2017 16:00:00').valueOf(),
  roomId: '101'
}

export const presenceList1: Presence[] = [presence1];
export const scheduleList1: Schedule[] = [schedule1];
export const presence2: Presence = {
  start: new Date('July 1, 2017 12:00:00').valueOf(),
  end: new Date('July 1, 2017 13:00:00').valueOf(),
  roomId: '101'
};
export const schedule2: Schedule = {
  start: new Date('July 1, 2017 12:00:00').valueOf(),
  end: new Date('July 1, 2017 13:00:00').valueOf(),
  roomId: '101'
};

export const presenceList2: Presence[] = [presence2];
export const scheduleList2: Schedule[] = [schedule2];
export const staffTimeline: PersonTimeline = {
  [staff1.id]: {
    personId: staff1.id,
    presence: presenceList1,
    schedule: scheduleList1
  }
};

export const participantTimeline: PersonTimeline = {
  [participant1.id]: {
    personId: participant1.id,
    presence: presenceList2,
    schedule: scheduleList2
  }
};

export const expectedTimeSeries1: TimeEvent[] = [
  {
    time: new Date('July 1, 2017 14:00:00').valueOf(),
    type: 'P',
    start: true
  },
  {
    time: new Date('July 1, 2017 14:00:00').valueOf(),
    type: 'S',
    start: true
  },
  {
    time: new Date('July 1, 2017 16:00:00').valueOf(),
    type: 'P',
    start: false
  },
  {
    time: new Date('July 1, 2017 16:00:00').valueOf(),
    type: 'S',
    start: false
  },
  {
    time: NOW,
    type: 'N',
    start: true
  }
];

export const expectedTimeSeries2: TimeEvent[] = [
  {
    time: new Date('July 1, 2017 12:00:00').valueOf(),
    type: 'P',
    start: true
  },
  {
    time: new Date('July 1, 2017 12:00:00').valueOf(),
    type: 'S',
    start: true
  },
  {
    time: new Date('July 1, 2017 13:00:00').valueOf(),
    type: 'P',
    start: false
  },
  {
    time: new Date('July 1, 2017 13:00:00').valueOf(),
    type: 'S',
    start: false
  },
  {
    time: NOW,
    type: 'N',
    start: true
  }
];


