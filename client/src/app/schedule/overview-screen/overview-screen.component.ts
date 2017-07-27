import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { TimeService } from '../../time.service';
import { snapshotRooms, SnapshotRoom } from '../snapshot-trans';
import { timelineRooms, TimelineRoom } from '../room-timeline-screen/room-timeline/timeline-calculations';
import { SchedulingService } from '../schedule.service';
import { SchedulingState } from '../scheduling.state';
import { dateTimestamp } from '../../../common/date-utils';

@Component({
  selector: 'cw-overview-screen',
  templateUrl: './overview-screen.component.html',
  styleUrls: ['./overview-screen.component.css']
})
export class OverviewScreenComponent {
  operation$ = this.scheduleService.timeStatus;
  rooms$: Observable<{ id: string; name: string; snapshot: SnapshotRoom; timeline: TimelineRoom }[]>;

  constructor(
    private scheduleService: SchedulingService,
    timeService: TimeService
  ) {

    this.rooms$ = Observable.combineLatest(
      scheduleService.whichTime,
      scheduleService.timeStatus,
      timeService.currentTime,
      scheduleService.schedulingState,
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
    ).shareReplay();
  }

  trackRoomsBy(room: any) {
    return room.id;
  }

}
