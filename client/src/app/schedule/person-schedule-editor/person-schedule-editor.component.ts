import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Room, DateType, Schedule } from './../interfaces';
import { ScheduleManagementService } from '../services/schedule-editing.service';
import { PersonSchedule } from '../scheduling.state';
import { SchedulingStateService } from '../services/scheduling-state.service';

@Component({
  selector: 'cw-person-schedule-editor',
  templateUrl: './person-schedule-editor.component.html'
})
export class PersonScheduleEditorComponent {
  rooms$: Observable<Room[]>;
  personSchedule$: Observable<PersonSchedule>;

  constructor(
    schedulingState: SchedulingStateService,
    private scheduleManagement: ScheduleManagementService
  ) {
    this.rooms$ = schedulingState.rooms$;
    this.personSchedule$ = scheduleManagement.selectedPersonSchedule$;
  }

  closeSchedule() {
    this.scheduleManagement.close();
  }

  dateChanged(date: DateType) {
    this.scheduleManagement.dateChanged(date);
  }

  updateSchedule(schedule: Schedule[]) {
    this.scheduleManagement.updateSchedule(schedule);
  }
}
