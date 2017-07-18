import { Component, Input } from '@angular/core';
import * as _ from 'lodash';

import { TimelineRoom } from './timeline-calculations';

@Component({
  selector: 'cw-room-timeline',
  templateUrl: './room-timeline.component.html',
  styleUrls: ['./room-timeline.component.css']
})
export class RoomTimelineComponent {

  @Input() timeline: TimelineRoom;

  // right now
  @Input() dateTime: number;
  @Input() dayStart: number;

  // Set width of grids here.
  // This value is utilized in many relative positioning calculations
  STRIPE_GRID_WIDTH = 330;
  // Also useful for positioning calculatinos
  DAY_LENGTH = 1000 * 60 * 60 * 24;

  trackByFn = _.isEqual;
}
