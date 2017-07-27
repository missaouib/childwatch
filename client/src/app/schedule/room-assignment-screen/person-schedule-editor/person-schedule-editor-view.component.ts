import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import * as _ from 'lodash';

import { ClientSchedule, Person, PersonSchedule, DaySchedule } from '../../interfaces';
import { isoDate } from '../../../../common/date-utils';
import { timesValid } from '../../schedule.service';

@Component({
  selector: 'cw-person-schedule-editor-view',
  templateUrl: './person-schedule-editor-view.component.html'
})
export class PersonScheduleEditorViewComponent {
  person: Person;
  @Input() set schedule(scheduleInfo: ClientSchedule) {
    if (scheduleInfo) {
      const schedules = scheduleInfo.days;
      this.recurringSchedule.setValue({ schedules });
    } else {
      this.recurringSchedule.reset();
    }
  }
  @Input()
  set personSchedule(personSchedule: PersonSchedule) {
    if (personSchedule) {
      this.person = personSchedule.who;
    } else {
      this.person = undefined;
    }
  }

  @Output() updateSchedule = new EventEmitter();

  recurringSchedule: FormGroup;
  weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days: AbstractControl[];

  constructor(private fb: FormBuilder) {
    this.recurringSchedule = fb.group({
      schedules: new FormArray(this.initDaySchedules(), this.validator as ValidatorFn),
    });
    this.days = (this.recurringSchedule.get('schedules') as FormArray).controls;
  }
  validator(days: FormArray) {
    (days.value as DaySchedule[]).map(d => {
      if (!timesValid(d)) {
        return {
          startBeforeEnd: true
        };
      }
    });
  }

  initDaySchedules() {
    const timePattern = RegExp('[012][0-9]:[0-5][0-9]');
    return _.times(7, () => this.fb.group({
      start1: ['', [Validators.pattern(timePattern)]],
      end1: ['', [Validators.pattern(timePattern)]],
      start2: ['', [Validators.pattern(timePattern)]],
      end2: ['', [Validators.pattern(timePattern)]]
    }));
  }

  click() {
    this.updateSchedule.emit({
      personId: this.person.id,
      effectiveDate: isoDate(new Date()),
      days: this.recurringSchedule.value.schedules
    });
  }
}
