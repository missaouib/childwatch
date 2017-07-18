import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FamilyInfoService } from '../../family-info.service';
import { Entity, Family, Participant, NonParticipant } from '../../family.interfaces';

@Component({
  selector: 'cw-entity-list',
  templateUrl: './entity-list.component.html',
})
export class EntityListComponent {

  families: Observable<Family[]>;
  participants: Observable<Participant[]>;
  nonParticipants: Observable<NonParticipant[]>;
  other: Observable<any[]>;
  selectedEntity: Observable<{id: string}>;

  constructor(private fis: FamilyInfoService) {
    this.families = fis.families;
    this.participants = fis.participants;
    this.nonParticipants = fis.nonParticipants;
    this.other = Observable.of([]); // TODO
    this.selectedEntity = fis.selectedEntity;
  }

  selectEntity(entity: Entity) {
    this.fis.selectEntity(entity);
  }
}
