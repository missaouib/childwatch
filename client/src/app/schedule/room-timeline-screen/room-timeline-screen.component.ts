import { Component } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

import { Participant, DateType } from '../interfaces';
import { SnapshotRoom } from '../snapshot-trans';
import { TimelineRoom } from './room-timeline/timeline-calculations';
import { SchedulingService } from '../schedule.service';

@Component({
  selector: 'cw-room-timeline-screen',
  templateUrl: './room-timeline-screen.component.html',
  styleUrls: ['./room-timeline-screen.component.css']
})
export class RoomTimelineScreenComponent {
  rooms$: Observable<{ id: string; name: string; snapshot: SnapshotRoom; timeline: TimelineRoom }[]>;
  participants$: Observable<Participant[]>;
  whichTime = this.scheduleService.whichTime;
  dayStart$: Observable<DateType>;

  constructor(
    private scheduleService: SchedulingService,
  ) {

    this.dayStart$ = scheduleService.whichTime
      .map(dateString => moment(dateString).startOf('day').valueOf());

      this.rooms$ = scheduleService.processedRooms;
  }

  trackRoomsBy(room: any) {
    return room.id;
  }
}
