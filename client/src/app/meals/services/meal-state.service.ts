import { AppState } from '../../app.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Food } from '../meal.interfaces';


@Injectable()
export class MealStateService {

  constructor(private store: Store<AppState>) {}

  get foods$(): Observable<Food[]> {
    return this.store.select(s => s.meal.foods);
  }
}
