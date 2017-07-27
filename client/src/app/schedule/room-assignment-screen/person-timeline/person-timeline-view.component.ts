import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Assignment, Person, PersonSchedule } from '../../interfaces';
import { isoDate, timestamp, hmmTime } from '../../../../common/date-utils';
import { ScheduleSegment } from './person-timeline.component';

@Component({
  selector: 'cw-person-timeline-view',
  templateUrl: './person-timeline-view.component.html'
})
export class PersonTimelineViewComponent {
  @Input() presenceSummary: string;
  @Input() scheduleSummary: string;
  @Input() scheduleSegments: ScheduleSegment[] = [];
  @Input() presenceSegments: ScheduleSegment[] = [];
  @Input() person: Person;

  // Convert the schedule information into a flat form
  // that is also suitable for use in the form control
  @Input()
  set personSchedule(personSchedule: PersonSchedule) {
    if (personSchedule) {
      const newValue: any = {
        date: isoDate(personSchedule.date)
      };

      if (personSchedule.schedule && personSchedule.schedule.length > 0) {
        const s: Assignment = personSchedule.schedule[0];
        newValue.startTime = hmmTime(s.start);
        newValue.endTime = hmmTime(s.end);
        newValue.roomId = s.roomId;
      } else {
        newValue.startTime = '';
        newValue.endTime = '';
        newValue.roomId = '';
      }
      this.participantSchedule.setValue(newValue, { emitEvent: false });
    }
  }

  @Output() dateChanged = new EventEmitter();
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

  close() {
    this.closeForm.emit();
  }

}
