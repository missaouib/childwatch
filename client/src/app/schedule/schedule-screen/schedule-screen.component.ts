import { Component } from '@angular/core';

import { TimeService } from '../../time.service';
import { SchedulingService } from '../schedule.service';
import { dateTimestamp } from '../../../common/date-utils';
import { ViewControlsService } from '../view-controls/view-controls.service';

@Component({
  selector: 'cw-schedule-screen',
  templateUrl: './schedule-screen.component.html',
  styleUrls: ['./schedule-screen.component.css']
})
export class ScheduleScreenComponent {
  viewMode$ = this.viewControlService.mode;

  constructor(
    private viewControlService: ViewControlsService,
    scheduleService: SchedulingService,
    timeService: TimeService
  ) {
    scheduleService.initialize();

    // TODO move to effect
    timeService.currentTime
      .map(dateTimestamp)
      .distinctUntilChanged()
      .subscribe(date => scheduleService.loadTimelines(date));
  }
}
