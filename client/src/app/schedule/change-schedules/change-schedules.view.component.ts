import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Staff, Participant, PersonSchedule } from '../interfaces';

@Component({
  selector: 'cw-change-schedules-view',
  templateUrl: './change-schedules.view.component.html',
  styleUrls: ['./change-schedules.view.component.css']
})
export class ChangeSchedulesViewComponent {
  @Input() staff: Staff[];
  @Input() participants: Participant[];
  @Input() selectedPersonSchedule: PersonSchedule;

  @Output() selectStaff = new EventEmitter<Staff>();
  @Output() selectParticipant = new EventEmitter<Participant>();

  clickParticipant(p: Participant) {
    this.selectParticipant.emit(p);
  }

  clickStaff(s: Staff) {
    this.selectStaff.emit(s);
  }
}
