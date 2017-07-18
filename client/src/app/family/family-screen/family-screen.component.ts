import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FamilyInfoService } from '../family-info.service';
import { Entity, EntityType } from '../family.interfaces';
@Component({
  selector: 'cw-family-screen',
  templateUrl: './family-screen.component.html',
  styleUrls: ['./family-screen.component.css']
})
export class FamilyScreenComponent {

  selectedEntity: Observable<Entity>;
  entityTypes = EntityType;

  constructor(fis: FamilyInfoService) {
    this.selectedEntity = fis.selectedEntity;
  }
}
