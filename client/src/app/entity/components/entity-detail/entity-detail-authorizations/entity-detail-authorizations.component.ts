import {Entity} from "../../../model/entity";
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'cw-entity-detail-authorizations',
  templateUrl: './entity-detail-authorizations.component.html',
  styleUrls: ['./entity-detail-authorizations.component.css']
})
export class EntityDetailAuthorizationsComponent implements OnInit {
  @Input() entity: Entity;

  showNotes0 = false;
  showNotes1 = false;

  constructor() {}

  ngOnInit() {
  }

}
