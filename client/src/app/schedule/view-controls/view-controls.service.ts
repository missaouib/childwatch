import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../app.state';
import { liveChanged, modeChanged, reviewingDateTimeChanged } from './view-controls.state';
import { DateType, ViewMode, OperationMode } from '../interfaces';


@Injectable()
export class ViewControlsService {
  // Raw pieces of state
  viewControls = this.store.select(s => s.scheduling.viewControl);
  live = this.viewControls.map(control => control.live);
  reviewingDateTime = this.viewControls.map(control => control.reviewingDateTime);
  mode = this.viewControls.map(control => control.mode);
  now = this.store.select(s => s.currentTime);


  // Derived state

  // The following holds the determination of the users 'Live', 'Schedule', 'Review' status
  timeStatus: Observable<OperationMode>;

  // Base on the state of 'Live' the following will provide
  // either the live time or the time entered by the user
  whichTime: Observable<DateType>;

  constructor(private store: Store<AppState>) {
    const currentTime = store.select(s => s.currentTime);
    this.timeStatus = Observable.combineLatest(this.live, this.reviewingDateTime, currentTime,
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
      .share();

    this.whichTime = Observable.combineLatest(
        this.reviewingDateTime,
        this.live,
        this.now,
        (reviewingDateTime, isLive, now) => isLive ? now : reviewingDateTime)
      // TODO: Investigate why sharing this seems to break other components
      // .share()
      ;
  }

  updateLive(live: boolean) {
    this.store.dispatch(liveChanged(live));
  }
  updateMode(mode: ViewMode) {
    this.store.dispatch(modeChanged(mode));
  }
  updateReviewDate(newDate: DateType) {
    this.store.dispatch(reviewingDateTimeChanged(newDate));
  }

}
