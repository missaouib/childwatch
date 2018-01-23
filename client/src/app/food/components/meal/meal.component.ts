import {User} from "../../../user/config.state";
import {UserService} from '../../../user/user.service';
import {FoodItem} from '../../model/food-item';
import {FoodItemUtils} from '../../model/food-item-utils';
import {Meal, buildMeal} from '../../model/meal';
import {MealFoodItem, compareMealFoodItems} from '../../model/meal-food-item';
import {MealRulesViolation} from '../../model/mealrulesviolation';
import {FoodStateService} from "../../services/food-state.service";
import {Component, OnInit, HostListener} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {UUID} from 'angular2-uuid';
import {ActivatedRoute} from '@angular/router';
import {ComponentCanDeactivate} from './pending-changes-guard';
import {Observable} from 'rxjs/Observable';
import {MealService} from '../../services/meal.service';
import {ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import 'rxjs/add/observable/forkJoin';


@Component({
  selector: 'cw-meal',
  templateUrl: './meal.component.html',
  styles: [`
    .customClass {
      background-color: #5bc0de;
      color: #fff;
    }
    .customClass .panel-body {
      background-color: #337aa7;
    }
    a:hover {
      cursor:pointer;
    }
    pseudolink:hover {
      cursor:pointer;
    }
  `]
})
export class MealComponent implements OnInit, ComponentCanDeactivate {

  FoodItemUtils: FoodItemUtils;

  editing = false;

  saving = false;

  meal: Meal = buildMeal();

  mealFoodItems: MealFoodItem[] = [];

  mealForm: FormGroup;

  AGEGROUPS: string[] = [];

  _activeTab: string = undefined;

  set activeTab(tab: string) {
    this._activeTab = tab;
    this.emptyShow = false;
  }

  get activeTab(): string {
    return this._activeTab;
  }

  dirtyFoodItems = false;

  rulesViolations: MealRulesViolation[] = [];

  isValidating = false;

  emptyShow = false;

  deletedList: string[] = [];

  meals: Meal[] = [];

  user: User;

  /**
   * @constructor
   */
  constructor(
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private mealSvc: MealService,
    public toastr: ToastsManager,
    private userSvc: UserService,
    private foodSvc: FoodStateService,
    vcr: ViewContainerRef,
  ) {
    this.FoodItemUtils = new FoodItemUtils();
    this.toastr.setRootViewContainerRef(vcr);
    this.activeRoute.queryParams.subscribe((params: any) => this.loadMeal(params['id']));
    this.foodSvc.meals$.subscribe((meals) => this.meals = meals);
  }

  /**
   * @onInit
   */
  ngOnInit() {
    this.userSvc.user$.subscribe(user => {
      this.user = user;
      this.AGEGROUPS = user.tenant.ageGroups;
      if (this.AGEGROUPS.length > 0) this.activeTab = this.AGEGROUPS[0];
    });
    this.mealForm = this.formBuilder.group({
      description: [this.meal.description, [Validators.required, this.validateMealNameUnique.bind(this), Validators.maxLength(100)]],
      type: [this.meal.type, Validators.required]
    });

  }

  /**
   * Validator for a unique meal name
   */
  validateMealNameUnique(control: AbstractControl) {
    return this.meals
      .filter(meal => meal.id != this.meal.id)
      .find(meal => meal.description.toUpperCase() === (control.value ? control.value.toUpperCase() : undefined)) ? {mealunique: true} : null;
  }

  /**
   * Flag to show/hide the food list
   */
  showFoodList() {
    return this.mealForm ? !this.mealForm.invalid : false;
  }

  /**
   * Determine the meal's CACFP status
   * 
   * @return {string} 
   */
  mealCacfpStatus(): string {
    if (!this.mealForm || !this.mealForm.valid || this.mealForm.dirty || this.dirtyFoodItems)
      return 'UNKNOWN';
    else if (this.mealFoodItems.length < 1)
      return 'UNKNOWN / NO ITEMS';

    return (this.rulesViolations.filter(v => v.severity === 'FAIL' && this.AGEGROUPS.includes(v.ageGroup)).length > 0) ? 'NONCOMPLIANT' : 'COMPLIANT';
  }

  /**
   * Determine the age group's CACFP status
   * 
   * @param ageGroup {string}
   * @return {string}
   */
  ageGroupCacfpStatus(ageGroup: string) {
    const foundItems = this.mealFoodItems.filter(fi => fi.ageGroup === ageGroup).length;
    const foundViolations = this.rulesViolations.filter(rv => rv.ageGroup === ageGroup && rv.severity === 'FAIL').length;
    return (foundItems === 0 || this.dirtyFoodItems) ? 'UNKNOWN' :
      (foundViolations > 0) ? 'NONCOMPLIANT' : 'COMPLIANT';
  }

  /**
   * Determine if the window can be closed 
   * Required to support transitions outside of the angular realm (app -> something else)
   * 
   * @returns {Observable<boolean> | boolean}
   */
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.mealForm.dirty && !this.dirtyFoodItems && !this.emptyShow;
  }


  /**
   * Callback when a meal food item is changed
   * 
   * @param {MealFoodItem} meal food item changed
   */
  changed(mealFoodItem: MealFoodItem) {
    const copy = this.mealFoodItems.filter(mfi => mfi.id !== mealFoodItem.id);

    console.log('Changed ', mealFoodItem);
    copy.push(mealFoodItem);
    this.mealFoodItems = copy;
    this.dirtyFoodItems = true;
  }

  /**
   * Callback when a meal food item is deleted
   * 
   * @param {id} id of the meal food item removed
   */
  deleted(id: string) {
    console.log('deleting ' + id);
    this.deletedList.push(id);
    const copy = this.mealFoodItems.filter(mfi => mfi.id !== id);
    this.mealFoodItems = copy;
    this.dirtyFoodItems = true;
  }

  compareMealFoodItems(a: MealFoodItem, b: MealFoodItem): number {
    return compareMealFoodItems(a, b);
  }


  /**
   * Fetches the list of meal food items for the age group in sorted order
   * 
   * @param ageGroup {string}
   * @returns 
   */
  mealFoodItemsFor(ageGroup: string) {
    return this.mealFoodItems.filter(mfi => mfi.ageGroup === ageGroup).sort(this.compareMealFoodItems);
  }


  save() {

    if (this.canDeactivate() || this.mealForm.get('description').value === undefined || this.mealForm.get('type').value === undefined) {
      this.toastr.info('There are no changes to be saved', 'Save');
      return;
    }
    const meal: Meal = {
      id: this.meal.id,
      description: this.mealForm.get('description').value,
      type: this.mealForm.get('type').value
    };
    this.mealSvc.update(meal).first().subscribe(() => {
      this.mealForm.markAsPristine();
      if (this.mealFoodItems.length === 0) {
        this.toastr.success('Meal ' + meal.description + ' has been saved', 'Save');
        this.saving = false;
        this.editing = false;
      }

      var join: Array<Observable<Response>> = new Array<Observable<Response>>();

      join = join.concat(
        this.mealFoodItems.map(mfi => this.mealSvc.updateMealFoodItem(mfi)),
        this.deletedList.map(del => this.mealSvc.deleteMealFoodItem(del))
      );


      Observable.forkJoin(join).subscribe(() => {
        this.toastr.success('Meal ' + meal.description + ' has been saved', 'Save');
        this.dirtyFoodItems = false;
        this.editing = false;
        this.saving = false;
        this.deletedList = [];
        this.mealSvc.validate(meal).subscribe(violations => this.rulesViolations = violations);
      });
    });
  }

  addMealFoodItem(foodItem: FoodItem, ageGroup?: string) {
    this.mealFoodItems.push({
      id: UUID.UUID(),
      ageGroup: ageGroup ? ageGroup : this.activeTab,
      quantity: 1,
      unit: this.FoodItemUtils.isCN(foodItem) ? 'SERVINGS' : foodItem.servingUom,
      meal: this.meal,
      foodItem: foodItem
    });
    this.dirtyFoodItems = true;
  }

  loadMeal(mealId: string) {
    if (mealId) {
      this.mealSvc.fetch(mealId).subscribe((meal: Meal) => {
        this.meal = (meal) ? meal : buildMeal();
        this.mealForm.patchValue({description: this.meal.description, type: this.meal.type});
        this.editing = (meal === undefined);
        if (meal) {
          this.mealSvc.queryMealFoodItemsFor(meal).subscribe(mealItems => {
            this.mealFoodItems = mealItems;
            this.mealFoodItems.forEach((mfi) => mfi.hasErrors = false);
          });
          this.mealSvc.validate(meal).subscribe(violations => this.rulesViolations = violations);
        }
      });
    } else {
      this.meal = buildMeal();
      this.editing = true;
    }
    this.deletedList = [];
  }


  rulesViolationsForCurrentAgeGroup(severity: string) {
    return this.rulesViolations.filter((v) => v.ageGroup === this.activeTab && v.severity === severity);
  }

  foodHasErrors(): boolean {
    return this.mealFoodItems.find(mfi => mfi.hasErrors) !== undefined;
  }

  hasErrors(id: string, errors: boolean) {
    console.log(`Event received that ${id} hasErrors = ${errors}`);
    let mfi: MealFoodItem = this.mealFoodItems.find(mfi => mfi.id === id);
    if (mfi)
      mfi.hasErrors = errors;
  }

  droppedFoodItem(foodItem: FoodItem) {
    console.log('droppedFoodItem ', foodItem);
    if (foodItem)
      this.addMealFoodItem(foodItem);
    this.emptyShow = false;
  }

  copyTo(ageGroup: string) {
    if (ageGroup === 'INFANTS') {
      this.AGEGROUPS.filter(a => a === 'AGE_0_5MO' || a === 'AGE_6_11MO').forEach(ag => this.copyTo(ag));
    }
    else if (ageGroup === 'NON_INFANTS') {
      this.AGEGROUPS.filter(a => a !== 'AGE_0_5MO' && a !== 'AGE_6_11MO').forEach(ag => this.copyTo(ag));
    }
    else if (ageGroup !== this.activeTab) {
      console.log('Copying ' + this.mealFoodItemsFor(this.activeTab).length + ' items; from ' + this.activeTab + ' to ' + ageGroup);
      this.mealFoodItemsFor(this.activeTab).forEach((item: MealFoodItem) => this.addMealFoodItem(item.foodItem, ageGroup));
    }

  }

}
