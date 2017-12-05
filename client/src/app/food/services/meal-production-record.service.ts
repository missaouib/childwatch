import {MealProductionRecord} from '../model/meal-production-record';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MealProductionRecordService {

  constructor() {}

  newMPR: MealProductionRecord = {
    mealDate: new Date(),
    locked: false,
    breakfast: {
      foodItems: [{
        foodItem: {
          id: 'FOOD ITEM',
          description: 'A FOOD ITEM',
          shortDescription: 'FOOD',
          purchaseUom: 'GALLONS',
          servingUom: 'CUPS',
          notes: undefined,
          tags: [{value: 'MILK'}]
        },
        required: 0,
        prepared: undefined,
        units: undefined
      }, {
        foodItem: {
          id: 'FOOD ITEM #2',
          description: 'FOOD ITEM #2',
          shortDescription: 'FOOD ITEM',
          purchaseUom: 'LBS',
          servingUom: 'OZ',
          notes: undefined,
          tags: [{value: 'MEAT'}]
        },
        required: 0,
        prepared: undefined,
        units: undefined
      }],
      attendance: {
        AGE_0_5MO: {planned: 0, actual: undefined},
        AGE_6_11MO: {planned: 0, actual: undefined},
        AGE_1YR: {planned: 0, actual: undefined},
        AGE_2YR: {planned: 0, actual: undefined},
        AGE_3_5YR: {planned: 0, actual: undefined},
        AGE_6_12YR: {planned: 0, actual: undefined},
        AGE_13_18YR: {planned: 0, actual: undefined},
        AGE_ADULT: {planned: 0, actual: undefined},
        NON_PARTICIPANT: {planned: 0, actual: undefined}
      }
    },
    am_snack: {
      foodItems: undefined,
      attendance: undefined
    },
    lunch: {
      foodItems: undefined,
      attendance: undefined
    },
    pm_snack: {
      foodItems: undefined,
      attendance: undefined
    },
    dinner: {
      foodItems: undefined,
      attendance: undefined
    }
  };



  /**
   * Create new new MealProductionRecord for a given date
   */
  build(date?: Date): MealProductionRecord {
    let newMPR = Object.assign({}, this.newMPR);
    newMPR.mealDate = date || new Date();
    return newMPR;
  }

  queryByDate(date: Date): Observable<MealProductionRecord> {
    return Observable.of(this.build(date));
  }



}
