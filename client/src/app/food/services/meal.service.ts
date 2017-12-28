/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import {AppState} from '../../app.state';
import {User} from '../../config/config.state';
import * as FoodActions from '../store/food.actions';
import {Meal} from '../model/meal';
import {MealFoodItem} from '../model/meal-food-item';
import {MealRulesViolation} from '../model/mealrulesviolation';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

interface Response {
  _embedded: {mealFoodItems: MealFoodItem[]}
}

interface ResponseMeals {
  _embedded: {meals: Meal[]}
}


/**
 * MealService
 * 
 * @service
 */
@Injectable()
export class MealService {

  static FULL = 'mealFull';
  private URL = '/api/meal';

  private user: User;

  /**
   * MealService constructor
   * 
   * @constructor
   * 
   * @param store
   * @param http
   * @param actions
   * @param foodComponentSvc
   */
  constructor(
    private store: Store<AppState>,
    private http: HttpClient
  ) {
    this.store.select(s => s.config.user).subscribe(user => this.user = user);
  }

  /**
   * Update the meal
   * 
   * @returns Observable<Response>
   */
  save(meal: Meal): Observable<any> {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };


    var postMeal = {...meal};
    delete postMeal.compliant;

    return this.http.post(this.URL, postMeal, {headers: headers});
  }

  /**
   * Add the meal food item to the given meal via REST call
   * 
   * @returns Observable<Response>
   */
  saveMealFoodItem(mealFoodItem: MealFoodItem): Observable<any> {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };

    const item: any = {
      id: mealFoodItem.id,
      ageGroup: mealFoodItem.ageGroup,
      quantity: mealFoodItem.quantity,
      unit: mealFoodItem.unit,
      meal: (mealFoodItem.meal) ? '/api/meal/' + mealFoodItem.meal.id : undefined,
      foodItem: (mealFoodItem.foodItem) ? '/api/foodItem/' + mealFoodItem.foodItem.id : undefined
    };

    console.log('Saving a mealFoodItem ', item);

    return this.http.post('/api/mealFoodItem', item, {headers: headers});
  }

  /**
   * Delete the meal food item
   */
  deleteMealFoodItem(mealFoodItemId: string): Observable<any> {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };


    return this.http.delete('/api/mealFoodItem/' + mealFoodItemId, {headers: headers})
      .catch(() => Observable.of(mealFoodItemId));
  }

  /**
   * Query for the mealFoodItems associated with the given meal id
   * 
   * @param id Meal id
   * 
   */
  queryMealFoodItemsFor(meal: Meal): Observable<any[]> {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };

    const params = {
      mealId: meal.id,
      projection: 'mealFoodItemFull'
    };
    return this.http.get<Response>('/api/mealFoodItem/search/findByMealId', {params: params, headers: headers})
      .map(({_embedded: {mealFoodItems}}) => mealFoodItems);
  }


  /**
   * Query for all meals
   * 
   * @returns Observable<Response>
   */
  query(): Observable<any> {
    console.log(`meal.query() => tenant = ${this.user.tenant.id}`);
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };


    const params = {
      projection: MealService.FULL
    };

    return this.http.get<ResponseMeals>(this.URL, {params: params, headers: headers})
      .map(({_embedded: {meals}}) => this.store.dispatch(new FoodActions.MealsReceivedAction(meals)));
  }

  /**
   * Fetch a meal by ID
   * 
   * @returns Observable<Response>
   */
  fetch(id: string): Observable<any> {
    console.log(`meal.fetch() => tenant = ${this.user.tenant.id}`);

    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };


    const params = {
      projection: MealService.FULL
    };

    return this.http.get<Meal>(this.URL + '/' + id, {params: params, headers: headers});

  }

  /**
   * Validate the meal
   */
  validate(meal: Meal): Observable<any[]> {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };


    const params = {
      mealId: meal.id
    };

    return this.http.get<MealRulesViolation[]>('/rules', {params: params, headers: headers})
      .map(violations => {
        console.log('found ' + violations.length + ' violations for ' + meal.description);
        const compliance = (violations.filter(v => v.severity === 'FAIL').length === 0);
        this.store.dispatch(new FoodActions.MealComplianceAction({meal: meal, compliance: compliance}));
        return violations;
      });
  }

}
