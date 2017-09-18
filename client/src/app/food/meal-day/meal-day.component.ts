/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import { Meal, MealEvent } from '../food.interfaces';
import { FoodStateService } from '../services/food-state.service';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { UUID } from 'angular2-uuid';

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
   * Filter the list of meals to only those that arent being shown for the given day
   * 
   * @returns Meal[] filtered array of Meals
   */    
  filteredMeals(): Meal[] {    
    const eventMeals: Meal[] = this.day.events ? this.day.events.map( (e: any) => e.meta.meal ) : [];    
    return this.meals.filter( (meal) =>  eventMeals.find( (em) => em.id === meal.id ) === undefined );
  }
  
  /**
   * Add a meal to the meal events list for the day and close the dialog window
   * 
   * @param meal Meal item to add
   */
  addMeal( meal: Meal ) {    
    const event: MealEvent = {
      id: UUID.UUID(),
      startDate: new Date(this.day.date),
      endDate: new Date(this.day.date),
      recurrence: 'NONE',
      meal: meal
    }; 
    this.state.scheduleMealEvent( event ) ;
    this.bsModalRef.hide();
  }

}
