import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { } from '@angular/router';

import { TimeService } from '../../time.service';
import { SchedulingService } from '../schedule.service';
import { ViewControlsService } from './view-controls.service';
import { ViewMode, OperationMode, DateType } from '../interfaces';
import { isoDateTime } from '../../../common/date-utils';

@Component({
  selector: 'cw-view-controls',
  templateUrl: './view-controls.component.html',
  styleUrls: ['./view-controls.component.css']
})
export class ViewControlsComponent {
  operation$ = this.scheduleService.timeStatus;

  // ISO formated times
  currentTime: Observable<string>;
  displayTime: Observable<string>;

  operation: Observable<OperationMode>;
  viewMode: Observable<ViewMode>;

  constructor(
    private scheduleService: SchedulingService,
    private viewControlsService: ViewControlsService,
    timeService: TimeService
  ) {

    this.currentTime = timeService.currentTime
      .map(now => isoDateTime(now));

    this.displayTime = this.scheduleService.whichTime
      .map(when => isoDateTime(when));

    this.operation = this.scheduleService.timeStatus;
    this.viewMode = this.viewControlsService.mode;
    // this.activatedRoute.
  }

  // Pass along message to service about mode switch
  updateViewMode(newMode: ViewMode) {
    this.viewControlsService.updateMode(newMode);
  }

  // Pass along message to service about operation switch
  updateTimeStatus(newStatus: OperationMode) {
    if (newStatus === 'LIVE') {
      this.viewControlsService.updateLive(true);
    } else {
      this.viewControlsService.updateLive(false);
    }
  }

  // Pass along message to service about user changing time
  updateReviewTime(newTime: DateType) {
    this.viewControlsService.updateReviewDate(newTime);
  }

}
