import {MealEvent} from "../../../model/meal-event";
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {BsModalRef} from "ngx-bootstrap";
import * as moment from 'moment';

@Component({
  selector: 'cw-recurrence-dialog',
  templateUrl: './recurrence-dialog.component.html',
  styleUrls: ['./recurrence-dialog.component.css']
})
export class RecurrenceDialogComponent implements OnInit {

  _event: MealEvent = undefined;
  set event(event: MealEvent) {this._event = event; this.buildForm();}
  get event(): MealEvent {return this._event;}

  recurrenceForm: FormGroup;
  recurrenceType: string = 'NONE';

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder) {
    this.buildForm();
  }

  private buildForm() {
    const day = this.event && this.event.startDate ? new Date(this.event.startDate).getDay() : -1;

    console.log(`day = ${day}`);

    this.recurrenceForm = this.formBuilder.group({
      recurrenceType: [this.event ? this.event.recurrence : 'NONE', Validators.required],
      frequency: [1, Validators.required],
      skip: [true],
        replace: [true]
    });

    this.recurrenceForm.valueChanges.subscribe(() => this.recurrenceType = this.recurrenceForm.value.recurrenceType);
  }

  ngOnInit() {}





}
