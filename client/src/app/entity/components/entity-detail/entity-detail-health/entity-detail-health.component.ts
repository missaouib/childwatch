import {Entity} from "../../../model/entity";
import {Component, OnInit, Input} from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap";

@Component({
  selector: 'cw-entity-detail-health',
  templateUrl: './entity-detail-health.component.html',
  styleUrls: ['./entity-detail-health.component.css']
})
export class EntityDetailHealthComponent implements OnInit {
  @Input() entity: Entity;
  minDate = new Date(1900, 1, 1);
  maxDate = new Date();

  bsValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;
  constructor() {}

  ngOnInit() {
  }

}
