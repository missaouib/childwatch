import {AppState} from '../../../../app.state';
import {FoodItemUtils} from '../../../model/food-item-utils';
import {MealProductionRecord, MealAttendanceRecord, MealProductionFoodItem} from '../../../model/meal-production-record';
import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';

@Component({
  selector: 'cw-meal-production-record-tab',
  templateUrl: './meal-production-record-tab.component.html',
  styleUrls: ['./meal-production-record-tab.component.css']
})
export class MealProductionRecordTabComponent implements OnInit {
  attendanceForm: FormGroup;
  foodItemsForm: FormGroup;
  FoodItemUtils: FoodItemUtils;
  mealProductionRecord: MealProductionRecord;


  @Input() tab: string;
  @Output() attendanceChanged: EventEmitter<MealAttendanceRecord> = new EventEmitter();
  @Output() foodItemUnitChanged: EventEmitter<MealProductionFoodItem> = new EventEmitter();
  @Output() foodItemPreparedChanged: EventEmitter<MealProductionFoodItem> = new EventEmitter();


  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>) {
    this.store.select(s => s.food.mealProductionRecords).subscribe(mprs => {
      console.log('I found ' + mprs.length + ' mprs ');
      console.log('tab = ' + this.tab);
      mprs.length > 0 && console.log('mpr = ', mprs[0]);
      this.mealProductionRecord = mprs.find(mpr => mpr.type === this.tab);
      console.log('setting mpr to ', this.mealProductionRecord);
    });
    this.FoodItemUtils = new FoodItemUtils();
  }

  ngOnInit() {

    this.attendanceForm = this.formBuilder.group({});
    if (this.mealProductionRecord && this.mealProductionRecord.attendanceRecords)
      this.mealProductionRecord.attendanceRecords.forEach(mar => {
        this.attendanceForm.addControl(mar.ageGroup, this.formBuilder.group({
          projected: [mar.projected, Validators.required],
          actual: [mar.actual, Validators.required]
        }));
      });


    this.foodItemsForm = this.formBuilder.group({});
    if (this.mealProductionRecord && this.mealProductionRecord.productionFoodItems) {
      this.mealProductionRecord.productionFoodItems.forEach(mpfi => {
        this.foodItemsForm.addControl(mpfi.foodItem.id, this.formBuilder.group({
          required: [undefined, Validators.required],
          prepared: [undefined, Validators.required],
          units: ["GALLONS", Validators.required]
        }))
      });
    }
  }

}
