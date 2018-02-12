import {Entity} from "../../../model/entity";
import {Component, OnInit, Input} from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap";

@Component({
  selector: 'cw-entity-detail-attendance',
  templateUrl: './entity-detail-attendance.component.html',
  styleUrls: ['./entity-detail-attendance.component.css']
})
export class EntityDetailAttendanceComponent implements OnInit {

  @Input() entity: Entity;
  mytime: Date = new Date();
  minDate = new Date(1900, 1, 1);
  maxDate = new Date();

  bsValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;

  constructor() {}

  ngOnInit() {
  }

}
