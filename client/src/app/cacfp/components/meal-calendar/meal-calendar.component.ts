import {UserService} from '../../../user/user.service';
import {User} from '../../../user/config.state';
import {Meal} from '../../model/meal';
import {MealEvent, compareEvent, buildMealEvent} from '../../model/meal-event';
import {Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ElementRef, ViewContainerRef} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {CalendarEvent, CalendarMonthViewDay} from 'angular-calendar';

import {FoodStateService} from '../../services/food-state.service';
import {MealEventService} from '../../services/meal-event.service';
import {MealService} from '../../services/meal.service';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import * as moment from 'moment';
import {Moment} from 'moment';
import {Router} from '@angular/router';
import {UUID} from 'angular2-uuid';
import {ToastsManager} from 'ng2-toastr';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'cw-meal-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './meal-calendar.component.html',
  styleUrls: ['./meal-calendar.component.css']
})
export class MealCalendarComponent implements OnInit {

  @ViewChild('replaceMealDialog') replaceMealDialog: ElementRef;
  @ViewChild('recurrenceDialog') recurrenceDialog: ElementRef;
  @ViewChild('printMenuDialog') printMenuDialog: ElementRef;

  mealToDrop: Meal = undefined;
  whenToDrop: Moment = undefined;

  currentDate: Moment = moment();

  showHideWeekends = [0, 6];
  _showWeekends = false;
  _showBackground = false;


  eventList: Array<CalendarEvent<MealEvent>> = [];

  refresh: Subject<any> = new Subject();

  selectedDaysMeals: Meal[] = [];

  modalRef: BsModalRef;

  user: User;

  recurrenceForm: FormGroup;
  recurrenceMax: Date;
  recurrenceMin: Date;
  recurrenceFrom: any = [];
  recurrenceMeal: Meal;

  printMenu_date: Date = new Date();
  printMenu_showInfant: boolean = false;

  /**
   * @constructor
   */
  constructor(
    private FoodStateSvc: FoodStateService,
    private MealSvc: MealService,
    private UserSvc: UserService,
    private RouterSvc: Router,
    private ToastrSvc: ToastsManager,
    private viewContainerRef: ViewContainerRef,
    private ModalSvc: BsModalService,
    private formBuilder: FormBuilder
  ) {
    this.ToastrSvc.setRootViewContainerRef(viewContainerRef);
    this.UserSvc.user$.subscribe(user => {this.user = user; this.showHideWeekends = user.weekendsShowing ? [] : [0, 6]});
    this.roundDate();
  }

  /**
   * @onInit
   */
  ngOnInit() {
    this.MealSvc.query().subscribe(() => this.refresh.next() );
    this.gotoDate();
    this.FoodStateSvc.mealEvents$.subscribe((events) => {this.eventList = events; this.refresh.next();});

  }

  /**
   * set the current monitored calendar date
   * 
   * 
   */
  gotoDate(when?: string, unit?: moment.unitOfTime.DurationConstructor) {
    this.currentDate = (when === undefined) ? moment() : ((when === 'previous') ? moment(this.currentDate).subtract(1, unit) : moment(this.currentDate).add(1, unit));

    let start = this.currentDate.clone().startOf('month').add(-7, 'days').toDate();
    let end = this.currentDate.clone().endOf('month').add(7, 'days').toDate();

    this.FoodStateSvc.adjustMenuTime(start, end);
  }


  /**
   * Begin editing of the specified meal
   * 
   */
  editMeal(meal: Meal) {
    this.RouterSvc.navigate(['./meals/meal-builder'], {queryParams: {id: meal.id}});
  }

  /**
   * Add a new meal and begin editing it
   */
  addMeal() {
    this.RouterSvc.navigate(['./meals/meal-builder']);
  }

  activateMeal(meal: Meal) {
    console.log(`Updating meal ${meal.description} to ${meal.inactive}`);
    this.MealSvc.update(meal).subscribe(() => this.ngOnInit());
  }

  /**
   * Unschedule an event from the calendar
   * 
   * @param {CalendarEvent<MealEvent>} event 
   */
  unscheduleEvent(event: CalendarEvent<MealEvent>) {
    console.log('removing event ', event.meta.meal.id);
    this.FoodStateSvc.removeEvent(event);
  }

  /**
   * Show the replace/cancel meal replacement dialog
   * 
   * @param {Meal} meal
   * @param {Moment} when
   */
  showReplaceMealDialog(meal: Meal, when: Moment) {
    this.mealToDrop = meal;
    this.whenToDrop = when;

    this.modalRef = this.ModalSvc.show(this.replaceMealDialog, {ignoreBackdropClick: true});
  }

  plannedFor(meal: Meal, when: Moment): CalendarEvent<MealEvent>[] {
    return this.eventList.filter(e => moment(e.start).isSame(when, 'days') && e.meta.meal.type === meal.type);
  }

  /**
   * Replace the meal
   */
  replaceMeal() {
    if (this.mealToDrop && this.whenToDrop) {
      this.plannedFor(this.mealToDrop, this.whenToDrop).forEach(event => this.unscheduleEvent(event));
      this.dropMeal(this.mealToDrop, this.whenToDrop.toDate());
    }
    this.modalRef.hide();
  }

  /**
   * Determine if a meal of the given type is already planned on the specified day
   * 
   * @param {Meal} meal
   * @param {Moment} when
   * 
   * @returns {boolean}
   */
  isMealTypeAlreadyPlanned(meal: Meal, when: Moment) {
    return this.plannedFor(meal, when).length > 0;
  }

  /**
   * Drops/schedules a meal event at the given time
   * 
   * @param {Meal} meal
   * @param {Date} when
   */
  dropMeal(meal: Meal, when: Date) {
    //this.currentDate = moment(when).clone();

    console.log(`Droping meal on ${moment(when).toISOString()} isMealPlanned = ${this.isMealTypeAlreadyPlanned(meal, moment(when))}`);

    this.FoodStateSvc.scheduleMealEvent(buildMealEvent(meal, when));
    this.mealToDrop = undefined;
    this.whenToDrop = undefined;
  }

  /**
   * Callback when a meal is dropped on a given date
   * 
   * @param {Meal} meal
   * @param {Date} when
   * 
   */
  mealDropped(meal: Meal, when?: Date) {

    const _when: Moment = (when) ? moment(when) : this.currentDate.clone();

    if (this.isMealTypeAlreadyPlanned(meal, _when))
      this.showReplaceMealDialog(meal, _when);
    else
      this.dropMeal(meal, _when.toDate());
  }

  /**
   * Calendar rendered for MonthView to set the class for weekends
   */
  beforeMonthViewRender({body}: {body: CalendarMonthViewDay[]}): void {
    body.forEach(day => {if (day.isWeekend) day.cssClass = 'weekend-cell';});
  }

  /**
   * Display the Print Menu Dialog to print out a week's menu
   */
  showPrintMenuDialog() {
    this.modalRef = this.ModalSvc.show(this.printMenuDialog, {ignoreBackdropClick: true});
  }

  /**
   * Round the printMenu_date to monday or sunday depending on weekendsShowing
   */
  roundDate() {
    this.printMenu_date = this.getDateValue().toDate();
  }

  /**
   * Retrieve the printMenu_date rounded to the proper start depending on weekendsShowing
   * 
   * @returns {Moment}
   */
  getDateValue(): moment.Moment {
    let sub = moment(this.printMenu_date).day();
    if (!this.user || !this.user.weekendsShowing)
      sub = sub - ((sub == 6) ? 2 : 1);
    return moment(this.printMenu_date).clone().add(-sub, "days");
  }

  /**
   * Sort calendar events by meal type
   * 
   * @param events {CalendarEvent<MealEvent>[]} input list of events
   * 
   * @returns {CalendarEvent<MealEvent>[]} copy of input events in sorted order
   */
  sortEvents(events: CalendarEvent<MealEvent>[]): CalendarEvent<MealEvent>[] {
    return (events) ? events.concat().sort(compareEvent) : [];
  }

  /**
   * Determines if the specified date was selected in the recurrenceForm
   * 
   * @returns {boolean}
   */
  matchDay(date: Moment) {
    if (this.recurrenceForm.value.recurrenceType === 'DAILY') {
      return date.day() === 0 && this.recurrenceForm.value.rSun ||
        date.day() === 1 && this.recurrenceForm.value.rMon ||
        date.day() === 2 && this.recurrenceForm.value.rTue ||
        date.day() === 3 && this.recurrenceForm.value.rWed ||
        date.day() === 4 && this.recurrenceForm.value.rThu ||
        date.day() === 5 && this.recurrenceForm.value.rFri ||
        date.day() === 6 && this.recurrenceForm.value.rSat;
    }
    else
      return true;
  }


  /**
   * Creates the set of recurrence events based on the form values
   * 
   */
  createRecurrences() {

    let start: Date = this.recurrenceFrom[0];
    let end: Date = this.recurrenceFrom[1];
    if (start > end) end = start;
    let type = this.recurrenceForm.value.recurrenceType;
    let frequency = (type === 'WEEKLY') ? this.recurrenceForm.value.recurrenceFrequency : 1;
    let unit = (type === 'DAILY') ? 'day' : 'week';


    if (type !== 'NONE')
      for (let current = moment(start); current.diff(end, 'hours', true) <= 0; current.add(frequency, unit)) {
        if ((this.user.weekendsShowing || (current.day() > 0 && current.day() < 6)) && !this.isMealTypeAlreadyPlanned(this.recurrenceMeal, current) && this.matchDay(current))
          this.dropMeal(this.recurrenceMeal, current.toDate());
      }
  }

  /**
   * Displays the RecurrenceDialog
   * 
   * @param {Meal} meal 
   */
  showRecurrenceDialog(meal: Meal) {
    var endOfMonth = this.currentDate.clone().endOf('month');
    this.recurrenceMeal = meal;
    this.recurrenceMin = moment(new Date()).subtract(1, 'year').toDate();
    this.recurrenceMax = moment(new Date()).add(1, 'year').toDate();

    this.recurrenceFrom = [this.currentDate.clone().toDate(), endOfMonth.toDate()];
    this.recurrenceForm = this.formBuilder.group({
      recurrenceType: ['NONE', Validators.required],
      recurrenceFrequency: [1, Validators.required],
      rSun: [true],
      rMon: [true],
      rTue: [true],
      rWed: [true],
      rThu: [true],
      rFri: [true],
      rSat: [true],
    });

    this.modalRef = this.ModalSvc.show(this.recurrenceDialog, {ignoreBackdropClick: true});
  }

}
