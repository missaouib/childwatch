import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Person, Room, DateType, Schedule } from './../interfaces';
import { ScheduleManagementService } from '../services/schedule-editing.service';
import { PersonSchedule } from '../scheduling.state';
import { SchedulingStateService } from '../services/scheduling-state.service';
import { hmmaTime } from '../../../common/date-utils';

/**
 * Type definition for the data structure used by the template for displaying
 * participant placements past, present and future
 * Generated by processing a timeline schedule and a list of rooms
 */
// TODO: rename
export interface ScheduleSegment {
  roomName: string;
  start: DateType;
  end: DateType;
}

@Component({
  selector: 'cw-person-timeline',
  templateUrl: './person-timeline.component.html'
})
export class PersonTimelineComponent {
  selectedPersonSchedule$: Observable<PersonSchedule>;
  selectedPerson$: Observable<Person>;

  // Short description of the person's whereabouts
  presenceSummary$: Observable<string>;
  // Short description of the person's upcoming schedule
  scheduleSummary$: Observable<string>;
  // Particpants schedule suitable for template iteration
  scheduleSegments$: Observable<ScheduleSegment[]>;
  // Particpants presence suitable for template iteration
  presenceSegments$: Observable<ScheduleSegment[]>;

  constructor(
    private schedulingStateService: SchedulingStateService,
    private scheduleManagement: ScheduleManagementService
  ) {

    this.selectedPersonSchedule$ = scheduleManagement.selectedPersonSchedule$;
    this.selectedPerson$ = scheduleManagement.selectedPerson$;

    // map over the presence segments and join them to the room
    // for display in the view component
    this.presenceSegments$ = Observable.combineLatest(
      this.schedulingStateService.presences$,
      this.schedulingStateService.rooms$,
      (presences, rooms) => {
        const presenceSegments: ScheduleSegment[] = [];
        if (presences) {
          presences.forEach(presence => {
            const currentRoom: Room = rooms.find(room => presence.roomId === room.id);
            presenceSegments.push({
              roomName: currentRoom.name,
              start: presence.start,
              end: presence.end
            });
          });
        }
        return presenceSegments;
      }
    );

    // map over the schedule segments and join them to the room
    // for display in the view component
    this.scheduleSegments$ = Observable.combineLatest(
      this.schedulingStateService.schedules$,
      this.schedulingStateService.rooms$,
      (schedules, rooms) => {
        const scheduleSegments: ScheduleSegment[] = [];
        if (schedules) {
          schedules.forEach(schedule => {
            const currentRoom: Room = rooms.find(room => schedule.roomId === room.id);
            scheduleSegments.push({
              roomName: currentRoom.name,
              start: schedule.start,
              end: schedule.end
            });
          });
        }
        return scheduleSegments;
      }
    );

    // Join the room and the presence information to produce
    // a summary message of the participants current whereabouts
    this.presenceSummary$ = Observable.combineLatest(
      this.schedulingStateService.presences$,
      this.schedulingStateService.rooms$,
      (presences, rooms) => {
        if (presences && presences.length > 0 && !presences[presences.length - 1].end) {
          const currentRoom: Room = rooms.find(room => presences[presences.length - 1].roomId === room.id);
          return 'In room: ' + currentRoom.name;
        } else {
          return 'Absent';
        }
      });

    // join the room and the summary information to produce
    // a summery message of the where the participant will be
    this.scheduleSummary$ = this.schedulingStateService.schedules$
      .map(schedule => {
        if (schedule && schedule.length > 0) {
          return 'Scheduled for ' +
            hmmaTime(schedule[0].start) + ' - ' + hmmaTime(schedule[schedule.length - 1].end);
        } else {
          return 'No schedule';
        }
      });
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
