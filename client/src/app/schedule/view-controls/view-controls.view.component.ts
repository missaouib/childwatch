import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { MdSliderChange } from '@angular/material';

import { DateType, OperationMode, ViewMode } from '../interfaces';
import { isoDate, jsDate } from '../../../common/date-utils';


const SLIDER_INCREMENT_MINUTES = 15;
const SLIDER_TICK_MINUTES = 5;
const MINUTES_IN_DAY = 60 * 24;

@Component({
  selector: 'cw-view-controls-view',
  templateUrl: './view-controls.view.component.html',
  styleUrls: ['./view-controls.view.component.css']
})
export class ViewControlsViewComponent implements OnDestroy, OnInit {

  // The actual time of the client machine
  @Input() currentTime: DateType;
  // The time that the controls should reflect
  @Input() set displayTime(dateTime: DateType) {
    const timeAsMoment = moment(dateTime);

    this.dateControl.setValue(isoDate(dateTime), { emitEvent: false });

    // Convert to time slider offset
    this.timeControl.setValue(
      Math.floor((timeAsMoment.hour() * 60 + timeAsMoment.minute()) / SLIDER_INCREMENT_MINUTES) * SLIDER_INCREMENT_MINUTES,
      { emitEvent: false }
    );

    // Convert to date slider offset
    this.sliderControl.setValue(moment(dateTime).diff(this.currentTime, 'd'), { emitEvent: false })
    this.dateTime = dateTime;
  };
  // Resulting calculation of if user is operating in:
  // live, review or schedule
  @Input() operation: OperationMode;
  @Output() operationChange = new EventEmitter<OperationMode>();
  // Site overview/room details/timeline/etc
  @Input() viewMode: ViewMode;
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  // Simplify API by combining date and time for consumer
  @Output() reviewTimeChange = new EventEmitter<DateType>();

  // Attributes for slider behavior
  sliderMin = 0;
  sliderMax = MINUTES_IN_DAY - SLIDER_INCREMENT_MINUTES;
  sliderStep = SLIDER_INCREMENT_MINUTES;
  sliderTick = SLIDER_TICK_MINUTES;

  dateControl = new FormControl();
  sliderControl = new FormControl();
  timeControl = new FormControl();

  // Some operations require some local state management
  // dateTime represents the reconciliation between
  // app and local state
  dateTime: DateType;

  dateTimeSub: Subscription;
  start: Date;

  ngOnInit() {
    this.start = jsDate(this.dateTime);
    const timeAsMoment = moment(this.dateTime);

    this.timeControl.setValue(
      Math.floor((timeAsMoment.hour() * 60 + timeAsMoment.minute()) / SLIDER_INCREMENT_MINUTES) * SLIDER_INCREMENT_MINUTES,
      { emitEvent: false }
    );

    this.dateControl.setValue(isoDate(this.dateTime), { emitEvent: false });

    // Manage just a touch of state here
    // Simplify API by combining date and time for consumer
    this.dateTimeSub = Observable.combineLatest(
      this.timeControl.valueChanges.startWith(this.timeControl.value).filter(date => !!date),
      this.dateControl.valueChanges.startWith(this.dateControl.value).filter(date => !!date),
      (t, d) => this.reviewTimeChange.emit(moment(d).clone().add(t, 'minutes').valueOf())
    ).subscribe();
  }

  updateTimeStatus(status: OperationMode) {
    this.operationChange.emit(status);
  }

  updateViewMode(mode: ViewMode) {
    this.viewModeChange.emit(mode);
  }

  // Update while dragging for interactive graphs
  localTimeChanged(offset: MdSliderChange) {
    this.reviewTimeChange.emit(moment(this.dateTime).startOf('d').clone().add(offset.value, 'minutes').valueOf())
  }

  // When slider changes just update the date control, date control will update state
  localDateChanged(offset: MdSliderChange) {
    this.dateControl.setValue(isoDate(moment(this.displayTime).startOf('day').clone().add(offset.value, 'days')));
  }

  ngOnDestroy() {
    this.dateTimeSub.unsubscribe();
  }

}
