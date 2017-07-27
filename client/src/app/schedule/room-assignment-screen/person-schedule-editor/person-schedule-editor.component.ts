import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ClientSchedule, PersonSchedule } from '../../interfaces';
import { SchedulingService } from '../../schedule.service';

@Component({
  selector: 'cw-person-schedule-editor',
  templateUrl: './person-schedule-editor.component.html'
})
export class PersonScheduleEditorComponent {
  schedule$: Observable<ClientSchedule>;

  personSchedule$: Observable<PersonSchedule>;

  constructor(
    private scheduleManagement: SchedulingService,
  ) {
    this.schedule$ = scheduleManagement.schedule;

    this.personSchedule$ = scheduleManagement.selectedPersonSchedule;
  }

  closeSchedule() {
    this.scheduleManagement.close();
  }

  // Update with new data model
  updateSchedule(schedule: ClientSchedule) {
    this.scheduleManagement.updateSchedule(schedule);
  }
}
