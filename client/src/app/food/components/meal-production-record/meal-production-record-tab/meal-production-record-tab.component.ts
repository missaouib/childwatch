import {AgeGroup} from '../../../model/age-group';
import {FoodItemUtils} from '../../../model/food-item-utils';
import {MealProductionRecord, MealAttendanceRecord, MealProductionFoodItem} from '../../../model/meal-production-record';
import {MealType} from '../../../model/meal-type';
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
  AgeGroup: AgeGroup;
  MealType: MealType;
  _mpr: MealProductionRecord;

  /** Input for meal production record */
  @Input()
  set mealProductionRecord(mpr: MealProductionRecord) {
    this._mpr = mpr;
    this.buildAttendanceForm();
    this.buildFoodItemsForm();
  }

  get mealProductionRecord() {
    return this._mpr;
  }

  /** Outputs */
  @Output() attendanceChanged: EventEmitter<MealAttendanceRecord> = new EventEmitter();
  @Output() foodItemChanged: EventEmitter<MealProductionFoodItem> = new EventEmitter();

  /**
   * @constructor
   */
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.FoodItemUtils = new FoodItemUtils();
    this.AgeGroup = new AgeGroup();
    this.MealType = new MealType();
  }

  /**
   * @onInit
   */
  ngOnInit() {}

  /**
   * Retrieve the attendance record for a given age group
   * 
   * @param ageGroup
   * @returns MealAttendanceRecord for the age group; undefined if not found
   */
  attendanceRecordFor(ageGroup: string): MealAttendanceRecord {
    return this.mealProductionRecord.attendanceRecords.find(r => r.ageGroup == ageGroup);
  }

  /**
   * Callback for changes to a meal attendance record
   * 
   * @param record meal attendance record that changed
   */
  changedAttendance(record: MealAttendanceRecord) {
    console.log(this.attendanceForm.controls[record.ageGroup]);
    let copy = {...record};
    copy.mpr = this.mealProductionRecord;
    copy.actual = this.attendanceForm.controls[record.ageGroup].value.actual;
    copy.projected = this.attendanceForm.controls[record.ageGroup].value.projected;

    console.log(`actual = ${copy.actual}; projected = ${copy.projected} `)
    this.attendanceChanged.emit(copy);
  }

  /**
   * Callback for changes to a meal production food item values
   * 
   * @param mpfi meal production food item that changed
   */
  changedFoodItem(mpfi: MealProductionFoodItem) {
    let copy: MealProductionFoodItem = {...mpfi};

    copy.prepared = this.foodItemsForm.controls[mpfi.foodItem.id].value.prepared;
    copy.uom = this.foodItemsForm.controls[mpfi.foodItem.id].value.uom;
    copy.mpr = this.mealProductionRecord;

    this.foodItemChanged.emit(copy);
  }

  /**
   * construct the attendanceForm object
   */
  private buildAttendanceForm() {
    this.attendanceForm = this.formBuilder.group({});
    if (this.mealProductionRecord && this.mealProductionRecord.attendanceRecords) {
      //console.log(`There are ${this.mealProductionRecord.attendanceRecords.length} attendance records for ${this.mealProductionRecord.type}`);
      this.mealProductionRecord.attendanceRecords.forEach(mar => {
        //console.log(`Adding attendanceRecord for age group ${mar.ageGroup}; projected=${mar.projected}, actual=${mar.actual}`);
        this.attendanceForm.addControl(mar.ageGroup, this.formBuilder.group({
          projected: [mar.projected, Validators.required],
          actual: [mar.actual, Validators.required]
        }));
        this.attendanceForm.controls[mar.ageGroup].valueChanges.debounceTime(500).subscribe(() => this.changedAttendance(mar));
      });
    }
  }

  /**
   * construct the foodItemsForm object
   */
  private buildFoodItemsForm() {
    this.foodItemsForm = this.formBuilder.group({});
    if (this.mealProductionRecord && this.mealProductionRecord.productionFoodItems) {
      //console.log(`There are ${this.mealProductionRecord.productionFoodItems.length} productionFoodItems for ${this.mealProductionRecord.type}`);
      this.mealProductionRecord.productionFoodItems.forEach(mpfi => {
        //console.log(`creating component ${mpfi.foodItem.id} calc=${mpfi.calcRequired}; required=${mpfi.required}`);
        this.foodItemsForm.addControl(mpfi.foodItem.id, this.formBuilder.group({
          required: [mpfi.calcRequired, Validators.required],
          prepared: [mpfi.prepared, Validators.required],
          uom: [mpfi.uom, Validators.required]
        }))
        this.foodItemsForm.controls[mpfi.foodItem.id].valueChanges.debounceTime(500).subscribe(() => this.changedFoodItem(mpfi));
      });
    }
  }

}
