import {AppState} from '../../app.state';
import {User} from '../../config/config.state';
import {MealAttendanceRecord, MealProductionRecord} from '../model/meal-production-record';
import {MealType} from '../model/meal-type';
import {Injectable} from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import {Store} from '@ngrx/store';
import * as moment from 'moment';
import * as FoodActions from '../store/food.actions';

@Injectable()
export class MealProductionRecordService {

  static URL = '/api/mealProductionRecord';
  static FULL = 'mprFull';

  user: User;
  MealType: MealType = new MealType();

  constructor(
    private store: Store<AppState>,
    private http: Http
  ) {
    this.store.select(s => s.config.user).subscribe(user => this.user = user);
  }

  /**
   * query for the MPR and if one doesnt exist, create it
   * 
   */
  queryByDate(date: Date, dontCreate?: boolean) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);

    const params = new URLSearchParams();
    params.append('date', moment(date).format('MM/DD/YYYY'));
    params.append('projection', MealProductionRecordService.FULL);

    return this.http.get(MealProductionRecordService.URL + '/search/byDate', {search: params, headers: headers})
      .map(res => res.json())
      .map(({_embedded: {mealProductionRecords}}) => {
        if (!dontCreate && (!mealProductionRecords || mealProductionRecords.length === 0)) {
          console.log('Didn\'t find any - creating');
          this.http.get(MealProductionRecordService.URL + '/create', {search: params, headers: headers})
            .map(res => {
              console.log('Now loading what we created');
              return this.http.get(MealProductionRecordService.URL + '/search/byDate', {search: params, headers: headers})
                .map(res => res.json())
                .map(({_embedded: {mealProductionRecords}}) => {
                  this.store.dispatch(new FoodActions.MealProductionRecordsReceivedAction(mealProductionRecords))
                }).subscribe();
            }).subscribe();
        }
        else
          this.store.dispatch(new FoodActions.MealProductionRecordsReceivedAction(mealProductionRecords))
      });
  }


  lockMPR(mpr: MealProductionRecord, locked: boolean) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);

    return this.http.patch(MealProductionRecordService.URL + '/' + mpr.id, {id: mpr.id, locked: locked}, {headers: headers})
      .map(() => this.store.dispatch(new FoodActions.MealProductionRecordLockedAction({mprId: mpr.id, locked: locked})));
  }

  updateAttendance(record: MealAttendanceRecord) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);

    return this.http.put('/api/mealAttendanceRecord/' + record.id, record, {headers: headers})
      .map(() => this.store.dispatch(new FoodActions.MealAttendanceRecordUpdatedAction(record)));
  }

  fetchFoodItemsForMPR(mpr: MealProductionRecord) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);

    const params = new URLSearchParams();
    params.append('id', mpr.id);
    params.append('projection', 'mpfiFull');

    return this.http.get('/api/mealProductionFoodItem/search/byMPRId', {search: params, headers: headers})
      .map(res => res.json())
      .map(({_embedded: {mealProductionFoodItems}}) => this.store.dispatch(new FoodActions.MealProductionFoodItemsReceivedAction(mealProductionFoodItems)));
  }


}
