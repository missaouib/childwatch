import {Meal} from '../../model/meal';
import {MealEvent} from '../../model/meal-event';
import {FoodStateService} from '../../services/food-state.service';
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import * as moment from 'moment';

@Component({
  selector: 'cw-meal-day',
  templateUrl: './meal-day.component.html',
  styleUrls: ['./meal-day.component.css']
})
export class MealDayComponent implements OnInit {

  Meals: Meal[] = [];

  @Input() day: Date
  @Output() edit: EventEmitter<Meal> = new EventEmitter<Meal>();
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() remove: EventEmitter<CalendarEvent<MealEvent>> = new EventEmitter();
  @Output() previousDay: EventEmitter<any> = new EventEmitter();
  @Output() nextDay: EventEmitter<any> = new EventEmitter();
  @Output() today: EventEmitter<any> = new EventEmitter();
  @Output() schedule: EventEmitter<Meal> = new EventEmitter<Meal>();

  Events: Array<CalendarEvent<MealEvent>> = [];

  constructor(
    private state: FoodStateService
  ) {}

  ngOnInit() {
    this.state.mealEvents$.subscribe(events => this.Events = events);
    this.state.meals$.subscribe(meals => this.Meals = meals);
  }

  todaysEvents() {
    return this.Events.filter(event => moment(event.start).diff(this.day, 'day') === 0);
  }

  limit(text: string, len?: number) {
    const _len = len || 30;
    return text.slice(0, _len) + (text.length > _len ? "..." : "");
  }

  editMeal(meal: Meal) {
    this.edit.emit(meal);
  }

  addMeal() {
    this.add.emit();
  }

  removeMealEvent(mealEvent: CalendarEvent<MealEvent>) {
    this.remove.emit(mealEvent);
  }

  scheduleMeal(meal: Meal) {
    this.schedule.emit(meal);
  }

}
