import {Entity} from "../../../model/entity";
import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'cw-entity-detail-header',
  templateUrl: './entity-detail-header.component.html',
  styleUrls: ['./entity-detail-header.component.css']
})
export class EntityDetailHeaderComponent implements OnInit {

  @Input() entity: Entity;
  @Output() onChange: EventEmitter<Entity> = new EventEmitter<Entity>();

  constructor() {}

  ngOnInit() {
  }

}
