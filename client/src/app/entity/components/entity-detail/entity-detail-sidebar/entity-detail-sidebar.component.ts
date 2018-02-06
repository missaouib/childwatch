import {Entity} from "../../../model/entity";
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'cw-entity-detail-sidebar',
  templateUrl: './entity-detail-sidebar.component.html',
  styleUrls: ['./entity-detail-sidebar.component.css']
})
export class EntityDetailSidebarComponent implements OnInit {

  @Input() entity: Entity;

  constructor() {}

  ngOnInit() {
  }

}
