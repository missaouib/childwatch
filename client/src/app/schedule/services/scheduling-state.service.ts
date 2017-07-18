import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { Staff, Room, Participant, Schedule, Timeline, Presence, PersonType } from '../interfaces';
import { AppState } from '../../../app/app.state';
import { SchedulingState } from '../scheduling.state';
import { dateTimestamp} from '../../../common/date-utils';

@Injectable()
export class SchedulingStateService {

  schedules$: Observable<Schedule[]>;
  selectedParticipantTimeline: Observable<Timeline>;
  presences$: Observable<Presence[]>;

  constructor(private store: Store<AppState>) {
    // Combines current date and application state to obtain
    // the selected person's timeline for the day
    this.selectedParticipantTimeline = Observable.combineLatest(
      this.appState$.map(s => dateTimestamp(s.currentTime)).distinctUntilChanged(),
      this.state$,
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
      });

    this.presences$ = this.selectedParticipantTimeline
      .map(timeline => timeline && timeline.presence ? timeline.presence : undefined);

    this.schedules$ = this.selectedParticipantTimeline
      .map(timeline => timeline && timeline.schedule ? timeline.schedule : undefined);

  }

  get staff$(): Observable<Staff[]> {
    return this.store.select(s => s.scheduling.staff);
  }

  get participants$(): Observable<Participant[]> {
    return this.store.select(s => s.scheduling.participants);
  }

  get rooms$(): Observable<Room[]> {
    return this.store.select(s => s.scheduling.rooms);
  }

  get state$(): Observable<SchedulingState> {
    return this.store.select(s => s.scheduling);
  }

  get appState$(): Observable<AppState> {
    return this.store.select(s => s);
  }

  get currentTime$(): Observable<number> {
    return this.store.select(s => s.currentTime);
  }
}
