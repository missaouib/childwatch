import * as moment from 'moment';

export type DateType = number;

export type OperationMode = 'LIVE' | 'SCHEDULE' | 'REVIEW';
export type ViewMode = 'overview' | 'assignment' | 'timeline' | 'recurring';

// ----------------

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: DateType;
  imgUrl: string;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
}

export type Person = Participant | Staff;

export enum PersonType {
  Participant,
  Staff
}

export interface Room {
  id: string;
  name: string;
  staffCapacity: number;
  targetCapacity: number;
  maxCapacity: number;
}

export interface Timeline {
  personId: string;
  presence: Presence[];
  roomAssignments: Assignment[];
}

export interface PersonTimeline {
  [personId: string]: Timeline;
}

// Generic type to indicate where someone could be or was
// for a particular timeslot
export interface PlacementSegment {
  roomId: string;
  start: DateType;
  end?: DateType;
}

// More specific version of PlacementSegment intended for
// use when indicating what actually happened historically
export interface Presence extends PlacementSegment { }

// More specific version of PlacementSegment intended for
// use when indicating what is scheduled to happen
export interface Assignment extends PlacementSegment {
  end: DateType;
}

export interface ClientSchedule {
  personId: string;
  days: DaySchedule[];
  effectiveDate: string;
}

export interface DaySchedule {
  start1: string;
  end1: string;
  start2: string;
  end2: string;
}

// ----------------

export interface Event {
  timestamp: number;
  type: string;
  payload: EventPayload;
}

// Marker interface, making them easier to find
export interface EventPayload { }

export const Events = {
  RoomCreated: 'RoomCreated',
  StaffCreated: 'StaffCreated',
  StaffScheduled: 'StaffScheduled',
  StaffArrived: 'StaffArrived',
  StaffDeparted: 'StaffDeparted',
  ParticipantCreated: 'ParticipantCreated',
  ParticipantScheduled: 'ParticipantScheduled',
  ParticipantArrived: 'ParticipantArrived',
  ParticipantDeparted: 'ParticipantDeparted'
};

export interface PersonSchedule {
  who: Person;
  type: PersonType;
  date: DateType;
  schedule: Assignment[];

}

export interface StaticSchedulingData {
  staff: Staff[];
  participants: Participant[];
  rooms: Room[];
}

export interface TimelinesByPerson {
  [personId: string]: Timeline;
};

export interface DailyTimelinesByPerson {
  staffTimeline: TimelinesByPerson;
  participantTimeline: TimelinesByPerson;
}

export interface ServerSchedule {
  personId: string;
  effectiveDate: string;
  schedule: Pair[][];
}

export interface Pair {
  start: number;
  end: number;
}

// TODO plenty of modeling needed:
// * Can a participant be scheduled for more than one room on a given day, like morning in one room
//   and afternoon in another?
// * Can a participant "arrive" in a different room than scheduled? Sounds possible, then we need to
//   make sure the projections handle that correctly.
// * Can staff be scheduled for more than one room?
// * Can staff work ("arrive") in a different room than scheduled?

// TODO: consider moving the event/state stuff out to a seperate module
// See scheduling-query.service.ts for details

export function makeEvent(timestamp: Date | number | moment.Moment, type: string, payload: EventPayload): Event {
  return {
    timestamp: typeof timestamp === 'number' ? timestamp : timestamp.valueOf(),
    type,
    payload
  };
}

export interface RoomAssignmentSchedule {
  roomId: number;
  start: DateType;
  end: DateType;
}

export interface RoomCreated extends EventPayload {
  id: number;
  name: string;
  staffCapacity: number;
  targetCapacity: number;
  maxCapacity: number;
}

export function roomCreated(timestamp: Date | number | moment.Moment, payload: RoomCreated) {
  return makeEvent(timestamp, Events.RoomCreated, payload);
}

export interface StaffCreated extends EventPayload {
  id: number;
  firstName: string;
  lastName: string;
}

export function staffCreated(timestamp: Date | number | moment.Moment, payload: StaffCreated) {
  return makeEvent(timestamp, Events.StaffCreated, payload);
}

export interface StaffScheduled extends EventPayload {
  personId: number;
  date: number; // epoch start of day
  schedule: RoomAssignmentSchedule[];
}

export function staffScheduled(timestamp: Date | number | moment.Moment, payload: StaffScheduled) {
  return makeEvent(timestamp, Events.StaffScheduled, payload);
}

export interface StaffArrived extends EventPayload {
  personId: number;
  arrivedAt: number;
  roomId: number; // TODO they can have no room?
}

export function staffArrived(timestamp: Date | number | moment.Moment, payload: StaffArrived) {
  return makeEvent(timestamp, Events.StaffArrived, payload);
}

export interface StaffDeparted extends EventPayload {
  personId: number;
  departedAt: number;
}

export function staffDeparted(timestamp: Date | number | moment.Moment, payload: StaffDeparted) {
  return makeEvent(timestamp, Events.StaffDeparted, payload);
}


export interface ParticipantCreated extends EventPayload {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: number;
  imgUrl?: string;
}

export function participantCreated(timestamp: Date | number | moment.Moment, payload: ParticipantCreated) {
  return makeEvent(timestamp, Events.ParticipantCreated, payload);
}

export interface ParticipantScheduled extends EventPayload {
  personId: number;
  date: number; // epoch start of day
  schedule: RoomAssignmentSchedule[];
}

export function participantScheduled(timestamp: Date | number | moment.Moment, payload: ParticipantScheduled) {
  return makeEvent(timestamp, Events.ParticipantScheduled, payload);
}

export interface ParticipantArrived extends EventPayload {
  personId: number;
  arrivedAt: number;
  roomId: number; // TODO they can have no room?
}

export function participantArrived(timestamp: Date | number | moment.Moment, payload: ParticipantArrived) {
  return makeEvent(timestamp, Events.ParticipantArrived, payload);
}

export interface ParticipantDeparted extends EventPayload {
  personId: number;
  departedAt: number;
}

export function participantDeparted(timestamp: Date | number | moment.Moment, payload: ParticipantDeparted) {
  return makeEvent(timestamp, Events.ParticipantDeparted, payload);
}
