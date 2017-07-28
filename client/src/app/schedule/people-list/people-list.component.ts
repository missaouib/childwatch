import { Component, Input } from '@angular/core';

import { Participant, Staff } from '../interfaces';
import { ScheduleManagementService } from '../services/schedule-editing.service';

@Component({
  selector: 'cw-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent {
  @Input() participants: Participant[];
  @Input() staff: Staff[];

  constructor(
    private scheduleManagement: ScheduleManagementService
  ) { }

  clickStaff(s: Staff) {
    this.scheduleManagement.selectStaff(s);
  }

  clickParticipant(p: Participant) {
    this.scheduleManagement.selectParticipant(p);
  }

}
