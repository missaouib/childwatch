import {AppState} from '../../app.state';
import {User} from '../../config/config.state';
import * as FoodActions from '../store/food.actions';
import {Meal} from '../model/meal';
import {MealEvent} from '../model/meal-event';
import {Injectable} from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import {Store} from '@ngrx/store';
import * as moment from 'moment';

@Injectable()
export class MealEventService {

  static URL = '/api/mealEvent';
  user: User;

  /**
   * @constructor
   */
  constructor(
    private store: Store<AppState>,
    private http: Http
  ) {
    this.store.select(s => s.config.user).subscribe(user => this.user = user);
  }

  /**
   * Query for menu items between two dates (inclusive)
   */
  queryBetween(start: Date, end: Date) {
    console.log(`meal_event.querybetween() => tenant = ${this.user.tenant.id}`);

    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);

    const params = new URLSearchParams();
    params.append('projection', 'mealEventFull');
    params.append('start', moment(start).format('MM/DD/YYYY'));
    params.append('end', moment(end).format('MM/DD/YYYY'));

    return this.http.get(MealEventService.URL + '/search/between', {search: params, headers: headers})
      .map(res => res.json())
      .map(({_embedded: {mealEvent}}) =>
        this.store.dispatch(new FoodActions.MealEventsReceivedAction(mealEvent)));
  }

  queryForMeal(meal: Meal) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);
    const params = new URLSearchParams();
    params.append('projection', 'mealEventFull');
    params.append('mealId', meal.id);

    return this.http.get(MealEventService.URL + '/search/findByMealId', {search: params, headers: headers})
      .map(res => res.json())
      .map(({_embedded: {mealEvent}}) => mealEvent);
  }

  save(mealEvent: MealEvent) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);
    return this.http.post(MealEventService.URL,
      {
        id: mealEvent.id,
        startDate: mealEvent.startDate,
        endDate: mealEvent.endDate,
        meal: '/api/meal/' + mealEvent.meal.id,
        recurrence: 'NONE'
      }, {headers: headers});
  }

  delete(mealEvent: MealEvent) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);
    return this.http.delete(MealEventService.URL + '/' + mealEvent.id, {headers: headers});
  }

}
