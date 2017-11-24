/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import {AppState} from '../../app.state';
import {User} from '../../config/config.state';
import * as FoodActions from '../food.actions';
import {Meal, MealFoodItem, MealRulesViolation} from '../food.interfaces';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Http, URLSearchParams, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';


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
    private http: Http
  ) {
    this.store.select(s => s.config.user).subscribe(user => this.user = user);
  }

  /**
   * Update the meal
   * 
   * @returns Observable<Response>
   */
  save(meal: Meal) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    var postMeal = {...meal};
    delete postMeal.compliant;

    return this.http.post(this.URL, postMeal, {headers: headers});
    // .map( () => this.store.dispatch( this.actions.mealSaved( meal ) ) );
  }

  /**
   * Add the meal food item to the given meal via REST call
   * 
   * @returns Observable<Response>
   */
  saveMealFoodItem(mealFoodItem: MealFoodItem): Observable<Response> {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    const item: any = {
      id: mealFoodItem.id,
      ageGroup: mealFoodItem.ageGroup,
      quantity: mealFoodItem.quantity,
      unit: mealFoodItem.unit,
      meal: (mealFoodItem.meal) ? '/api/meal/' + mealFoodItem.meal.id : undefined,
      foodItem: (mealFoodItem.foodItem) ? '/api/foodItem/' + mealFoodItem.foodItem.id : undefined
    };

    console.log('Saving a mealFoodItem ', item);

    return this.http.post('/api/mealFoodItem', item, {headers: headers}).map(res => res.json());
  }

  /**
   * Delete the meal food item
   */
  deleteMealFoodItem(mealFoodItemId: string) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);

    return this.http.delete('/api/mealFoodItem/' + mealFoodItemId, {headers: headers}).map((res) => res.json())
      .catch(() => Observable.of(mealFoodItemId));
  }

  /**
   * Query for the mealFoodItems associated with the given meal id
   * 
   * @param id Meal id
   * 
   */
  queryMealFoodItemsFor(meal: Meal) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    const params = new URLSearchParams();
    params.set('mealId', meal.id);
    params.set('projection', 'mealFoodItemFull');
    return this.http.get('/api/mealFoodItem/search/findByMealId', {search: params, headers: headers})
      .map(res => res.json())
      .map(({_embedded: {mealFoodItems}}) => mealFoodItems);
  }


  /**
   * Query for all meals
   * 
   * @returns Observable<Response>
   */
  query() {
    console.log(`meal.query() => tenant = ${this.user.tenant.id}`);
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);

    const params = new URLSearchParams();
    params.set('projection', MealService.FULL);

    return this.http.get(this.URL, {search: params, headers: headers})
      .map(res => res.json())
      .map(({_embedded: {meals}}) => this.store.dispatch(new FoodActions.MealsReceivedAction(meals)));
  }

  /**
   * Fetch a meal by ID
   * 
   * @returns Observable<Response>
   */
  fetch(id: string) {
    console.log(`meal.fetch() => tenant = ${this.user.tenant.id}`);

    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);


    const params = new URLSearchParams();
    params.set('projection', MealService.FULL);

    return this.http.get(this.URL + '/' + id, {search: params, headers: headers})
      .map(res => res.json());

  }

  /**
   * Validate the meal
   */
  validate(meal: Meal) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);

    const params = new URLSearchParams();
    params.set('mealId', meal.id);

    return this.http.get('/rules', {search: params, headers: headers})
      .map(res => {
        const violations: MealRulesViolation[] = res.json();
        console.log('found ' + violations.length + ' violations for ' + meal.description);
        const compliance = (violations.filter(v => v.severity === 'FAIL').length === 0);
        this.store.dispatch(new FoodActions.MealComplianceAction({meal: meal, compliance: compliance}));
        return violations;
      });
  }

}
