import {FoodItemUtils} from '../../model/food-item-utils';
import {ProductionFoodItem, AttendanceRecordSet} from '../../model/meal-production-record';
import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'cw-meal-production-record-tab',
  templateUrl: './meal-production-record-tab.component.html',
  styleUrls: ['./meal-production-record-tab.component.css']
})
export class MealProductionRecordTabComponent implements OnInit {
  attendanceForm: FormGroup;
  foodItemsForm: FormGroup;
  FoodItemUtils: FoodItemUtils;

  @Input() type: string;
  @Input() foodItems: ProductionFoodItem[];
  @Input() attendance: AttendanceRecordSet;
  @Output() attendanceChanged: EventEmitter<AttendanceRecordSet> = new EventEmitter();
  @Output() foodItemUnitChanged: EventEmitter<ProductionFoodItem> = new EventEmitter();
  @Output() foodItemPreparedChanged: EventEmitter<ProductionFoodItem> = new EventEmitter();


  constructor(private formBuilder: FormBuilder) {
    this.FoodItemUtils = new FoodItemUtils();
  }

  ngOnInit() {

    this.attendanceForm = this.formBuilder.group({
      AGE_1YR: this.formBuilder.group({
        planned: [undefined, Validators.required],
        actual: [undefined, Validators.required]
      }),
      AGE_2YR: this.formBuilder.group({
        planned: [undefined, Validators.required],
        actual: [undefined, Validators.required]
      }),
      AGE_3_5YR: this.formBuilder.group({
        planned: [undefined, Validators.required],
        actual: [undefined, Validators.required]
      }),
      AGE_6_12YR: this.formBuilder.group({
        planned: [undefined, Validators.required],
        actual: [undefined, Validators.required]
      }),
      AGE_13_18YR: this.formBuilder.group({
        planned: [undefined, Validators.required],
        actual: [undefined, Validators.required]
      }),
      AGE_ADULT: this.formBuilder.group({
        planned: [undefined, Validators.required],
        actual: [undefined, Validators.required]
      }),
      NON_PARTICIPANT: this.formBuilder.group({
        planned: [undefined, Validators.required],
        actual: [undefined, Validators.required]
      })
    });

    this.foodItemsForm = this.formBuilder.group({});
    if (this.foodItems) {
      this.foodItems.forEach(pfi =>
        this.foodItemsForm.addControl(pfi.foodItem.id, this.formBuilder.group({
          required: [undefined, Validators.required],
          produced: [undefined, Validators.required],
          units: ["GALLONS", Validators.required]
        })));
    }
  }

}
