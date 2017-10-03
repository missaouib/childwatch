import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {CalendarEvent, CalendarEventTimesChangedEvent} from 'angular-calendar';

import {Meal, MealEvent} from '../food.interfaces';
import {FoodStateService} from '../services/food-state.service';
import {MealService} from '../services/meal.service';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {UUID} from 'angular2-uuid';

@Component({
  selector: 'cw-meal-calendar',
  templateUrl: './meal-calendar.component.html',
  styleUrls: ['./meal-calendar.component.css']
})
export class MealCalendarComponent implements OnInit {

  viewDate: Date = new Date();
  view = 'month';
  activeDayIsOpen = false;

  eventList: Array<CalendarEvent<MealEvent>> = [];
  mealEvents: Array<CalendarEvent<MealEvent>> = [];

  refresh: Subject<any> = new Subject();

  filter = 'ALL';

  _opened = false;

  selectedDaysMeals: Meal[] = [];

  constructor(
    private state: FoodStateService,
    private mealSvc: MealService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.mealSvc.query().subscribe();

    this.state.meals$
      .subscribe((meals: Meal[]) => {
        this.mealEvents = meals.map(meal => (
          {
            title: meal.description,
            color: undefined,
            start: undefined,
            draggable: true,
            meta: this.createMealEvent(meal)
          }
        ));
      });

    const today = new Date();

    this.state.adjustMenuTime(moment(today).startOf('month').toDate(), moment(today).endOf('month').toDate());
    this.state.mealEvents$.subscribe((events) => this.eventList = events.slice());

  }

  gotoPreviousMonth() {
    this.viewDate = this.previousMonth();
    this.state.adjustMenuTime(moment(this.viewDate).startOf('month').toDate(), moment(this.viewDate).endOf('month').toDate());
  }

  gotoNextMonth() {
    this.viewDate = this.nextMonth();
    this.state.adjustMenuTime(moment(this.viewDate).startOf('month').toDate(), moment(this.viewDate).endOf('month').toDate());
  }

  gotoToday() {
    this.viewDate = new Date();
    this.state.adjustMenuTime(moment(this.viewDate).startOf('month').toDate(), moment(this.viewDate).endOf('month').toDate());
  }

  nextMonth() {
    return moment(this.viewDate).add(1, 'months').toDate();
  }

  previousMonth() {
    return moment(this.viewDate).subtract(1, 'months').toDate();
  }

  differentYear() {
    return !moment(this.viewDate).isSame(new Date(), 'year');
  }

  createMealEvent(meal: Meal, start?: Date): MealEvent {
    const mealEvent: MealEvent = {
      id: UUID.UUID(),
      startDate: (start) ? new Date(start) : new Date(),
      endDate: new Date(),
      recurrence: undefined,
      meal: meal
    };
    return mealEvent;
  }

  filteredMeals(type: string) {
    return (type === 'ALL') ? this.mealEvents.sort(this.compareEvnt) : this.mealEvents.filter(event => event.meta.meal.type === type).sort(this.compareEvnt);
  }

  compare(a: Meal, b: Meal) {
    const MEALS = ['BREAKFAST', 'AM_SNACK', 'LUNCH', 'PM_SNACK', 'DINNER'];
    return MEALS.indexOf(a.type) - MEALS.indexOf(b.type);
  }

  compareEvnt(a: CalendarEvent<MealEvent>, b: CalendarEvent<MealEvent>) {
    return this.compare(a.meta.meal, b.meta.meal);
  }


  editMeal(meal: Meal) {
    this.router.navigate(['./meals/meal-builder'], {queryParams: {id: meal.id}});
  }

  addMeal() {
    this.router.navigate(['./meals/meal-builder']);
  }

  removeEvent(event: CalendarEvent<MealEvent>) {
    console.log('removing event ', event.meta.meal.id);
    this.eventList = this.eventList.filter(e => e.meta.id !== event.meta.id);
    // this.state.removeEvent(event);
  }


  afterStart(date: Date) {
    return moment(date).diff(moment('01/10/2017', 'DD/MM/YYYY'), 'days') >= 0;
  }

  eventDropped({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    const newEvent = {
      ...event,
      start: newStart,
      end: newEnd,
      meta: event.meta
    }

    //this.state.scheduleMealEvent(event.meta);

    this.eventList.push(newEvent);
    this.viewDate = newStart;
    this.activeDayIsOpen = true;
  }

}
