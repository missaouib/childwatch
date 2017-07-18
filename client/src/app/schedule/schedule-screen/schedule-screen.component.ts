import { Component } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

import {
  Participant, Staff, DateType
} from '../interfaces';
import { snapshotRooms, SnapshotRoom } from '../snapshot-trans';
import { timelineRooms, TimelineRoom } from '../room-timeline/timeline-calculations';
import { SchedulingQueryService } from '../services/scheduling-query.service';
import { dateTimestamp } from '../../../common/date-utils';
import { SchedulingStateService } from '../services/scheduling-state.service';
import { SchedulingState } from '../scheduling.state';
import { ViewControlsService } from '../view-controls/view-controls.service';

@Component({
  selector: 'cw-schedule-screen',
  templateUrl: './schedule-screen.component.html',
  styleUrls: ['./schedule-screen.component.css']
})
export class ScheduleScreenComponent {


  operation$ = this.viewControlService.timeStatus;
  rooms$: Observable<{ id: string; name: string; snapshot: SnapshotRoom; timeline: TimelineRoom }[]>;
  staff$: Observable<Staff[]>;
  participants$: Observable<Participant[]>;
  viewMode$ = this.viewControlService.mode;
  whichTime = this.viewControlService.whichTime;
  dayStart$: Observable<DateType>;

  constructor(
    private state: SchedulingStateService,
    private scheduleQueries: SchedulingQueryService,
    private viewControlService: ViewControlsService,
  ) {
    this.scheduleQueries.initialize();
    this.staff$ = this.state.staff$;
    this.participants$ = this.state.participants$;

    // Kickoff side effect process?
    this.viewControlService.now
      .map(dateTimestamp)
      .distinctUntilChanged()
      .subscribe(date => scheduleQueries.loadTimelines(date));

    this.dayStart$ = this.viewControlService.whichTime
      .map(dateString => moment(dateString).startOf('day').valueOf());

    this.viewControlService.now.subscribe();

    // TODO: move to service
    this.rooms$ = Observable.combineLatest(
      this.viewControlService.whichTime,
      this.viewControlService.timeStatus,
      state.appState$.map(s => s.currentTime),
      state.appState$.map(s => s.scheduling).distinctUntilChanged(_.isEqual),
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
      }
    ).share();
  }

  trackRoomsBy(room: any) {
    return room.id;
  }
}
