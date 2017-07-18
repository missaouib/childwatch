import { Component, Input} from '@angular/core';

import { SnapshotRoom } from '../snapshot-trans';

@Component({
  selector: 'cw-room-overview-view',
  templateUrl: './room-overview.view.component.html',
  styleUrls: ['./room-overview.view.component.css']
})
export class RoomOverviewViewComponent {
  @Input() room: SnapshotRoom;
  @Input() ratio: number;
  @Input() withinRatio: boolean;
  @Input() participants: number;
  @Input() staff: number;
}
