import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Staff, Participant, PersonSchedule } from '../interfaces';
import { SchedulingService } from '../schedule.service';

@Component({
  selector: 'cw-change-schedules',
  templateUrl: './change-schedules.component.html'
})
export class ChangeSchedulesComponent {
  staff$ = this.scheduleManagement.staff;
  participants$ = this.scheduleManagement.participants;

  selectedPersonSchedule$: Observable<PersonSchedule>;

  constructor(private scheduleManagement: SchedulingService) {
    this.selectedPersonSchedule$ = scheduleManagement.selectedPersonSchedule;
  }

  selectStaff(s: Staff) {
    this.scheduleManagement.selectStaff(s);
  }

  selectParticipant(p: Participant) {
    this.scheduleManagement.selectParticipant(p);
  }
}
