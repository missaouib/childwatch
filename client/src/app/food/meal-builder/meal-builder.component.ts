/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import {FoodComponent, Meal, FoodItem} from '../food.interfaces';
import {FoodStateService} from '../services/food-state.service';
import {Component, OnInit, ViewChild, ElementRef, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {UUID} from 'angular2-uuid';


/**
 * MealBuilderComponent
 * 
 * @component
 */
@Component({
  selector: 'cw-meal-builder',
  templateUrl: './meal-builder.component.html',
  styleUrls: ['./meal-builder.component.css']
})
export class MealBuilderComponent implements OnInit {

  @ViewChild('containerPieChart')
  element: ElementRef;

  AGEGROUPS = ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT'];

  foodComponents: any[] = [];

  mealForm: FormGroup;
  foodItems: FormArray;

  food: FoodItem[] = [];

  activeTab = 'AGE_0_5MO';

  meal: Meal = {
    id: undefined,
    description: undefined,
    type: undefined
  };

  Stats: any[] = [
    {component: 'MILK', population: 2, color: '#98abc5'},
    {component: 'VEGETABLES/FRUIT', population: 1, color: '#8a89a6'},
    {component: 'GRAINS', population: 2, color: '#7b6888'}
  ];

  /**
   * constructor for the MealBuilderComponent
   * 
   * @constructor
   */
  constructor(
    private state: FoodStateService,
    private formBuilder: FormBuilder,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  /**
   * Initialization of the component
   * 
   * @onInit
   */
  ngOnInit() {
    // create the meal form
    this.mealForm = this.formBuilder.group({
      id: undefined,
      name: [undefined, Validators.required],
      type: [undefined, Validators.required],
      AGE_0_5MO: this.formBuilder.array([]),
      AGE_6_11MO: this.formBuilder.array([]),
      AGE_1_2YR: this.formBuilder.array([]),
      AGE_3_5YR: this.formBuilder.array([]),
      AGE_6_12YR: this.formBuilder.array([]),
      AGE_13_18YR: this.formBuilder.array([]),
      AGE_ADULT: this.formBuilder.array([])
    });

    // subscribe to the current meal
    // this is where the initial data will reside
    this.state.currentMeal$.subscribe((currentMeal: Meal) => {
      console.log('currentMeal id = ' + currentMeal.id + '');
      this.mealForm.patchValue({'name': currentMeal.description, 'type': currentMeal.type});
      this.meal = currentMeal;
      if ( this.meal.id ) { this.state.mealFoodItemsFor( this.meal.id ); }
    });

    // get the food components
    this.state.foodComponents$.subscribe((fc: FoodComponent[]) => {
      this.foodComponents = fc.filter((c: FoodComponent) => c.parentComponent === null)
        .map((f: FoodComponent) => {return {...f, children: []};});
      fc.filter((c) => c.parentComponent !== null)
        .forEach((c) => this.foodComponents.find((p) => p.id === c.parentComponent.id).children.push(c));

    });

    // get the food items
    this.state.foodItems$.subscribe((fi: FoodItem[]) => this.food = fi);

    // when the name/type change - save the meal
    this.mealForm.valueChanges.debounceTime(3000).subscribe(() => {
      if (this.mealForm.valid && (this.mealForm.get('name').dirty || this.mealForm.get('type').dirty)) {
        this.toastr.success('Saved the meal ' + this.mealForm.get('name').value + ' (' + this.mealForm.get('type').value + ')', 'Save');
        const meal = this.buildMeal();
        this.state.updateMeal(meal);
        this.mealForm.markAsPristine();
        this.mealForm.markAsUntouched();        
      }
    });
    
    this.state.currentMealFoodItems$.subscribe( (mealFoodItems) => {
      this.clearMealFoodItems();
            
      mealFoodItems.forEach( (mealFoodItem) => {
            console.log( 'Adding ' + mealFoodItem.foodItem.description + ' to ' + mealFoodItem.ageGroup + ' units = ' + mealFoodItem.unit );
          (this.mealForm.get( mealFoodItem.ageGroup) as FormArray)
            .push(this.createMealFoodItem(            
              mealFoodItem.foodItem.description, 
              mealFoodItem.foodItem.foodComponent, 
              mealFoodItem.quantity.toString(), 
              mealFoodItem.unit, 
              mealFoodItem.foodItem.id ) ); 
      });
    });

  }
  
  clearMealFoodItems() {
    this.AGEGROUPS.forEach( (ageGroup) => {
      const ageGroupArray = (this.mealForm.get(ageGroup) as FormArray ); 
      for ( let i = 0; i < ageGroupArray.length; i++ )  { ageGroupArray.removeAt( i ); }
    });
  }

  /**
   * Activates the given tab
   * 
   * @param tabName
   */
  activateTab(tabName: string) {
    this.activeTab = tabName;
    this.foodItems = this.mealForm.get(this.activeTab) as FormArray;
  }

  /**
   * fetches the food for the given component by filtering the full list
   * 
   * @param component {FoodComponent}
   *  
   * @returns FoodItem[]
   */
  foodForComponent(component: FoodComponent): FoodItem[] {
    return this.food.filter((fi) => fi.foodComponent.id === component.id);
  }

  /**
   * Creates a new MealFoodItem 
   * 
   * @returns FormGroup
   */
  createMealFoodItem(description: string, foodComponent: FoodComponent, quantity: string, unit: string, foodItemId: string): FormGroup {
    const ctrl = this.formBuilder.group({
      mealFoodItemId: UUID.UUID(),
      description: [description, Validators.required],
      foodComponent: [foodComponent, Validators.required],
      quantity: [quantity, Validators.required],
      unit: [unit, Validators.required],
      foodItemId: [foodItemId, Validators.required]
    });
    
    // when the mealFoodItem changes - save it
    ctrl.valueChanges.debounceTime(3000).subscribe(($event) => {
      // we're only valid if we have a foodItemId
      if ($event.foodItemId) {
        this.state.updateMealFoodItem($event, this.activeTab, this.meal);
        this.toastr.success('Saved the meal ' + this.mealForm.get('name').value + ' (' + this.mealForm.get('type').value + ')', 'Save');
      }
    });
    return ctrl;
  }

  /**
   * Add a food component to the meal
   * 
   * @param c {FoodComponent}
   */
  addComponent(c: FoodComponent): void {
    this.foodItems = this.mealForm.get(this.activeTab) as FormArray;
    this.foodItems.push(this.createMealFoodItem( undefined, c, '1', 'each', undefined ));
  }

  /**
   * Copies an age group's components to another age group (or ALL)
   * 
   * @param ageGroup - ageGroup to copy to (can also be ALL )
   * @param [except] - agetGroup to not copy to (useful for not copying to yourself)
   */
  copyTo(ageGroup: string, except?: string): void {
    if (ageGroup === 'ALL') {
      this.AGEGROUPS.filter((ag) => ag !== except)
        .forEach((ag) => this.copyTo(ag));
    } else {

      this.foodItems = this.mealForm.get(this.activeTab) as FormArray;
      const copy: FormArray = this.mealForm.get(ageGroup) as FormArray;

      this.foodItems.controls.forEach((fic) =>
        copy.push(this.createMealFoodItem(
          fic.get('description').value,
          fic.get('foodComponent').value,
          fic.get('quantity').value,
          fic.get('units').value,
          fic.get('foodItemId').value
        )));
    }
  }

  /**
   * builds a meal object
   * 
   * @returns {Meal} 
   */
  buildMeal(): Meal {
    return {
      id: this.meal.id,
      description: this.mealForm.get('name').value,
      type: (this.mealForm.get('type').value as string).toUpperCase().replace( ' ', '_')
    };
  }

  /**
   * Removes a food component from the current active ageGroup by index
   * 
   * @param i {number}
   */
  removeComponent(i: number) {
    this.foodItems = this.mealForm.get(this.activeTab) as FormArray;
    this.state.deleteMealFoodItem( this.foodItems.at(i).get( 'mealFoodItemId' ).value );
    
    this.foodItems.removeAt(i);
  }

}
