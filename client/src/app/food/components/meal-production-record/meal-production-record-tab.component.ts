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
  @Input() locked: boolean;


  constructor(private formBuilder: FormBuilder) {
    this.FoodItemUtils = new FoodItemUtils();
  }

  ngOnInit() {

    this.attendanceForm = this.formBuilder.group({
      AGE_1YR: this.formBuilder.group({
        planned: [(this.attendance && this.attendance.AGE_1YR) ? this.attendance.AGE_1YR.planned : 0, Validators.required],
        actual: [(this.attendance && this.attendance.AGE_1YR) ? this.attendance.AGE_1YR.actual : 0, Validators.required]
      }),
      AGE_2YR: this.formBuilder.group({
        planned: [(this.attendance && this.attendance.AGE_2YR) ? this.attendance.AGE_2YR.planned : 0, Validators.required],
        actual: [(this.attendance && this.attendance.AGE_2YR) ? this.attendance.AGE_2YR.actual : 0, Validators.required]
      }),
      AGE_3_5YR: this.formBuilder.group({
        planned: [(this.attendance && this.attendance.AGE_3_5YR) ? this.attendance.AGE_3_5YR.planned : 0, Validators.required],
        actual: [(this.attendance && this.attendance.AGE_3_5YR) ? this.attendance.AGE_3_5YR.actual : 0, Validators.required]
      }),
      AGE_6_12YR: this.formBuilder.group({
        planned: [(this.attendance && this.attendance.AGE_6_12YR) ? this.attendance.AGE_6_12YR.planned : 0, Validators.required],
        actual: [(this.attendance && this.attendance.AGE_6_12YR) ? this.attendance.AGE_6_12YR.actual : 0, Validators.required]
      }),
      AGE_13_18YR: this.formBuilder.group({
        planned: [(this.attendance && this.attendance.AGE_13_18YR) ? this.attendance.AGE_13_18YR.planned : 0, Validators.required],
        actual: [(this.attendance && this.attendance.AGE_13_18YR) ? this.attendance.AGE_13_18YR.actual : 0, Validators.required]
      }),
      AGE_ADULT: this.formBuilder.group({
        planned: [(this.attendance && this.attendance.AGE_ADULT) ? this.attendance.AGE_ADULT.planned : 0, Validators.required],
        actual: [(this.attendance && this.attendance.AGE_ADULT) ? this.attendance.AGE_ADULT.actual : 0, Validators.required]
      }),
      NON_PARTICIPANT: this.formBuilder.group({
        planned: [(this.attendance && this.attendance.NON_PARTICIPANT) ? this.attendance.NON_PARTICIPANT.planned : 0, Validators.required],
        actual: [(this.attendance && this.attendance.NON_PARTICIPANT) ? this.attendance.NON_PARTICIPANT.actual : 0, Validators.required]
      })
    });

    this.attendanceForm.valueChanges.debounceTime(500).subscribe(() => this.attendanceChanged.emit(this.attendance));

    this.foodItemsForm = this.formBuilder.group({});
    if (this.foodItems) {
      this.foodItems.forEach(pfi => {
        this.foodItemsForm.addControl(pfi.foodItem.id, this.formBuilder.group({
          required: [undefined, Validators.required],
          prepared: [undefined, Validators.required],
          units: ["GALLONS", Validators.required]
        }))
        this.foodItemsForm.get(pfi.foodItem.id).valueChanges.debounceTime(500).subscribe(() => this.foodItemUnitChanged.emit(this.foodItems[0]));
      });
    }
  }

}
