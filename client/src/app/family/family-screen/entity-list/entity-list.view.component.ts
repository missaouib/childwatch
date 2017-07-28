import { Component, Input, EventEmitter, Output } from '@angular/core';

import { Entity, Family, Participant, NonParticipant } from '../../family.interfaces';

@Component({
  selector: 'cw-entity-list-view',
  templateUrl: './entity-list.view.component.html',
})
export class EntityListViewComponent {

  @Input() families: Family[];
  @Input() nonParticipants: NonParticipant[];
  @Input() participants: Participant[];
  @Input() other: Entity[];
  @Input() selectedEntity: Entity;

  @Output() selectEntity = new EventEmitter<Entity>();

  constructor() { }

  clickEntity(entity: Entity) {
    this.selectEntity.emit(entity);
  }
}
