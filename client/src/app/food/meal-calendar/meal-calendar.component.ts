import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent } from 'angular-calendar';

import {Meal, MealEvent} from '../food.interfaces';
import { MealDayComponent } from '../meal-day/meal-day.component';
import { FoodStateService } from '../services/food-state.service';
import { MealService } from '../services/meal.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
  selector: 'cw-meal-calendar',
  templateUrl: './meal-calendar.component.html',
  styleUrls: ['./meal-calendar.component.css']
})
export class MealCalendarComponent implements OnInit {
  
  viewDate: Date = new Date();
  view = 'month';
  activeDayIsOpen = false;
  
  meals: Meal[] =  [];
  
  filteredMeals: Meal[] = [];
  
  events: Array<CalendarEvent<MealEvent>> = [];
  
  refresh: Subject<any> = new Subject();
  
  filter: any = undefined;
  
  _opened = false;
  
  selectedDaysMeals: Meal[] = [];
  
  dayModal: BsModalRef;
  showAdd: Date = undefined;
   
  constructor(
    private state: FoodStateService,
    private mealSvc: MealService,
    private router: Router,
    private modalSvc: BsModalService,
  ) {}

  ngOnInit() {
    this.mealSvc.query().subscribe();
    
    this.state.meals$
      .subscribe( (meals: Meal[]) => this.filteredMeals = this.meals = meals );
  
    const today = new Date();
   
    this.state.adjustMenuTime( moment(today).startOf('month').toDate(), moment(today).endOf('month').toDate());
    this.state.mealEvents$.subscribe( (events) => this.events = events.slice().sort( this.compare ) );
    
  }
  
  scheduleMeal( { meal, start }: {meal: Meal, start: Date} ) {
    this.state.scheduleMeal( meal, start );
    this.viewDate = start;
  }
  
  eventDropped( { event, newStart }: { event: any, newStart: Date} ): void {    
    this.state.scheduleMeal( event, newStart );
    this.viewDate = newStart;
  }
  
  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
  }
  
  createMealEvent( meal: Meal ): MealEvent {
    const mealEvent: MealEvent = {
      id: UUID.UUID(),
      startDate: new Date(),
      endDate: undefined,
      recurrenceId: undefined,
      meal: meal
    };
    return mealEvent;
  }
  
  filterMealList( type: string ){
    this.filter = type;    
    this.filteredMeals = (this.filter === undefined) ? 
      this.meals : this.meals.filter( (meal) => meal.type === type.toUpperCase().replace( ' ', '_') );    
  }
  
  compare( a: CalendarEvent<MealEvent>, b: CalendarEvent<MealEvent> ){
    const MEALS = ['BREAKFAST', 'AM_SNACK', 'LUNCH', 'PM_SNACK', 'DINNER'];
    const iA = MEALS.indexOf( a.meta.meal.type );
    const iB = MEALS.indexOf( b.meta.meal.type );
    return iA - iB;
  }
  
  editMeal( meal: Meal ) {
    console.log( 'Setting current meal to ' + meal.id );
    this.state.saveMeal( meal );
    this.router.navigate( ['./meals/meal-builder']);
  }
  
  addMeal() {
    this.state.saveMeal( { id: undefined, description: undefined, type: undefined }  );
    this.router.navigate( ['./meals/meal-builder']);   
  }
  
  removeEvent( event: CalendarEvent<MealEvent> ) {
    this.state.removeEvent( event );
  }
  
  clickedDay( event: any ) {
    console.log( event );
    
    this.dayModal = this.modalSvc.show( MealDayComponent );
    this.dayModal.content.day = event.day;
    
    this.viewDate = event.day.date;
  }
  
  mealsChanged( $event: any ) {
    console.log( 'Meals changed', $event ); 
  }
  
}
