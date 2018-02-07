import {Entity} from "../../../model/entity";
import {Component, OnInit, Input} from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";

@Component({
  selector: 'cw-entity-detail-cacfp',
  templateUrl: './entity-detail-cacfp.component.html',
  styleUrls: ['./entity-detail-cacfp.component.css']
})
export class EntityDetailCacfpComponent implements OnInit {
  @Input() entity: Entity;
  minDate = new Date(1900, 1, 1);
  maxDate = new Date();

  bsValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;
  constructor() {}

  ngOnInit() {
  }

}
