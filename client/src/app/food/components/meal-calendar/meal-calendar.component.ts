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
import {MenuPrintDialogComponent} from './menu-print-dialog/menu-print-dialog.component';
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
  }

  ngOnInit() {
    this.MealSvc.query().subscribe();
    this.gotoDate();
    this.FoodStateSvc.mealEvents$.subscribe((events) => {this.eventList = events; this.refresh.next();});

  }

  gotoDate(when?: string, unit?: moment.unitOfTime.DurationConstructor) {
    this.currentDate = (when === undefined) ? moment() : ((when === 'previous') ? moment(this.currentDate).subtract(1, unit) : moment(this.currentDate).add(1, unit));

    let start = this.currentDate.clone().startOf('month').add(-7, 'days').toDate();
    let end = this.currentDate.clone().endOf('month').add(7, 'days').toDate();

    this.FoodStateSvc.adjustMenuTime(start, end);
  }


  editMeal(meal: Meal) {
    this.RouterSvc.navigate(['./meals/meal-builder'], {queryParams: {id: meal.id}});
  }

  addMeal() {
    this.RouterSvc.navigate(['./meals/meal-builder']);
  }


  unscheduleEvent(event: CalendarEvent<MealEvent>) {
    console.log('removing event ', event.meta.meal.id);
    this.FoodStateSvc.removeEvent(event);
  }



  showReplaceMealDialog(meal: Meal, when: Moment) {
    this.mealToDrop = meal;
    this.whenToDrop = when;

    this.modalRef = this.ModalSvc.show(this.replaceMealDialog, {ignoreBackdropClick: true});
  }


  replaceMeal() {
    if (this.mealToDrop && this.whenToDrop) {
      this.eventList.filter(e => moment(e.start).diff(this.whenToDrop, 'days') === 0 && e.meta.meal.type === this.mealToDrop.type).forEach(event => this.unscheduleEvent(event));
      this.dropMeal(this.mealToDrop, this.whenToDrop.toDate());
    }
    this.modalRef.hide();
  }

  isMealTypeAlreadyPlanned(meal: Meal, when: Moment) {
    return this.eventList.filter(e => moment(e.start).diff(when, 'days') === 0 && e.meta.meal.type === meal.type).length > 0;
  }

  dropMeal(meal: Meal, when: Date) {
    //this.currentDate = moment(when).clone();
    this.FoodStateSvc.scheduleMealEvent(buildMealEvent(meal, when));
    this.mealToDrop = undefined;
    this.whenToDrop = undefined;
  }

  mealDropped(meal: Meal, when?: Date) {

    const _when: Moment = (when) ? moment(when) : this.currentDate.clone();

    if (this.isMealTypeAlreadyPlanned(meal, _when))
      this.showReplaceMealDialog(meal, _when);
    else
      this.dropMeal(meal, _when.toDate());
  }


  beforeMonthViewRender({body}: {body: CalendarMonthViewDay[]}): void {
    body.forEach(day => {if (day.isWeekend) day.cssClass = 'weekend-cell';});
  }

  showPrintMenuDialog() {
    this.modalRef = this.ModalSvc.show(MenuPrintDialogComponent);
    this.modalRef.content.title = 'Print Menu';
    this.modalRef.content.user = this.user;
  }


  sortEvents(events: CalendarEvent<MealEvent>[]) {
    return events.concat().sort(compareEvent);
  }

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

  createRecurrences() {

    let start: Date = this.recurrenceFrom[0];
    let end: Date = this.recurrenceFrom[1];
    let type = this.recurrenceForm.value.recurrenceType;
    let frequency = this.recurrenceForm.value.recurrenceFrequency;


    if (type !== 'NONE') {
      for (let current = moment(start); current.diff(end, 'hours', true) <= 0; current.add((type === 'WEEKLY') ? frequency : 1, (type === 'DAILY') ? 'day' : 'week')) {
        console.log(`trying to drop on ${current.toISOString()}; diff=${current.diff(end, 'hours', true)}`);
        if (this.user.weekendsShowing || (current.day() > 0 && current.day() < 6)) {
          if (!this.isMealTypeAlreadyPlanned(this.recurrenceMeal, current) && this.matchDay(current)) {
            this.dropMeal(this.recurrenceMeal, current.toDate());
          }
        }
      }
    }

  }

  showRecurrenceDialog(meal: Meal) {
    var current = this.currentDate.clone();
    var endOfMonth = current.clone().endOf('month');
    this.recurrenceMeal = meal;
    this.recurrenceMin = current.clone().startOf('month').toDate();
    this.recurrenceMax = current.clone().add(1, 'year').toDate();

    this.recurrenceFrom = [current.toDate(), endOfMonth.toDate()];
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
