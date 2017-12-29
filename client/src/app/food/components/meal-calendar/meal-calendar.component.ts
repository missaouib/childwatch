import {UserService} from '../../../user/user.service';
import {User} from '../../../user/config.state';
import {Meal} from '../../model/meal';
import {MealEvent} from '../../model/meal-event';
import {Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ElementRef, ViewContainerRef} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {CalendarEvent, CalendarMonthViewDay} from 'angular-calendar';

import {FoodStateService} from '../../services/food-state.service';
import {MealEventService} from '../../services/meal-event.service';
import {MealService} from '../../services/meal.service';
import {MenuPrintDialogComponent} from './menu-print-dialog.component';
import * as moment from 'moment';
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
  styles: [`
    .weekend-cell {
      background-color: rgba(255, 228, 179, 0.7) !important;
    }    

    .chip {
        padding: 0 10px;
        height: 25px;
        font-size: 12px;
        line-height: 25px;
        border-radius: 25px;   
        border-style: solid;
        border-width: 0px; 
    }
    
    .chip img {
      min-height: 16px;
      height: 16px;
      min-width: 16px;
      width: 16px;
    }

    .my-container: {
      overflow: hidden;
      background: #5C97FF;
      position: relative;
    }

    .my-container:before {
      content: ' ';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0.1;
      background-repeat: no-repeat;
      background-position: 50% 0;
      -ms-background-size: cover;
      -o-background-size: cover;
      -moz-background-size: cover;
      -webkit-background-size: cover;
      background-size: cover;
    }
  
    .my-container-spring: {}

    .my-container-spring:before {
      background-image: url( '/assets/img/season/spring.jpg' );
    }
  
    .my-container-summer: {}

    .my-container-summer:before {
      background-image: url( '/assets/img/season/summer.jpg' );
    }

    .my-container-fall: {}

    .my-container-fall:before {
      background-image: url( '/assets/img/season/fall.jpg' );
    }

    .my-container-winter: {}

    .my-container-winter:before {
      background-image: url( '/assets/img/season/winter.jpg' );
    }
  `]
})
export class MealCalendarComponent implements OnInit {

  @ViewChild('modalTemplate') modal: ElementRef;
  @ViewChild('modalAlreadyScheduled') modalAlreadyScheduled: ElementRef;

  mealToDrop: Meal = undefined;
  whenToDrop: Date = undefined;

  viewDate: Date = new Date();
  view = 'month';
  activeDayIsOpen = false;

  showHideWeekends = [0, 6];
  _showWeekends = false;
  _showBackground = false;


  eventList: Array<CalendarEvent<MealEvent>> = [];

  refresh: Subject<any> = new Subject();

  filter = 'ALL';

  _opened = false;

  selectedDaysMeals: Meal[] = [];

  modalRef: BsModalRef;

  user: User;

  constructor(
    private state: FoodStateService,
    private mealSvc: MealService,
    private mealEventSvc: MealEventService,
    private userSvc: UserService,
    private router: Router,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private modalSvc: BsModalService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.userSvc.user$.subscribe(user => {this.user = user; this.showHideWeekends = this.user.weekendsShowing ? [] : [0, 6]});
  }

  ngOnInit() {
    this.mealSvc.query().subscribe();

    const today = new Date();

    this.state.adjustMenuTime(moment(today).startOf('month').toDate(), moment(today).endOf('month').toDate());
    this.state.mealEvents$.subscribe((events) => {
      this.eventList = events;
      this.refresh.next();
      console.log(events);
    });

  }

  gotoDate(when?: string, unit?: moment.unitOfTime.DurationConstructor) {

    this.viewDate = (when === undefined) ? new Date() : ((when === 'previous') ? moment(this.viewDate).subtract(1, unit) : moment(this.viewDate).add(1, unit)).toDate();
    this.state.adjustMenuTime(moment(this.viewDate).startOf('month').toDate(), moment(this.viewDate).endOf('month').toDate());
  }

  differentYear() {
    return !moment(this.viewDate).isSame(new Date(), 'year');
  }


  createMealEvent(meal: Meal, start?: Date): MealEvent {
    const mealEvent: MealEvent = {
      id: UUID.UUID(),
      startDate: moment((start) ? new Date(start) : new Date()).toDate(),
      endDate: moment((start) ? new Date(start) : new Date()).toDate(),
      recurrence: undefined,
      meal: meal
    };
    return mealEvent;
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

  deleteMeal(meal: Meal) {
    this.mealEventSvc.queryForMeal(meal).subscribe((events: MealEvent[]) => {
      if (events.length > 0) {
        this.modalRef = this.modalSvc.show(this.modalAlreadyScheduled, {ignoreBackdropClick: true});
      }
      else {
        this.state.inactivateMeal(meal);
        this.toastr.success('Meal ' + meal.description + ' has been inactivated.  It is still valid for past schedules, but no longer editable or available for future schedules', 'Inactivate Meal')
      }
    });
  }

  removeEvent(event: CalendarEvent<MealEvent>) {
    console.log('removing event ', event.meta.meal.id);
    // this.eventList = this.eventList.filter(e => e.meta.id !== event.meta.id);
    this.state.removeEvent(event);
  }



  afterStart(date: Date) {
    return moment(date).diff(moment('01/10/2017', 'DD/MM/YYYY'), 'days') >= 0;
  }

  showDialog() {
    this.modalRef = this.modalSvc.show(this.modal, {ignoreBackdropClick: true});
  }


  replaceMeal() {
    if (this.mealToDrop && this.whenToDrop) {
      this.eventList.filter(e => moment(e.start).diff(this.whenToDrop, 'days') === 0 && e.meta.meal.type === this.mealToDrop.type).forEach(event => this.removeEvent(event));
      this.dropMeal(this.mealToDrop, this.whenToDrop);
      this.mealToDrop = undefined;
      this.whenToDrop = undefined;
    }
    this.modalRef.hide();
  }

  mealTypeAlreadyPlanned(meal: Meal, when: Date) {
    return this.eventList.filter(e => moment(e.start).diff(when, 'days') === 0 && e.meta.meal.type === meal.type).length > 0;
  }

  dropMeal(meal: Meal, when: Date) {
    const mealEvent: CalendarEvent<MealEvent> = {
      start: moment(new Date(when)).toDate(),
      end: moment(new Date(when)).toDate(),
      meta: this.createMealEvent(meal, moment(new Date(when)).toDate()),
      title: meal.description,
      color: {primary: 'red', secondary: 'yellow'}
    }
    console.log(`dropped meal on ${mealEvent.start}`);
    this.viewDate = moment(new Date(when)).toDate();
    this.activeDayIsOpen = true;
    this.state.scheduleMealEvent(mealEvent.meta);
  }

  mealDropped(meal: Meal, when?: Date) {

    const _when = moment(new Date(when) || new Date(this.viewDate)).toDate();

    if (this.mealTypeAlreadyPlanned(meal, _when)) {
      this.mealToDrop = meal;
      this.whenToDrop = _when;
      this.showDialog()
    }
    else {
      this.dropMeal(meal, _when);
    }


  }


  limit(text: string, len?: number) {
    const _len = len || 25;
    return text.slice(0, _len) + (text.length > _len ? "..." : "");
  }

  dayClicked(event: any) {
    console.log(event);
    this.viewDate = event.day.date;
  }

  beforeMonthViewRender({body}: {body: CalendarMonthViewDay[]}): void {
    body.forEach(day => {
      if (day.isWeekend) day.cssClass = 'weekend-cell';
    });
  }

  printMenu() {
    this.modalRef = this.modalSvc.show(MenuPrintDialogComponent);
    this.modalRef.content.title = 'Print Menu';
    this.modalRef.content.user = this.user;
  }

}
