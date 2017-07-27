import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import * as moment from 'moment';
import * as _ from 'lodash';

import {
  DateType, Staff, Person, Participant,
  Assignment, Timeline, Presence, PersonType, OperationMode,
  ClientSchedule, DaySchedule, TimelinesByPerson,
  ServerSchedule, Pair
} from './interfaces';
// Consider using Lerna for multiple subprojects within just the client so that the following
// line can look like:
// import { AppState } from '@remarkable/app.state'
// much more resiliant in the face of refactoring and easier to maintain
import { AppState } from '../../app/app.state';
import {
  WATCH_STATIC_DATA, staticDataReceived, watchStaticData,
  loadTimelines, LOAD_TIMELINES, timelineDataReceived, SchedulingState,
  assignmentEditorAssignmentLoaded, UPDATE_SCHEDULE, selectStaff,
  selectParticipant, scheduleEditorDateChanged, HIDE_PERSON,
  updateSchedule, personScheduleReceived, updatePersonSchedule, UPDATE_PERSON_SCHEDULE
} from './scheduling.state';
import { isoDate, dateTimestamp } from '../../common/date-utils';
import { snapshotRooms } from './snapshot-trans';
import { timelineRooms } from './room-timeline-screen/room-timeline/timeline-calculations';
import { ScheduleServerApiService } from './schedule-server-api.service';

const TIMELINE_DATA_POLLING_INTERVAL_MS = 200 * 1000;
const RETRY_DELAY_MS = 10 * 1000;

@Injectable()
export class SchedulingService {

  // -----------Start Side Effect List ------------------------//

  // TODO error handling etc
  // Does: Obtains the rooms and individuals
  // When: Upon navigating to schedule screen
  @Effect()
  watchQueries = this.actions.ofType(WATCH_STATIC_DATA)
    .switchMap(() =>
      this.apiService.queryStaticData()
        .map(staticDataReceived)
        .catch(() => Observable.of(watchStaticData()).delay(RETRY_DELAY_MS)));

  // Does: Obtains the timeline data for a day
  // When: Upon navigating to schedule screen
  @Effect()
  loadTimelinesForDay = this.actions.ofType(LOAD_TIMELINES)
    .map(toPayload)
    .switchMap(date =>
      this.apiService.queryTimelines(date, { pollInterval: TIMELINE_DATA_POLLING_INTERVAL_MS })
        .map(timelines => timelineDataReceived(date, timelines))
        .catch(() => Observable.of(loadTimelines(date)).delay(RETRY_DELAY_MS))
    );

  // TODO: update with new assignment API, look to see if this can be a reducer instead
  // See loadTimeLines above

  // Does: Gets a persons timeline
  // When: each time the selected person is changed in the scheduling module
  @Effect()
  loadAssignmentOnSelect = this.store.select(s => s.scheduling.personSchedule)
    .filter(s => s && !!s.who && !!s.date)
    .distinctUntilChanged((a, b) => _.isEqual(a.who, b.who) && _.isEqual(a.date, b.date))
    .switchMap(({ who, type, date }) =>
      // TODO loading everyone's timelines is too big a gun here
      // TODO show loading status, handle error
      this.apiService.queryTimelines(date)
        .take(1)
        .map(({ staffTimeline, participantTimeline }) => {
          const timeline: TimelinesByPerson = type === PersonType.Participant ? participantTimeline : staffTimeline;
          return assignmentEditorAssignmentLoaded(timeline && timeline[who.id] && timeline[who.id].roomAssignments);
        }));

  // TODO: update with new assignment API
  // Does: updates the assignments of an individual
  // When: the user has requested a change
  @Effect({ dispatch: false })
  updateAssignment = this.actions.ofType(UPDATE_SCHEDULE)
    .map(action => action.payload as Assignment[])
    .withLatestFrom(this.store.select(s => s.scheduling.personSchedule))
    .concatMap(([newAssignments, personSchedule]) => {
      return this.apiService.updateIndividualAssignment(newAssignments, personSchedule);
    });

  // Does: gets a person's schedule (as opposed to timeline/assignments)
  // When: the selected person changes
  @Effect()
  loadPersonScheduleOnSelect = this.store.select(s => s.scheduling.personSchedule)
    .filter(s => s && !!s.who)
    .switchMap(({ who }) =>
      // TODO show loading status, handle error
      this.apiService.queryPersonSchedule(who.id, dateTimestamp(new Date()))
        .map(({ personSchedule }) => {
          return personScheduleReceived(serverToClient(personSchedule));
        })
    );

  // Does: updates a person's schedule (as opposed to timeline/assignments)
  // When: the user has requested a change
  @Effect({ dispatch: false })
  updatePersonSchedule = this.actions.ofType(UPDATE_PERSON_SCHEDULE)
    .map(action => action.payload as ClientSchedule)
    .concatMap(personSchedule => {
      const effectiveDate = dateTimestamp(new Date());
      const variables: any = {
        effectiveDate: isoDate(effectiveDate),
        personId: personSchedule.personId,
        schedule: clientToServer(personSchedule).schedule
      };
      return this.apiService.updatePersonSchedule(personSchedule, effectiveDate, variables);
    });

  // -------------------End side effect list -----------------------//

  schedules: Observable<Assignment[]>;
  selectedParticipantTimeline: Observable<Timeline>;
  presences: Observable<Presence[]>;
  selectedPerson: Observable<Person>;
  // TODO: figure out type and use it
  processedRooms: any;
  timeStatus: Observable<OperationMode>;
  // Base on the state of 'Live' the following will provide
  // either the live time or the time entered by the user
  whichTime: Observable<DateType>;
  schedulingState = this.store.select(s => s.scheduling);
  viewControls = this.schedulingState.map(s => s.viewControl);
  staff = this.schedulingState.map(s => s.staff);
  participants = this.schedulingState.map(s => s.participants);
  rooms = this.schedulingState.map(s => s.rooms);
  selectedPersonSchedule = this.schedulingState.map(s => s.personSchedule);
  schedule = this.schedulingState.map(s => s.editingSchedule);

  private currentTime = this.store.select(s => s.currentTime);

  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private apiService: ScheduleServerApiService) {
    // Combines current date and application state to obtain
    // the selected person's timeline for the day
    this.selectedParticipantTimeline = Observable.combineLatest(
      this.currentTime
        .map(time => dateTimestamp(time))
        .distinctUntilChanged(),
      this.schedulingState,
      (date, schedulingState) => {
        // TODO separate selected person from schedule
        // If a person is selected...
        if (schedulingState.personSchedule) {
          // Grab either the participant or staff timeline based on the type
          // of person
          let timeline;
          if (schedulingState.personSchedule.type === PersonType.Participant) {
            timeline = schedulingState.participantTimeline;
          } else {
            timeline = schedulingState.staffTimeline;
          }
          // return the timeline for day and person
          return timeline[date][schedulingState.personSchedule.who.id];
        } else {
          return undefined;
        }
      }).shareReplay();

    this.presences = this.selectedParticipantTimeline
      .map(timeline => timeline && timeline.presence ? timeline.presence : undefined)
      .shareReplay();

    this.schedules = this.selectedParticipantTimeline
      .map(timeline => timeline && timeline.roomAssignments ? timeline.roomAssignments : undefined)
      .shareReplay();

    this.selectedPerson = this.selectedPersonSchedule
      .map(schedule => schedule ? schedule.who : undefined)
      .shareReplay();

    this.timeStatus = Observable.combineLatest(
      this.viewControls.map(control => control.live),
      this.viewControls.map(control => control.reviewingDateTime),
      this.currentTime,
      (live, reviewingDateTime, time) => {
        if (live) {
          return 'LIVE';
        } else {
          if (time >= reviewingDateTime) {
            return 'REVIEW';
          }
          return 'SCHEDULE';
        }
      })
      .shareReplay();

    this.whichTime = Observable.combineLatest(
      this.viewControls.map(control => control.reviewingDateTime),
      this.viewControls.map(control => control.live),
      this.currentTime,
      (reviewingDateTime, isLive, now) => isLive ? now : reviewingDateTime);

    this.processedRooms = Observable.combineLatest(
      this.whichTime,
      this.timeStatus,
      this.currentTime,
      this.schedulingState
        .distinctUntilChanged(_.isEqual),
      (dateTime, operation, currentTime, schedulingState: SchedulingState) => {
        const newSchedulingState = _.cloneDeep(schedulingState);
        const date = dateTimestamp(dateTime);
        const snapshot = snapshotRooms(
          newSchedulingState.rooms,
          newSchedulingState.staff,
          newSchedulingState.participants,
          newSchedulingState.staffTimeline[date],
          newSchedulingState.participantTimeline[date],
          dateTime, operation === 'LIVE'); // date and time
        const timeline = timelineRooms(
          newSchedulingState.rooms,
          newSchedulingState.staff,
          newSchedulingState.participants,
          newSchedulingState.staffTimeline[date],
          newSchedulingState.participantTimeline[date],
          currentTime);
        return newSchedulingState.rooms.map(({ id, name }) => ({
          id,
          name,
          snapshot: _.find(snapshot, { id }),
          timeline: _.find(timeline, { id })
        }));
      }).shareReplay();

  }

  selectStaff(staff: Staff) {
    this.store.dispatch(selectStaff(staff));
  }

  selectParticipant(participant: Participant) {
    this.store.dispatch(selectParticipant(participant));
  }

  dateChanged(date: DateType) {
    this.store.dispatch(scheduleEditorDateChanged(date));
  }

  close() {
    this.store.dispatch({ type: HIDE_PERSON });
  }

  // TODO update with new assignment API
  oldUpdateSchedule(schedule: Assignment[]) {
    this.store.dispatch(updateSchedule(schedule));
  }

  updateSchedule(schedule: ClientSchedule) {
    this.store.dispatch(updatePersonSchedule(schedule));
  }

  initialize() {
    this.store.dispatch(watchStaticData());
  }

  loadTimelines(date: DateType) {
    this.store.dispatch(loadTimelines(date));
  }
}

export function convertToNumber(time: string): number {
  if (time) {
    const hh = parseInt(time.slice(0, 2), 10);
    const mm = parseInt(time.slice(3), 10);
    return hh * 60 + mm;
  }
}

export function convertStartToString(pair: Pair): string {
  if (pair) {
    const minutes = pair.start;
    return moment().startOf('day').minutes(minutes).format('HH:mm');
  }
  return '';
}

export function convertEndToString(pair: Pair): string {
  if (pair) {
    const minutes = pair.end;
    if (minutes === 24 * 60) {
      return '24:00';
    } else {
      return moment().startOf('day').minutes(minutes).format('HH:mm');
    }
  }
  return '';
}

// assumes 7 day cycle
export function orderByWeekdays(effectiveDate: string, ds: DaySchedule[]): DaySchedule[] {
  const days = _.cloneDeep(ds);
  const dayOfWeek = moment(effectiveDate, 'YYYY-MM-DD').isoWeekday();
  const numShift = dayOfWeek - 1;
  _.times(numShift, () => days.unshift(days.pop()));
  return days;
}

export function serverToClient(ss: ServerSchedule): ClientSchedule {
  return ss && {
    personId: ss.personId,
    effectiveDate: ss.effectiveDate,
    days: orderByWeekdays(ss.effectiveDate, ss.schedule.map(pairs => {
      return {
        'start1': convertStartToString(pairs[0]),
        'end1': convertEndToString(pairs[0]),
        'start2': convertStartToString(pairs[1]),
        'end2': convertEndToString(pairs[1])
      };
    }))
  };
}

export function clientToServer(cs: ClientSchedule): ServerSchedule {
  const schedule: Pair[][] = [];
  const orderedDays = orderByEffDate(cs.days, cs.effectiveDate);

  orderedDays.map(day => {
    const arr: Pair[] = [];
    if (day.start1 && day.end1) {
      arr.push({
        start: convertToNumber(day.start1),
        end: convertToNumber(day.end1)
      });
    }

    if (day.start2 && day.end2) {
      arr.push({
        start: convertToNumber(day.start2),
        end: convertToNumber(day.end2)
      });
    }
    schedule.push(arr);
  });
  return {
    personId: cs.personId,
    effectiveDate: cs.effectiveDate,
    schedule
  };
}

export function orderByEffDate(ds: DaySchedule[], effectiveDate: string): DaySchedule[] {
  const days: DaySchedule[] = _.clone(ds);
  const dayOfWeek = moment(effectiveDate, 'YYYY-MM-DD').isoWeekday();
  const numShift = dayOfWeek - 1;

  _.times(numShift, () => days.push(days.shift()));
  return days;
}

export function isStartBeforeEnd(start: string, end: string) {
  return convertToNumber(start) < convertToNumber(end);
}

export function timesValid(ds: DaySchedule) {
  return isStartBeforeEnd(ds.start1, ds.end1) &&
    isStartBeforeEnd(ds.start2, ds.end2) &&
    !isStartBeforeEnd(ds.start2, ds.end1);
}
