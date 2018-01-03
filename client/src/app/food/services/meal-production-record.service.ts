import {AppState} from '../../app.state';
import {User} from '../../user/config.state';
import {MealAttendanceRecord, MealProductionRecord, MealProductionFoodItem} from '../model/meal-production-record';
import {MealType} from '../model/meal-type';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import * as moment from 'moment';
import * as FoodActions from '../store/food.actions';

interface Response {
  _embedded: {mealProductionRecords: MealProductionRecord[]}
}

interface ResponseMPFI {
  _embedded: {mealProductionFoodItems: MealProductionFoodItem[]}
}

@Injectable()
export class MealProductionRecordService {

  static URL = '/api/mealProductionRecord';
  static FULL = 'mprFull';

  user: User;
  MealType: MealType = new MealType();

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
   * query for the MPR and if one doesnt exist, create it
   * 
   */
  queryByDate(date: Date, dontCreate?: boolean) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };


    const params = {
      date: moment(date).format('MM/DD/YYYY'),
      projection: MealProductionRecordService.FULL
    };

    return this.http.get<Response>(MealProductionRecordService.URL + '/search/byDate', {params: params, headers: headers})
      .map(({_embedded: {mealProductionRecords}}) => {
        if (!dontCreate) {
          console.log('creating any necessary records');
          this.http.get(MealProductionRecordService.URL + '/create', {params: params, headers: headers})
            .map(res => {
              console.log('Now loading what we created');
              return this.http.get<Response>(MealProductionRecordService.URL + '/search/byDate', {params: params, headers: headers})
                .map(({_embedded: {mealProductionRecords}}) => {
                  this.store.dispatch(new FoodActions.MealProductionRecordsReceivedAction(mealProductionRecords))
                }).subscribe();
            }).subscribe();
        }
        else
          this.store.dispatch(new FoodActions.MealProductionRecordsReceivedAction(mealProductionRecords))
      });
  }


  /**
   * Lock/Unlock the mpr
   * 
   * @param mpr meal production record to effect
   * @param locked new lock state for the mpr
   */
  lockMPR(mpr: MealProductionRecord, locked: boolean) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };


    return this.http.patch(MealProductionRecordService.URL + '/' + mpr.id, {id: mpr.id, locked: locked}, {headers: headers})
      .map(() => this.store.dispatch(new FoodActions.MealProductionRecordLockedAction({mprId: mpr.id, locked: locked})));
  }

  /**
   * Update the attendance record for an MPR
   * 
   * @param record meal attendance record to update
   */
  updateAttendance(record: MealAttendanceRecord) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };


    return this.http.put('/api/mealAttendanceRecord/' + record.id, record, {headers: headers})
      .map(() => this.store.dispatch(new FoodActions.MealAttendanceRecordUpdatedAction(record)));
  }

  /**
   * Retrieve the MealProductionFoodItems associated with the MPR
   * 
   * @param mpr
   * @param mprId
   */
  fetchFoodItemsForMPR(mpr: MealProductionRecord, mprId?: string) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };

    const params = {
      id: mprId ? mprId : mpr.id,
      projection: 'mpfiFull'
    };

    return this.http.get<ResponseMPFI>('/api/mealProductionFoodItem/search/byMPRId', {params: params, headers: headers})
      .map(({_embedded: {mealProductionFoodItems}}) => this.store.dispatch(new FoodActions.MealProductionFoodItemsReceivedAction(mealProductionFoodItems)));
  }

  /**
   * Refresh the values for an MPR
   * 
   * @param mprID
   */
  refreshMpr(mprId: string) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };

    const params = {
      mpr: mprId
    };
    return this.http.get(MealProductionRecordService.URL + '/refresh', {headers: headers, params: params})
      .map(() => this.fetchFoodItemsForMPR(null, mprId).subscribe())
      .subscribe();
  }

  /**
   * Update the meal production food item
   * 
   * @param productionFoodItem
   */
  updateMealProductionFoodItem(productionFoodItem: MealProductionFoodItem) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };

    console.log('saving mpfi', productionFoodItem);

    let copy = {
      id: productionFoodItem.id,
      prepared: productionFoodItem.prepared,
      uom: productionFoodItem.uom
    };

    return this.http.put('/api/mealProductionFoodItem/' + productionFoodItem.id, copy, {headers: headers})
      .map(() => this.store.dispatch(new FoodActions.MealProductionFoodItemUpdatedAction(productionFoodItem)));
  }


}
