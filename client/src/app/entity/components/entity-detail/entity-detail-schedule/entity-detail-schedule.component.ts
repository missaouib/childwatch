import {Entity} from "../../../model/entity";
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'cw-entity-detail-schedule',
  templateUrl: './entity-detail-schedule.component.html',
  styleUrls: ['./entity-detail-schedule.component.css']
})
export class EntityDetailScheduleComponent implements OnInit {
  @Input() entity: Entity;

  constructor() {}

  ngOnInit() {
  }

}
