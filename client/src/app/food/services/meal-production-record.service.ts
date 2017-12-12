import {AppState} from '../../app.state';
import {User} from '../../config/config.state';
import {AgeGroup} from '../model/age-group';
import {MealProductionRecord, MealAttendanceRecord} from '../model/meal-production-record';
import {Injectable} from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import {Store} from '@ngrx/store';
import * as moment from 'moment';
import * as FoodActions from '../store/food.actions';

@Injectable()
export class MealProductionRecordService {

  static URL = '/api/mealProductionRecord';

  user: User;

  constructor(
    private store: Store<AppState>,
    private http: Http
  ) {
    this.store.select(s => s.config.user).subscribe(user => this.user = user);
  }

  createMealAttendenceRecords(): MealAttendanceRecord[] {
    return AgeGroup.ALL.map(ageGroup => ({id: 'mar', ageGroup: ageGroup, projected: 0, actual: 0}));
  }

  createEmptyMPR(date: Date, type: string): MealProductionRecord {
    return {
      id: 'new record',
      mealDate: date,
      type: type,
      locked: false,
      lockDate: undefined,
      meal: undefined,
      notes: undefined,
      mealAttendanceRecords: this.createMealAttendenceRecords(),
      mealProductionFoodItems: undefined
    }
  }


  queryByDate(date: Date) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);

    const params = new URLSearchParams();
    params.append('date', moment(date).format('MM/DD/YYYY'));

    return this.http.get(MealProductionRecordService.URL + '/search/byDate', {search: params, headers: headers})
      .map(res => res.json())
      .map(({_embedded: {mealProductionRecords}}) =>
        this.store.dispatch(new FoodActions.MealProductionRecordsReceivedAction(mealProductionRecords)));
  }



}
