import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';

import {Meal} from '../food.interfaces';
import { FoodStateService } from '../services/food-state.service';
import { MealService } from '../services/meal.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'cw-meal-calendar',
  templateUrl: './meal-calendar.component.html',
  styleUrls: ['./meal-calendar.component.css']
})
export class MealCalendarComponent implements OnInit {
  
  viewDate: Date = new Date();
  view = 'month';
  activeDayIsOpen = false;
  
  externalEvents: Array<CalendarEvent<Meal>> =  [];
  
  filteredList: Array<CalendarEvent<Meal>> = [];
  
  events: Array<CalendarEvent<Meal>> = [];
  
  refresh: Subject<any> = new Subject();
  
  filter: any = undefined;
 
  constructor(
    private state: FoodStateService,
    private mealSvc: MealService,
    private router: Router 
  ) { 
    this.mealSvc.query().subscribe();
  }

  ngOnInit() {
    this.state.meals$
      .subscribe( (meals: Meal[]) => this.filteredList = this.externalEvents = 
        meals.map( (meal) => { return  { title: meal.description,  start: new Date(), 
            color: {primary: '#000000', secondary: '#000000'},
            draggable: true,
            meta: meal }; } ) );
  
    const today = new Date();
   
    this.state.adjustMenuTime( moment(today).startOf('month').toDate(), moment(today).endOf('month').toDate());
    this.state.mealEvents$.subscribe( (events) => this.events = events.slice().sort( this.compare ) );
    
  }
  
  eventDropped( { event, newStart}: CalendarEventTimesChangedEvent): void {
    this.state.scheduleMeal( event.meta, newStart );
    this.viewDate = newStart;
  }
  
  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
  }
  
  filterList( type: string ){
    this.filter = type;    
    this.filteredList = (this.filter === undefined) ? 
      this.externalEvents : this.externalEvents.filter( (event) => event.meta.type === type.toUpperCase().replace( ' ', '_') );    
  }
  
  compare( a: CalendarEvent<Meal>, b: CalendarEvent<Meal> ){
    const MEALS = ['BREAKFAST', 'AM_SNACK', 'LUNCH', 'PM_SNACK', 'DINNER'];
    const iA = MEALS.indexOf( a.meta.type );
    const iB = MEALS.indexOf( b.meta.type );
    return iA - iB;
  }
  
  editMeal( meal: Meal ) {
    console.log( 'Setting current meal to ' + meal.id );
    this.state.updateMeal( meal );
    this.router.navigate( ['./meals/meal-builder']);
  }
  
  addMeal(){
    this.state.updateMeal( undefined );
    this.router.navigate( ['./meals/meal-builder']);   
  }
  
  removeEvent( event: CalendarEvent<Meal> ){
    console.log( 'Removing event ', event );
    this.state.removeEvent( event );
    //this.events = this.events.filter( (e) => e !== event );
  }
  
}
