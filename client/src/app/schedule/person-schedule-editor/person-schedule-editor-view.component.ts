import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Schedule, Room, Person } from '../interfaces';
import { PersonSchedule } from '../scheduling.state';
import { isoDate, timestamp, hmmTime } from '../../../common/date-utils';

@Component({
  selector: 'cw-person-schedule-editor-view',
  templateUrl: './person-schedule-editor-view.component.html'
})
export class PersonScheduleEditorViewComponent {
  private _personSchedule: PersonSchedule;
  private person: Person;
  @Input()
  set personSchedule(personSchedule: PersonSchedule) {
    this._personSchedule = personSchedule;
    if (personSchedule) {
      this.person = personSchedule.who;
      const newValue: any = {
        date: isoDate(personSchedule.date)
      };

      if (personSchedule.schedule && personSchedule.schedule.length > 0) {
        const s: Schedule = personSchedule.schedule[0];
        newValue.startTime = hmmTime(s.start);
        newValue.endTime = hmmTime(s.end);
        newValue.roomId = s.roomId;
      } else {
        newValue.startTime = '';
        newValue.endTime = '';
        newValue.roomId = '';
      }
      this.participantSchedule.setValue(newValue, { emitEvent: false });
    } else {
      this.person = undefined;
    }
  }

  @Input() rooms: Room[];
  @Output() dateChanged = new EventEmitter();
  @Output() updateSchedule = new EventEmitter();
  @Output() closeForm = new EventEmitter();

  participantSchedule: FormGroup;

  constructor(fb: FormBuilder) {
    this.participantSchedule = fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      roomId: ['', Validators.required]
    });

    this.participantSchedule.controls['date'].valueChanges
      .distinctUntilChanged()
      .subscribe(dateString => this.dateChanged.emit(timestamp(dateString)));
  }

  click() {
    const date = this.participantSchedule.controls['date'].value;
    const start = this.participantSchedule.controls['startTime'].value;
    const end = this.participantSchedule.controls['endTime'].value;
    const roomId = this.participantSchedule.controls['roomId'].value;
    // TODO: implement parsing and validation
    const schedule = [{
      roomId,
      start: timestamp(date + ' ' + start),
      end: timestamp(date + ' ' + end)
    }];
    this.updateSchedule.emit(schedule);
  }

  close() {
    this.closeForm.emit();
  }
}
