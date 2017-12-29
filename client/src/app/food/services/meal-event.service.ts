import {AppState} from '../../app.state';
import {User} from '../../user/config.state';
import * as FoodActions from '../store/food.actions';
import {Meal} from '../model/meal';
import {MealEvent} from '../model/meal-event';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import * as moment from 'moment';

interface Response {
  _embedded: {mealEvent: MealEvent[]}
}

@Injectable()
export class MealEventService {

  static URL = '/api/mealEvent';
  user: User;

  /**
   * @constructor
   */
  constructor(
    private store: Store<AppState>,
    private http: HttpClient
  ) {
    this.store.select(s => s.config.user).subscribe(user => this.user = user);
  }

  /**
   * Query for menu items between two dates (inclusive)
   */
  queryBetween(start: Date, end: Date) {
    console.log(`meal_event.querybetween() => tenant = ${this.user.tenant.id}`);

    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };


    const params = {
      projection: 'mealEventFull',
      start: moment(start).format('MM/DD/YYYY'),
      end: moment(end).format('MM/DD/YYYY')
    };

    return this.http.get<Response>(MealEventService.URL + '/search/between', {params: params, headers: headers})
      .map(({_embedded: {mealEvent}}) =>
        this.store.dispatch(new FoodActions.MealEventsReceivedAction(mealEvent)));
  }

  queryForMeal(meal: Meal) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };

    const params = {
      projection: 'mealEventFull',
      mealId: meal.id
    };

    return this.http.get<Response>(MealEventService.URL + '/search/findByMealId', {params: params, headers: headers})
      .map(({_embedded: {mealEvent}}) => mealEvent);
  }

  save(mealEvent: MealEvent) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };

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
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };

    return this.http.delete(MealEventService.URL + '/' + mealEvent.id, {headers: headers});
  }

}
