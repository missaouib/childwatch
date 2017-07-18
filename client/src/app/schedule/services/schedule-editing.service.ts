import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import gql from 'graphql-tag';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';

import { Staff, Participant, DateType, Schedule, PersonType, Person } from '../interfaces';
import { AppState } from '../../../app/app.state';
import {
  HIDE_PERSON, selectStaff, selectParticipant, PersonSchedule,
  TimelinesByPerson, scheduleEditorDateChanged, scheduleEditorScheduleLoaded, updateSchedule, UPDATE_SCHEDULE
} from '../scheduling.state';
import { SchedulingQueryService, timelineQuery } from './scheduling-query.service';
import { isoDate, isoDateTime } from '../../../common/date-utils';

const updateStaffSchedule = gql`
  mutation updateStaffSchedule($staffId: String!, $date: Date!, $schedule: [ScheduleInput]!) {
    updateStaffSchedule(staffId: $staffId, date: $date, schedule: $schedule)
  }
`;

const updateParticipantSchedule = gql`
  mutation updateParticipantSchedule($participantId: String!, $date: Date!, $schedule: [ScheduleInput]!) {
    updateParticipantSchedule(participantId: $participantId, date: $date, schedule: $schedule)
  }
`;

@Injectable()
export class ScheduleManagementService {

  selectedPerson$: Observable<Person>;

  @Effect()
  loadScheduleOnSelect$ = this.store.select(s => s.scheduling.personSchedule)
    .filter(s => s && !!s.who && !!s.date)
    .distinctUntilChanged((a, b) => _.isEqual(a.who, b.who) && _.isEqual(a.date, b.date))
    .switchMap(({ who, type, date }) =>
      // TODO loading everyone's timelines is too big a gun here
      // TODO show loading status, handle error
      this.schedulingQueries.queryTimelines(date)
        .take(1)
        .map(({ staffTimeline, participantTimeline }) => {
          const timeline: TimelinesByPerson = type === PersonType.Participant ? participantTimeline : staffTimeline;
          return scheduleEditorScheduleLoaded(timeline && timeline[who.id] && timeline[who.id].schedule);
        }));

  @Effect({ dispatch: false })
  updateSchedule$ = this.actions$.ofType(UPDATE_SCHEDULE)
    .map(action => action.payload as Schedule[])
    .withLatestFrom(this.store.select(s => s.scheduling.personSchedule))
    // TODO add the types for these entities
    .concatMap(([newSchedule, personSchedule]) => {
      let mutation: any;
      const variables: any = {
        date: isoDate(personSchedule.date),
        schedule: newSchedule.map(s => ({
          roomId: s.roomId,
          start: isoDateTime(s.start),
          end: isoDateTime(s.end)
        }))
      };
      if (personSchedule.type === PersonType.Participant) {
        mutation = updateParticipantSchedule;
        variables.participantId = personSchedule.who.id;
      } else {
        mutation = updateStaffSchedule;
        variables.staffId = personSchedule.who.id;
      }
      // Will mutate ever return more than one value? If not any reason not to use switchMap instead of concatMap?
      return this.apollo.mutate({
        mutation,
        variables,
        refetchQueries: [timelineQuery(personSchedule.date)]
      });
    });

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private apollo: Apollo,
    private schedulingQueries: SchedulingQueryService
  ) {
    this.selectedPerson$ = store.select(state => state.scheduling.personSchedule)
      .map(schedule => schedule ? schedule.who : undefined);
  }

  get selectedPersonSchedule$(): Observable<PersonSchedule> {
    return this.store.select(s => s.scheduling.personSchedule);
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

  updateSchedule(schedule: Schedule[]) {
    this.store.dispatch(updateSchedule(schedule));
  }
}
