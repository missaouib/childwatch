import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { setCurrentTime } from './app.state';

@Injectable()
export class TimeService {
  @Effect()
  tick$ = Observable.interval(1000).map(() => setCurrentTime(Date.now()));

  constructor() { }
}
