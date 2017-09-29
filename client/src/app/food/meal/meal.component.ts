import { MealFoodItem, Meal, FoodComponent,  MealRulesViolation } from '../food.interfaces';
import { Component, OnInit, HostListener } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FoodStateService} from '../services/food-state.service';
import { UUID } from 'angular2-uuid';
import { ActivatedRoute } from '@angular/router';
import { ComponentCanDeactivate } from './pending-changes-guard';
import { Observable } from 'rxjs/Observable';
import { MealService } from '../services/meal.service';
import { ViewContainerRef } from '@angular/core';
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
  `]
})
export class MealComponent implements OnInit, ComponentCanDeactivate {
  
  editing = false;
  
  saving = false;
  
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
    private mealSvc: MealService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
  ) { 
    
    this.toastr.setRootViewContainerRef(vcr);
    
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
  
  mealCacfpStatus(): string {
    return ( !this.mealForm || !this.mealForm.valid || this.mealForm.dirty || this.dirtyFoodItems )? 'UNKNOWN' :
           ( this.rulesViolations.length > 0 )? 'NONCOMPLIANT' : 'COMPLIANT';          
  }
  
  ageGroupCacfpStatus( ageGroup: string ) {    
    const foundItems = this.mealFoodItems.filter( fi => fi.ageGroup === ageGroup ).length;
    const foundViolations = this.rulesViolations.filter( rv => rv.ageGroup === ageGroup ).length;
    return ( foundItems === 0 || this.dirtyFoodItems ) ? 'UNKNOWN' :
           ( foundViolations > 0 ) ? 'NONCOMPLIANT' : 'COMPLIANT';              
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
      this.mealForm.markAsPristine();
      if ( this.mealFoodItems.length === 0 ) { 
        this.toastr.success('Meal ' + meal.description + ' has been saved', 'Save' );        
        this.saving = false;
        this.editing = false;
      }
      
      Observable.forkJoin( this.mealFoodItems.map( mfi => this.mealSvc.saveMealFoodItem(mfi) ) ).subscribe(() => {
          this.toastr.success('Meal ' + meal.description + ' has been saved', 'Save' );   
          this.dirtyFoodItems = false;
          this.editing = false;
          this.saving = false;
          this.mealSvc.validate( meal ).subscribe( violations => this.rulesViolations = violations );            
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
          this.mealSvc.queryMealFoodItemsFor( meal ).subscribe( mealItems => this.mealFoodItems = mealItems );
          this.mealSvc.validate( meal ).subscribe( violations => this.rulesViolations = violations );                      
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
