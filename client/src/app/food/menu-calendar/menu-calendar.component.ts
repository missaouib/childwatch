import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
} from 'angular-calendar';

import {Meal} from '../food.interfaces';
import { FoodStateService } from '../services/food-state.service';
import { MealService } from '../services/meal.service';
import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';

@Component({
  selector: 'cw-menu-calendar',
  templateUrl: './menu-calendar.component.html',
  styleUrls: ['./menu-calendar.component.css'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
   ]
})
export class MenuCalendarComponent implements OnInit {
  
  viewDate: Date = new Date();
  view = 'month';
  activeDayIsOpen = false;
  
  externalEvents:Array<CalendarEvent<Meal>> =  [];
  
  filteredList: Array<CalendarEvent<Meal>> = [];
  
  events: Array<CalendarEvent<Meal>> = [];
  
  refresh: Subject<any> = new Subject();
  
  filter: any = undefined;
 
  constructor(
    private state: FoodStateService,
    private mealSvc: MealService ) { 
    this.mealSvc.query().subscribe();
  }

  ngOnInit() {
    this.state.meals$
      .subscribe( (meals) => this.filteredList = this.externalEvents = 
        meals.map( (meal) => { return  { title: meal.description,  start: new Date(), 
            color: {primary: '#000000', secondary: '#000000'},
            draggable: true,
            meta: meal }; } ) );
  
  
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
  
}
