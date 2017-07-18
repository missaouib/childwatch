import { AppState } from '../../app.state';
import { Food } from '../meal.interfaces';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { QUERY } from './meal-ql';
import { Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { staticMealDataReceived, MealState } from '../meal.state';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class FoodService {

  foods$: Observable<Food[]>;

  @Effect()
  _loadData = this.queryStaticData()
    .map(({ data }) => {
      console.log( data );
      return staticMealDataReceived(<MealState>data);
    });

  constructor( private store: Store<AppState>, private apollo: Apollo) {
    this.foods$ = this.store.select( s => s.meal.foods );
  }

  queryStaticData() {
    console.log( 'FoodService.queryStaticData');
    return this.apollo.watchQuery({
      query: QUERY.GET_FOOD_DATA
    }).map( ({data}) => data );
  }
}
