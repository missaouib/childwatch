import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { TimeService } from '../../time.service';
import { SchedulingService } from '../schedule.service';
import { SchedulingState } from '../scheduling.state';
import { dateTimestamp } from '../../../common/date-utils';
import { snapshotRooms, SnapshotRoom } from '../snapshot-trans';
import { timelineRooms, TimelineRoom } from '../room-timeline-screen/room-timeline/timeline-calculations';

@Component({
  selector: 'cw-room-assignment-screen',
  templateUrl: './room-assignment-screen.component.html',
  styleUrls: ['./room-assignment-screen.component.css']
})
export class RoomAssignmentScreenComponent {

  staff$ = this.scheduleService.staff;
  participants$ = this.scheduleService.participants;
  operation$ = this.scheduleService.timeStatus;
  rooms$: Observable<{ id: string; name: string; snapshot: SnapshotRoom; timeline: TimelineRoom }[]>;

  constructor(
    private scheduleService: SchedulingService,
    timeService: TimeService
  ) {
    // TODO: move to service
    this.rooms$ = Observable.combineLatest(
      this.scheduleService.whichTime,
      this.scheduleService.timeStatus,
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

