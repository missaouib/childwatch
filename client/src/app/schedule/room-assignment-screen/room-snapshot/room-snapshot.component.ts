import { Component, Input } from '@angular/core';
import * as _ from 'lodash';

import { SnapshotRoom } from '../../snapshot-trans';
import { OperationMode } from '../../interfaces';

@Component({
  selector: 'cw-room-snapshot',
  templateUrl: './room-snapshot.component.html',
  styleUrls: ['./room-snapshot.component.css']
})
export class RoomSnapshotComponent {
  @Input() room: SnapshotRoom;
  @Input() operation: OperationMode;

  trackSlots = _.isEqual;
}
