import { Component, Input } from '@angular/core';

import { Participant, Staff } from '../interfaces';
import { SchedulingService } from '../schedule.service';

@Component({
  selector: 'cw-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent {
  @Input() participants: Participant[];
  @Input() staff: Staff[];

  constructor(
    private scheduleManagement: SchedulingService
  ) { }

  clickStaff(s: Staff) {
    this.scheduleManagement.selectStaff(s);
  }

  clickParticipant(p: Participant) {
    this.scheduleManagement.selectParticipant(p);
  }

}
