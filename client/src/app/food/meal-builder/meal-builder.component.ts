/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import {FoodComponent, Meal, FoodItem, MealRulesViolation, MealFoodItem} from '../food.interfaces';
import {FoodStateService} from '../services/food-state.service';
import { ComponentCanDeactivate } from './pending-changes-guard';
import { HostListener } from '@angular/core';
import {Component, OnInit, ViewChild, ElementRef, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

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
  styleUrls: ['./meal-builder.component.css'],
  styles: [ `
  :host >>> .alert-local {
    background-color: #009688;
    border-color: #00695C;
    color: #fff;
  }
  `]
  
})
export class MealBuilderComponent implements OnInit, ComponentCanDeactivate {
  

  @ViewChild('containerPieChart')
  element: ElementRef;

  AGEGROUPS = ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT'];

  foodComponents: any[] = [];
  
  showGuidance = true;

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

  currentAgeGroup = 'AGE_0_5MO';
    
  rulesViolations: MealRulesViolation[] = [];

  
  currentMeal: Meal = {
    id: UUID.UUID(),
    description: undefined,
    type: undefined
  };
  
  currrentMealFoodItems: MealFoodItem[] = [];
  
  editing = false;
  
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
    private router: Router    
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  /**
   * Initialization of the component
   * 
   * @onInit
   */
  ngOnInit() {
        
    // create the meal form; food items are created on demand
    this.mealForm = this.formBuilder.group({
      id: UUID.UUID(),
      name: [undefined, Validators.required],
      type: [undefined, Validators.required]    
    });
    
    // subscribe to the current meal
    this.state.currentMeal$.subscribe( (currentMeal: Meal) => {
      this.currentMeal = currentMeal;
      this.mealForm.patchValue({ 'id': currentMeal.id, 'name': currentMeal.description, 'type': currentMeal.type});
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
        this.currentMeal = {
           id: (this.mealForm.get('id').value || UUID.UUID()),
           description: this.mealForm.get('name').value,
           type: (this.mealForm.get('type').value as string).toUpperCase().replace( ' ', '_')
        };
      
      /*
      if (this.mealForm.valid && (this.mealForm.get('name').dirty || this.mealForm.get('type').dirty)) {
        this.state.saveMeal( this.currentMeal );
        this.toastr.success('Saved the meal ' + this.currentMeal.description, 'Save');        
      }
       */
    });
    
    // subscribe to the list of meal food itmes
    this.state.currentMealFoodItems$.subscribe( (mealFoodItems) => {
            
      mealFoodItems.forEach( (mealFoodItem) =>
          (this.foodItemForm[ mealFoodItem.ageGroup ] as FormGroup )
            .addControl( mealFoodItem.id, this.createMealFoodItemFormGroup( mealFoodItem) ) );
      this.currrentMealFoodItems = mealFoodItems;
    });
    
    // subscribe to the meal rules violations
    this.state.mealRuleViolations$.subscribe( (violations) => this.rulesViolations = violations );

  }
  
  foodItemsForCurrentAgeGroup() {
    return this.currrentMealFoodItems.filter( (i) => i.ageGroup === this.currentAgeGroup );
  }
  
  rulesViolationsForCurrentAgeGroup() {
    return this.rulesViolations.filter( (v) => v.ageGroup === this.currentAgeGroup );
  }
  

  /**
   * Activates the given tab
   * 
   * @param tabName
   */
  activateTab(tabName: string) {
    this.currentAgeGroup = tabName;
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
          //this.toastr.success('Saved the mealFoodItem ' + $event.id, 'Save' );
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
        
    const mealFoodItem: MealFoodItem = {
      id: UUID.UUID(),
      foodItem: undefined,
      quantity: 1,
      unit: 'EACH',
      meal: this.currentMeal,
      ageGroup: this.currentAgeGroup,
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

  canDelete() {
    return false;
  }
  
  save() {
    this.currentMeal = {
           id: (this.mealForm.get('id').value || UUID.UUID()),
           description: this.mealForm.get('name').value,
           type: (this.mealForm.get('type').value as string).toUpperCase().replace( ' ', '_')
        };
    this.state.saveMeal( this.currentMeal );
    this.mealForm.markAsPristine(true);
    // TODO save all the mealItems...
    
    
    this.toastr.success('Saved the meal ' + this.currentMeal.description, 'Save');        
  }
  
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return ( !this.mealForm.dirty );
  }
  
  back() {
    this.router.navigate( ['/meals'] ); 
  }
  
}
