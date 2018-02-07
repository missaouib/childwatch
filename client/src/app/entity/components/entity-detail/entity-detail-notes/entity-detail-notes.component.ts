import {Entity} from "../../../model/entity";
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'cw-entity-detail-notes',
  templateUrl: './entity-detail-notes.component.html',
  styleUrls: ['./entity-detail-notes.component.css']
})
export class EntityDetailNotesComponent implements OnInit {
  @Input() entity: Entity;

  constructor() {}

  ngOnInit() {
  }

}
