import { AppState } from '../../app.state';
import { FoodActions } from '../food.actions';
import { MealEvent } from '../food.interfaces';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

@Injectable()
export class MealEventService {
  
  static URL = '/api/mealEvent';

  /**
   * @constructor
   */
  constructor(
    private store: Store<AppState>,
    private http: Http,
    private actions: FoodActions
  ) { }

  /**
   * Query for menu items between two dates (inclusive)
   */
  queryBetween(start: Date, end: Date) {
    const params = new URLSearchParams();
    params.append( 'projection', 'mealEventFull' );
    params.append( 'start', moment( start ).format( 'MM/DD/YYYY' ) );
    params.append( 'end', moment(end).format( 'MM/DD/YYYY' ) );

    return this.http.get( MealEventService.URL + '/search/between', {search: params} )
      .map( res => res.json() )
      .map( ({_embedded: {mealEvent} }) => 
          this.store.dispatch( this.actions.mealEventsReceived( { start: start, end: end, mealEvents: mealEvent } ) ) );
  }
  
  save( mealEvent: MealEvent ) {
    return this.http.post( MealEventService.URL, 
      {
        id: mealEvent.id,
        startDate: mealEvent.startDate,
        endDate: mealEvent.endDate,
        meal: '/api/meal/' + mealEvent.meal.id,
        recurrence: 'NONE'
      });
  }
  
  delete( mealEvent: MealEvent ) {
      return this.http.delete( MealEventService.URL + '/' + mealEvent.id );
  }
  
}
