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
  HEADERS = {
    'X-CHILDWATCH-TENANT': null,
    'X-CHILDWATCH-USER': null
  };

  /**
   * @constructor
   */
  constructor(
    private store: Store<AppState>,
    private http: HttpClient
  ) {
    this.store.select(s => s.config.user).subscribe(user => {
      this.HEADERS['X-CHILDWATCH-TENANT'] = (user) ? user.tenant.id : null;
      this.HEADERS['X-CHILDWATCH-USER'] = (user) ? user.id : null;
    });
  }

  /**
   * Query for menu items between two dates (inclusive)
   */
  queryBetween(start: Date, end: Date) {
    const params = {
      projection: 'mealEventFull',
      start: moment(start).format('MM/DD/YYYY'),
      end: moment(end).format('MM/DD/YYYY')
    };

    return this.http.get<Response>(MealEventService.URL + '/search/between', {params: params, headers: this.HEADERS})
      .map(({_embedded: {mealEvent}}) =>
        this.store.dispatch(new FoodActions.MealEventsReceivedAction(mealEvent)));
  }

  queryForMeal(meal: Meal) {

    const params = {
      projection: 'mealEventFull',
      mealId: meal.id
    };

    return this.http.get<Response>(MealEventService.URL + '/search/findByMealId', {params: params, headers: this.HEADERS})
      .map(({_embedded: {mealEvent}}) => mealEvent);
  }

  update(mealEvent: MealEvent) {

    const mealEventProxy = {
      id: mealEvent.id,
      startDate: mealEvent.startDate,
      endDate: mealEvent.endDate,
      meal: '/api/meal/' + mealEvent.meal.id,
      recurrence: mealEvent.recurrence || 'NONE',
      masterEvent: mealEvent.masterEvent
    };

    console.log(`Saving meal event for ${mealEvent.startDate}; recurrence: ${mealEvent.recurrence}; masterEvent:${mealEvent.masterEvent !== undefined}`);
    return this.http.post(MealEventService.URL, mealEventProxy, {headers: this.HEADERS});
  }

  delete(mealEvent: MealEvent) {
    return this.http.delete(MealEventService.URL + '/' + mealEvent.id, {headers: this.HEADERS});
  }

}
