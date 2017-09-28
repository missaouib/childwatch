import { MealFoodItem, Meal, FoodComponent,  MealRulesViolation } from '../food.interfaces';
import { Component, OnInit, HostListener } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FoodStateService} from '../services/food-state.service';
import { UUID } from 'angular2-uuid';
import { ActivatedRoute } from '@angular/router';
import { ComponentCanDeactivate } from './pending-changes-guard';
import { Observable } from 'rxjs/Observable';
import { MealService } from '../services/meal.service';


@Component({
  selector: 'cw-meal',
  templateUrl: './meal.component.html'
})
export class MealComponent implements OnInit, ComponentCanDeactivate {
  
  editing = false;
  
  meal: Meal = this.createNewMeal();
  
  mealFoodItems: MealFoodItem[] = []; 
  
  mealFoodItem: MealFoodItem = {
      id: 'MYID',
      ageGroup: 'AGE_0_5MO',
      quantity: 1,
      unit: 'EACH',
      meal: this.meal,
      foodComponent: {
        id: 'FISH',
        description: 'Seafood & Fish',
        icon: 'icon-fish',
        parentComponent: undefined
      },
      foodItem: undefined
    };
  
   mealForm: FormGroup;
  
   AGEGROUPS = ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT'];
   activeTab = 'AGE_0_5MO';
  
   foodComponentList: any[] = [];
  
   dirtyFoodItems = false;
  
   rulesViolations: MealRulesViolation[] = [];
  
   isValidating = false;
  
  
  constructor(
    private formBuilder: FormBuilder,
    private state: FoodStateService,
    private activeRoute: ActivatedRoute,
    private mealSvc: MealService
  ) { 
    
    this.activeRoute.queryParams.subscribe( (params: any) => this.loadMeal( params['id'] ) );
    this.state.foodComponents$.subscribe((fc: FoodComponent[]) => {
      this.foodComponentList = fc.filter( (c) => !c.parentComponent).map((f) => ({...f, children: []}));
      fc.filter((c) => c.parentComponent !== null)
        .forEach((c) => this.foodComponentList.find((p) => p.id === c.parentComponent.id).children.push(c));

    });
  }

  ngOnInit() {
   this.mealForm = this.formBuilder.group({
      description: [this.meal.description, Validators.required],
      type: [this.meal.type, Validators.required]    
    });
  
  }
  
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.mealForm.dirty && !this.dirtyFoodItems; 
  }
  
  
  changed( mealFoodItem: MealFoodItem ) {
    const copy = this.mealFoodItems.filter( mfi => mfi.id !== mealFoodItem.id );
    copy.push( mealFoodItem );
    this.mealFoodItems = copy;
    this.dirtyFoodItems = true;  
  }
  
  deleted( id: string ) {
    console.log( 'deleting ' + id );
    const copy = this.mealFoodItems.filter( mfi => mfi.id !== id );
    this.mealFoodItems = copy;
    this.dirtyFoodItems = true;  
  }
  
  mealFoodItemsFor( ageGroup: string ) {
    return this.mealFoodItems.filter( mfi => mfi.ageGroup === ageGroup );
  }
  
  
  save() {
    const meal: Meal = {
      id: this.meal.id,
      description: this.mealForm.get( 'description').value,
      type: this.mealForm.get( 'type' ).value
    };
    this.mealSvc.save( meal ).first().subscribe( () => { 
      console.log( 'saved' );
          this.mealFoodItems.forEach( mfi => { 
            mfi.meal = meal;
            this.mealForm.markAsPristine();
            this.mealSvc.saveMealFoodItem( mfi ).first().subscribe(() => {
              this.dirtyFoodItems = false;
              this.mealSvc.validate( meal )
                .delay( 3000 )
                .subscribe( violations => this.rulesViolations = violations );            
            });
          });
    });
  }
  
  addMealFoodItemForComponent( component: FoodComponent ) {
    
    this.mealFoodItems.push( {
      id: UUID.UUID(),
      ageGroup: this.activeTab,
      quantity: 1,
      unit: 'EACH',
      meal: this.meal,
      foodComponent: component,
      foodItem: undefined      
    });
    this.dirtyFoodItems = true;
  }
  
  createNewMeal() {
    const meal: Meal = {
        id: UUID.UUID(),
        description: undefined,
        type: undefined,
        mealFoodItems: []
      }; 
    return meal;
  }
  
  loadMeal( mealId: string ) {
    if ( mealId ) {      
      this.mealSvc.fetch( mealId ).subscribe( (meal) => {
        this.meal = (meal) ? meal : this.createNewMeal();
        this.mealForm.patchValue( { description: this.meal.description, type: this.meal.type } );         
        this.editing = (meal === undefined);
        if ( meal ) {
          this.mealSvc.queryMealFoodItemsFor( meal )
            .subscribe( mealItems => this.mealFoodItems = mealItems );
          this.mealSvc.validate( meal )
                .delay( 3000 )
                .subscribe( violations => this.rulesViolations = violations );                      
        }             
      });
    } else {
      this.meal = this.createNewMeal(); 
      this.editing = true;     
    }
  }
  
  
  copyTo(ageGroup: string ): void {
    if (ageGroup === 'ALL') {
      this.AGEGROUPS.filter((ag) => ag !== this.activeTab )
        .forEach((ag) => this.copyTo(ag));
    } else {      
      console.log( 'Copy to ' + ageGroup );
    }
  }    
  
  rulesViolationsForCurrentAgeGroup() {
    return this.rulesViolations.filter( (v) => v.ageGroup === this.activeTab );  
  }
  
}
