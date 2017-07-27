import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../app.state';
import { liveChanged, modeChanged, reviewingDateTimeChanged } from './view-controls.state';
import { DateType, ViewMode } from '../interfaces';


@Injectable()
export class ViewControlsService {
  // Raw pieces of state
  viewControls = this.store.select(s => s.scheduling.viewControl).shareReplay();
  live = this.viewControls.map(control => control.live);
  reviewingDateTime = this.viewControls.map(control => control.reviewingDateTime);
  mode = this.viewControls.map(control => control.mode);

  constructor(private store: Store<AppState>) { }

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
