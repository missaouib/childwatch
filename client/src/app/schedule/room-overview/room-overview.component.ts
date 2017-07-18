import { Component, Input, OnChanges } from '@angular/core';

import { SnapshotRoom } from '../snapshot-trans';
import { OperationMode } from '../interfaces';
@Component({
  selector: 'cw-room-overview',
  templateUrl: './room-overview.component.html'
})
export class RoomOverviewComponent implements OnChanges {
  @Input() room: SnapshotRoom;
  @Input() operation: OperationMode;
  ratio: number;
  withinRatio: boolean;
  participants = 0;
  staff = 0;

  ngOnChanges() {
    this.staff = 0;
    this.participants = 0;
    if (this.operation === 'LIVE') {
      this.room.staffSlots.map(s => {
        if (s.present) {
          this.staff++;
        }
      });
      this.room.slots.map(p => {
        if (p.present) {
          this.participants++;
        }
      });
    } else {
      this.room.staffSlots.map(s => {
        if (s.scheduled === 'Arriving' || s.scheduled === 'Planned') {
          this.staff++;
        }
      });
      this.room.slots.map(p => {
        if (p.scheduled === 'Arriving' || p.scheduled === 'Planned') {
          this.participants++;
        }
      });
    }
    this.ratio = this.staff > 0 ? Math.round(this.participants / this.staff + 0.49) : 0;
    this.withinRatio = this.ratio <= 7; // will be replaced by logic that uses the real maxima based on age groups
  }
}
