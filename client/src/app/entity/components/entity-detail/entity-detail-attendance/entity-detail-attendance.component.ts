import {Entity} from "../../../model/entity";
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'cw-entity-detail-attendance',
  templateUrl: './entity-detail-attendance.component.html',
  styleUrls: ['./entity-detail-attendance.component.css']
})
export class EntityDetailAttendanceComponent implements OnInit {

  @Input() entity: Entity;
  constructor() {}

  ngOnInit() {
  }

}
