/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import {FoodComponent, Meal, FoodItem, MealRulesViolation, INITIAL_MEALSTATE, MealFoodItem} from '../food.interfaces';
import {FoodStateService} from '../services/food-state.service';
import {Component, OnInit, ViewChild, ElementRef, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import { UUID } from 'angular2-uuid';

interface FormGroupMgr {
    AGE_0_5MO: FormGroup; 
    AGE_6_11MO: FormGroup;
    AGE_1_2YR: FormGroup;
    AGE_3_5YR: FormGroup;
    AGE_6_12YR: FormGroup;
    AGE_13_18YR: FormGroup;
    AGE_ADULT: FormGroup;   
    [key: string]: FormGroup;
  };

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
  foodItemForm: FormGroupMgr  = {
    AGE_0_5MO: new FormGroup({}), 
    AGE_6_11MO: new FormGroup({}),
    AGE_1_2YR: new FormGroup({}),
    AGE_3_5YR: new FormGroup({}),
    AGE_6_12YR: new FormGroup({}),
    AGE_13_18YR: new FormGroup({}),
    AGE_ADULT: new FormGroup({})
  };
  
  food: FoodItem[] = [];

  activeTab = 'AGE_0_5MO';
  
  rulesViolations: MealRulesViolation[] = [];

  
  currentMeal: Meal = INITIAL_MEALSTATE;  
  currrentMealFoodItems: MealFoodItem[] = [];
  
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
      type: [undefined, Validators.required]    
    });
    
    // subscribe to the current meal
    // this is where the initial data will reside
    this.state.currentMeal$.subscribe( (currentMeal: Meal) => {
      if ( currentMeal.id !== this.currentMeal.id ) { console.log( 'Clear the data here!' ); } 
      console.log('currentMeal id = ' + currentMeal.id + '');
      this.mealForm.patchValue({'name': currentMeal.description, 'type': currentMeal.type});
      this.currentMeal = currentMeal;
    });

    // get the food components
    this.state.foodComponents$.subscribe((fc: FoodComponent[]) => {
      this.foodComponents = fc.filter( (c) => !c.parentComponent).map((f) => ({...f, children: []}));
      fc.filter((c) => c.parentComponent !== null)
        .forEach((c) => this.foodComponents.find((p) => p.id === c.parentComponent.id).children.push(c));

    });

    // get the food items
    this.state.foodItems$.subscribe((fi: FoodItem[]) => this.food = fi);

    // when the name/type change - save the meal
    this.mealForm.valueChanges.debounceTime(500).subscribe(() => {
      if (this.mealForm.valid && (this.mealForm.get('name').dirty || this.mealForm.get('type').dirty)) {
        //FIXME: need to copy the current meal and set the values...
        this.currentMeal.description = this.mealForm.get('name').value;
        this.currentMeal.type = (this.mealForm.get('type').value as string).toUpperCase().replace( ' ', '_');
        this.state.saveMeal(this.currentMeal);
        this.toastr.success('Saved the meal ' + this.currentMeal.description + ' (' + this.currentMeal.type + ' )', 'Save');        
      }
    });
    
    this.state.currentMealFoodItems$.subscribe( (mealFoodItems) => {
            
      mealFoodItems.forEach( (mealFoodItem) => {
        const formGroup = (this.foodItemForm[ mealFoodItem.ageGroup ] as FormGroup );
        if ( formGroup ) {
          formGroup.addControl( mealFoodItem.id, this.createMealFoodItemFormGroup( mealFoodItem) );
          console.log( 'Added a control to ' + mealFoodItem.ageGroup + ' component = ', mealFoodItem.foodComponent );
        } else { console.log( 'Can\'t find a formGroup for ' + mealFoodItem.ageGroup ); }
      });
      this.currrentMealFoodItems = mealFoodItems;
    });
    
    this.state.mealRuleViolations$.subscribe( (violations) => this.rulesViolations = violations );

  }
  
  foodItemsForAgeGroup( ageGroup: string ){
    return this.currrentMealFoodItems.filter( (i) => i.ageGroup === ageGroup );
  }
  

  /**
   * Activates the given tab
   * 
   * @param tabName
   */
  activateTab(tabName: string) {
    this.activeTab = tabName;
  }

  /**
   * fetches the food for the given component by filtering the full list
   * 
   * @param component {FoodComponent}
   *  
   * @returns FoodItem[]
   */
  foodForComponent(component: FoodComponent): FoodItem[] {
    return (component) ? this.food.filter((fi) => fi.foodComponent.id === component.id) : [];
  }

  /**
   * Creates a new MealFoodItem 
   * 
   * @returns FormGroup
   */
  createMealFoodItemFormGroup( mealFoodItem: MealFoodItem ): FormGroup {
    const ctrl = this.formBuilder.group({
      id: mealFoodItem.id,
      description: [mealFoodItem.foodItem ? mealFoodItem.foodItem.description : undefined, Validators.required ],
      foodItem: [mealFoodItem.foodItem, Validators.required ],
      foodComponent: [mealFoodItem.foodItem ? mealFoodItem.foodItem.foodComponent : mealFoodItem.foodComponent, Validators.required],
      quantity: [mealFoodItem.quantity, Validators.required],
      unit: [mealFoodItem.unit, Validators.required],
      ageGroup: [mealFoodItem.ageGroup, Validators.required],
      meal: [this.currentMeal, Validators.required]
    });
    
    // when the mealFoodItem changes - save it
    ctrl.valueChanges.debounceTime(3000).subscribe( ($event) => {
        if ( ctrl.valid ) {
          this.state.saveMealFoodItem( $event );
          this.toastr.success('Saved the mealFoodItem ' + $event.id, 'Save' );
        }
    });
     
    return ctrl;
  }

  /**
   * Add a food component to the meal
   * 
   * @param c {FoodComponent}
   */
  addComponent(foodComponent: FoodComponent): void {
    
    console.log( 'Save foodComponent ', foodComponent );
    
    //TODO add in food component
    
    const mealFoodItem: MealFoodItem = {
      id: UUID.UUID(),
      foodItem: undefined,
      quantity: 1,
      unit: 'each',
      meal: this.currentMeal,
      ageGroup: this.activeTab,
      foodComponent: foodComponent
    };
    this.state.saveMealFoodItem( mealFoodItem );
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
      console.log( 'copyTo ' + ageGroup + ' except ' + except );
    }
  }

  /**
   * Removes a food component from the current active ageGroup by index
   * 
   * @param i {number}
   */
  removeComponent(item: MealFoodItem ) {
    this.foodItemForm[ item.ageGroup ].removeControl( item.id );
    this.state.deleteMealFoodItem( item );
  }

}
