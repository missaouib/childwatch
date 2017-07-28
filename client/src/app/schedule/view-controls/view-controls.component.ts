import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ViewControlsService } from './view-controls.service';
import { ViewMode, OperationMode, DateType } from '../interfaces';
import { isoDateTime } from '../../../common/date-utils';

@Component({
  selector: 'cw-view-controls',
  templateUrl: './view-controls.component.html',
  styleUrls: ['./view-controls.component.css']
})
export class ViewControlsComponent {
  operation$ = this.viewControlService.timeStatus;

  // ISO formated times
  currentTime: Observable<string>;
  displayTime: Observable<string>;

  operation: Observable<OperationMode>;
  viewMode: Observable<ViewMode>;

  constructor(private viewControlService: ViewControlsService) {

    this.currentTime = this.viewControlService.now
      .map(now => isoDateTime(now));

    this.displayTime = this.viewControlService.whichTime
      .map(when => isoDateTime(when));

    this.operation = this.viewControlService.timeStatus;
    this.viewMode = this.viewControlService.mode;
  }

  // Pass along message to service about mode switch
  updateViewMode(newMode: ViewMode) {
    this.viewControlService.updateMode(newMode);
  }

  // Pass along message to service about operation switch
  updateTimeStatus(newStatus: OperationMode) {
    if (newStatus === 'LIVE') {
      this.viewControlService.updateLive(true);
    } else {
      this.viewControlService.updateLive(false);
    }
  }

  // Pass along message to service about user changing time
  updateReviewTime(newTime: DateType) {
    this.viewControlService.updateReviewDate(newTime);
  }

}
