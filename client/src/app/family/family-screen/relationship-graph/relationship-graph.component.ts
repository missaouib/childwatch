import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RelationshipGraphService, EntityGraphNode, RelationshipLink } from './relationship-graph.service';
@Component({
  selector: 'cw-relationship-graph',
  templateUrl: './relationship-graph.component.html',
})
export class RelationshipGraphComponent {
  linksAndNodes: Observable<{ relationships: RelationshipLink[], entities: EntityGraphNode[] }>;
  entities: Observable<EntityGraphNode[]>;
  constructor(private rgs: RelationshipGraphService) {
    this.linksAndNodes = rgs.linksAndNodes;
  }

  windowSizeChanged(newSize: {height: number, width: number}){
    this.rgs.updateSize(newSize);
  }

}
