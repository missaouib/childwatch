import {Entity} from "../../../model/entity";
import {Component, OnInit, Input} from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";

@Component({
  selector: 'cw-entity-detail-personal',
  templateUrl: './entity-detail-personal.component.html',
  styleUrls: ['./entity-detail-personal.component.css']
})
export class EntityDetailPersonalComponent implements OnInit {

  @Input() entity: Entity;
  minDate = new Date(1900, 1, 1);
  maxDate = new Date();

  bsValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;

  constructor() {}

  ngOnInit() {
    this.bsConfig = Object.assign({}, {containerClass: 'theme-orange'});
  }

}
