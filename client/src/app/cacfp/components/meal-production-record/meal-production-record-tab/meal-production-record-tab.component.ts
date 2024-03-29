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
  commentsForm: FormGroup;
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
    this.buildCommentsForm();
  }

  get mealProductionRecord() {
    return this._mpr;
  }

  @Input() supportedAgeGroups: string[] = [];

  /** Outputs */
  @Output() attendanceChanged: EventEmitter<MealAttendanceRecord> = new EventEmitter();
  @Output() foodItemChanged: EventEmitter<MealProductionFoodItem> = new EventEmitter();
  @Output() notesChanged: EventEmitter<string> = new EventEmitter();

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

  changedNotes() {
    this.notesChanged.emit(this.commentsForm.value.notes);
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
        this.attendanceForm.controls[mar.ageGroup].valueChanges.debounceTime(2000).subscribe(() => this.changedAttendance(mar));
      });
    }
  }

  /**
   * construct the foodItemsForm object
   */
  private buildFoodItemsForm() {
    this.foodItemsForm = this.formBuilder.group({});
    if (this.mealProductionRecord && this.mealProductionRecord.productionFoodItems) {
      this.mealProductionRecord.productionFoodItems.forEach(mpfi => {
        this.foodItemsForm.addControl(mpfi.foodItem.id, this.formBuilder.group({
          required: [mpfi.calcRequired, Validators.required],
          prepared: [mpfi.prepared, Validators.required],
          uom: [mpfi.uom, Validators.required]
        }))
        this.foodItemsForm.controls[mpfi.foodItem.id].valueChanges.debounceTime(2000).subscribe(() => this.changedFoodItem(mpfi));
      });
    }
  }

  /**
   * construct the commentsForm object
   */
  private buildCommentsForm() {
    this.commentsForm = this.formBuilder.group({
      notes: [(this.mealProductionRecord) ? this.mealProductionRecord.notes : undefined]
    });
    this.commentsForm.controls["notes"].valueChanges.debounceTime(2000).subscribe(() => this.changedNotes());
  }

  /**
   * Generate the production food items list in sorted order - to maintain order
   * even when the store changes
   * 
   * @returns {MealProductionFoodItem[]}
   */
  sortedProductionFoodItems(): MealProductionFoodItem[] {
    return (this.mealProductionRecord && this.mealProductionRecord.productionFoodItems) ?
      this.mealProductionRecord.productionFoodItems.concat().sort(this.compareFoodItems) : [];
  }

  /**
   * Compare 2 meal production food items based on 'sort order'
   *  
   * @param a {MealProductionFoodItem}
   * @param b {MealProductionFoodItem}
   * 
   * @return -1; 0; 1
   */
  compareFoodItems(a: MealProductionFoodItem, b: MealProductionFoodItem): number {
    const utils = new FoodItemUtils();
    var catA = utils.category(a.foodItem);
    var catB = utils.category(b.foodItem);
    const categories = utils.tagOrder();
    let val = categories.indexOf(catA) - categories.indexOf(catB);
    return val === 0 ? a.foodItem.description.localeCompare(b.foodItem.description) : val;
  }

  /**
   * Determine if enough of an item has been prepared
   * 
   * @param item {MealProductionItem} 
   * @return {boolean} 
   */
  enough(item: MealProductionFoodItem): boolean {
    const required = this.foodItemsForm.controls[item.foodItem.id].value.required;
    const prepared = this.foodItemsForm.controls[item.foodItem.id].value.prepared;

    return prepared >= required;
  }
}