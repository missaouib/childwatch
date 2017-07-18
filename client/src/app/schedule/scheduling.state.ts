import { Action } from '@ngrx/store';

import { DateType, Participant, Staff, Room, Timeline, PersonType, Person, Schedule } from './interfaces';
import { dateTimestamp } from '../../common/date-utils';
import { ViewControl, viewControlReducer } from './view-controls/view-controls.state';

// Every module may have its own view of the "shared" data, relevant to its context. That's why
// the staff and participants are part of SchedulingState, not the top-level AppState.
// Note: Be careful. There may be features where a participant on the family
// data screen may be the same participant as seen in the scheduling screen. If the staff and participants
// are to be isolated from one another, then it should be a rather firm wall between the features

export interface SchedulingState {
  rooms: Room[];
  // See comments above about the staff and participants
  staff: Staff[];
  participants: Participant[];
  staffTimeline: { [date: number]: TimelinesByPerson };
  participantTimeline: { [date: number]: TimelinesByPerson };
  personSchedule?: PersonSchedule;
  viewControl: ViewControl;
}

const INITIAL_STATE: SchedulingState = {
  rooms: [],
  staff: [],
  participants: [],
  staffTimeline: {},
  participantTimeline: {},
  viewControl: undefined
};

export interface PersonSchedule {
  who: Person;
  type: PersonType;
  date: DateType;
  schedule: Schedule[];
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

export const WATCH_STATIC_DATA = 'WATCH_STATIC_DATA';
export function watchStaticData(): Action { return { type: WATCH_STATIC_DATA }; }

export const LOAD_TIMELINES = 'LOAD_TIMELINES';
export function loadTimelines(date: DateType): Action {
  return { type: LOAD_TIMELINES, payload: date };
}

export const SELECT_PERSON = 'SELECT_PERSON';
export function selectStaff(staff: Staff) {
  return {
    type: SELECT_PERSON,
    payload: { who: staff, type: PersonType.Staff }
  };
}
export function selectParticipant(participant: Participant) {
  return {
    type: SELECT_PERSON,
    payload: { who: participant, type: PersonType.Participant }
  };
}

export const HIDE_PERSON = 'HIDE_PERSON';

export const SCHEDULE_EDITOR_DATE_CHANGED = 'SCHEDULE_EDITOR_DATE_CHANGED';
export function scheduleEditorDateChanged(value: DateType) {
  return {
    type: SCHEDULE_EDITOR_DATE_CHANGED,
    payload: value
  };
}

export const SCHEDULE_EDITOR_SCHEDULE_LOADED = 'SCHEDULE_EDITOR_SCHEDULE_LOADED';
export function scheduleEditorScheduleLoaded(value: Schedule[]) {
  return {
    type: SCHEDULE_EDITOR_SCHEDULE_LOADED,
    payload: value
  };
}

export const STATIC_DATA_RECEIVED = 'STATIC_DATA_RECEIVED';
export function staticDataReceived(state: StaticSchedulingData): Action {
  return {
    type: STATIC_DATA_RECEIVED,
    payload: state
  };
}

export const TIMELINE_DATA_RECEIVED = 'TIMELINE_DATA_RECEIVED';
export function timelineDataReceived(
  date: DateType,
  { staffTimeline, participantTimeline }: DailyTimelinesByPerson
): Action {
  return {
    type: TIMELINE_DATA_RECEIVED,
    payload: { date, staffTimeline, participantTimeline }
  };
}

export const UPDATE_SCHEDULE = 'UPDATE_SCHEDULE';
export function updateSchedule(payload: Schedule[]) {
  return { type: UPDATE_SCHEDULE, payload };
}

export function schedulingReducer(state: SchedulingState = INITIAL_STATE, action: Action): SchedulingState {
  state = { ...state, viewControl: viewControlReducer(state.viewControl, action) };
  switch (action.type) {
    case STATIC_DATA_RECEIVED:
      return {
        ...state,
        rooms: action.payload.rooms,
        staff: action.payload.staff,
        participants: action.payload.participants
      };
    case TIMELINE_DATA_RECEIVED:
      return {
        ...state,
        staffTimeline: {
          ...state.staffTimeline,
          [action.payload.date]: action.payload.staffTimeline
        },
        participantTimeline: {
          ...state.participantTimeline,
          [action.payload.date]: action.payload.participantTimeline
        }
      };
    case SELECT_PERSON:
      // TODO start with time they have selected in the scheduling screen
      // Once that is set, remember the selection (so that if they diverge,
      // the next time a person is selected it uses the date from the last
      // scheduling action, not currently in the slider.
      const date = (state.personSchedule && state.personSchedule.date) || dateTimestamp(new Date());
      return {
        ...state,
        personSchedule: {
          ...state.personSchedule,
          type: action.payload.type,
          who: action.payload.who,
          date: date,
          schedule: undefined
        }
      };
    case SCHEDULE_EDITOR_DATE_CHANGED:
      return {
        ...state,
        personSchedule: {
          ...state.personSchedule,
          date: action.payload
        }
      };
    case SCHEDULE_EDITOR_SCHEDULE_LOADED:
      return {
        ...state,
        personSchedule: {
          ...state.personSchedule,
          schedule: (action.payload && action.payload.length > 0) ? action.payload : []
        }
      };
    case HIDE_PERSON:
      return { ...state, personSchedule: undefined };
  }
  return state;
}
