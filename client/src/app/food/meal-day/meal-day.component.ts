/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import { Meal } from '../food.interfaces';
import { FoodStateService } from '../services/food-state.service';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

/**
 * MealDayComponent
 * 
 * @component
 */
@Component({
  selector: 'cw-meal-day',
  templateUrl: './meal-day.component.html',
  styleUrls: ['./meal-day.component.css']
})
export class MealDayComponent implements OnInit {
  meals: Meal[] = [];
  day: any = {};
  
  /**
   * constructor for the MealDayBuilderComponent
   * 
   * @constructor
   */
  constructor(
    public bsModalRef: BsModalRef,
    private state: FoodStateService
    
  ) {}

  
  /**
   * 
   */
  ngOnInit() {
    this.state.meals$.subscribe( (meals) => this.meals = meals );
  
  }
    
  
  /**
   * Close the dialog window & emit the data
   */
  closeDialog() {
    this.bsModalRef.hide();    
  }
  
  filteredMeals(): Meal[] {
    
    const eventMeals: Meal[] = this.day.events ? this.day.events.map( (e: any) => e.meta.meal ) : [];
    
    return this.meals.filter( (meal) =>  eventMeals.find( (em) => em.id === meal.id ) === undefined );
  }
  
  addMeal( meal: Meal ) {
    this.state.scheduleMeal( meal, this.day.date );
  }

}

/*
 * End meal-day.ts 
 */
