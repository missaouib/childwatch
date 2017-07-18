import { Injectable } from '@angular/core';
import {
  forceSimulation,
  Simulation,
  SimulationNodeDatum,
  SimulationLinkDatum,
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceLink
} from 'd3-force';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { FamilyInfoService } from '../../family-info.service';
import {Affinity, Entity,  Relationship,  RelationshipType} from '../../family.interfaces';

/**
 * Used to abstract the complexities and concerns of D3, state and other family data sources
 *
 * The primary responsibility is to expose an observable collection of
 * entities and their relationships, a list of hovered and selected entities and any other data
 * needed to drive visualization components.
 */

/**
 * The following interface is used to represent an entity
 * after it has passed through the d3 force algorithm. This type
 * should ideally be used only along the critical path of displaying
 * a network graph or consuming its events.
 */
export interface EntityGraphNode extends SimulationNodeDatum, Entity { }

export interface RelationshipLink extends Relationship, SimulationLinkDatum<EntityGraphNode> {
  to: string;
  from: string;
  relationshipType: RelationshipType;
  notes?: string;
  source: string;
  target: string;
}

const relationshipTypes: RelationshipType[] = [
  {
    id: '1',
    name: 'family',
    custom: false,
    affinity: Affinity.Neutral,
    bidirectional: false
  }
];

@Injectable()
export class RelationshipGraphService {
  // Force ticked outgoing streams of data
  linksAndNodes: Subject<{ relationships: RelationshipLink[], entities: EntityGraphNode[] }> = new Subject();

  private forceSimulation: Simulation<EntityGraphNode, RelationshipLink>;
  // Store in state?
  private sizes: BehaviorSubject<{ width: number, height: number }> = new BehaviorSubject({ width: 100, height: 100 });

  constructor(fis: FamilyInfoService) {
    const allRelationships = Observable.combineLatest(
      fis.familyRelationships,
      fis.nonParticipantRelationships,
      (familyRelationships, nonParticipantRelationships) => {
        const relationships: Relationship[] = [];

        for (const fr of familyRelationships) {
          relationships.push({
            from: fr.participantId,
            to: fr.familyId,
            relationshipType: relationshipTypes[0]
          });
        }

        for (const npr of nonParticipantRelationships) {
          relationships.push({
            from: npr.participantId,
            to: npr.nonParticipantId,
            relationshipType: relationshipTypes[0]
          });
        }

        return relationships;
      }
    );

    // Watch the selected entity, the list of entitie, the list of relationships
    // and the current size of the graph. Combine together to produce graph of
    // single depth relationships connected to selected entity
    //
    // TODO inspect the type of entity to add additional context
    // TODO family mode: dont show central hub, just connections among members
    // TODO particpant mode: center on selected entity and show all relationships
    // TODO NPP mode: see participant mode
    // TODO other mode: single depth relationships connected to selected entity
    Observable.combineLatest(
      fis.selectedEntity,
      fis.allEntities,
      allRelationships,
      this.sizes.distinctUntilChanged((x, y) => x.height === y.height && x.width === y.width),
      (selectedEntity, allEntities, _allRelationships, sizes) => {
        if (selectedEntity) {
          const graphRelationships: RelationshipLink[] = relationshipsFromSelectedEntity(_allRelationships, selectedEntity);
          const graphEntities: EntityGraphNode[] = singleDepthEntitiesFromRels(graphRelationships, allEntities);
          return {
            graphRelationships,
            graphEntities,
            sizes
          };
        }
      })
      .filter(value => !!value && !!value.graphEntities && !!value.graphRelationships && !!value.sizes)
      .subscribe(({ graphRelationships, graphEntities, sizes }) => {
        this.updateForce(_.cloneDeep(_.uniqBy(graphEntities, 'id')), _.cloneDeep(graphRelationships), sizes.height, sizes.width);
      });
  }

  updateSize(newSize: { height: number, width: number }) {
    this.sizes.next(newSize);
  }

  // Creates a new force directed graph
  // pushes a new array to relationships and entities 
  updateForce(entities: EntityGraphNode[], relationships: RelationshipLink[], height: number, width: number) {
    this.forceSimulation = forceSimulation(entities)
      .force('charge', forceManyBody().strength(-300))
      .force('center', forceCenter(width / 2, height / 2))
      .force('x', forceX())
      .force('y', forceY())
      .alphaMin(.05)
      .on('tick', () => {
        this.linksAndNodes.next({ relationships: [...relationships], entities: [...entities] });
      })
      .force('link', forceLink(relationships)
        .id((node: EntityGraphNode) => node.id)
        .distance(150).strength(1));
  }
}

function relationshipsFromSelectedEntity(relationships: Relationship[], selectedEntity: Entity) {
  const graphRelationships: RelationshipLink[] = [];
  relationships
    .filter(relationship => (relationship.to === selectedEntity.id || relationship.from === selectedEntity.id))
    .forEach(relationship => graphRelationships.push({ ...relationship, source: relationship.from, target: relationship.to }));
  return graphRelationships;
}

function singleDepthEntitiesFromRels(relationships: RelationshipLink[], allEntities: Entity[]) {
  const graphEntities: EntityGraphNode[] = [];
  relationships.forEach(relationship => {
    const tar = allEntities.find(entity => entity.id === relationship.target)
    const source = allEntities.find(entity => entity.id === relationship.source);
    if (tar) { graphEntities.push(tar) }
    if (source) { graphEntities.push(source) }
  })
  return graphEntities;
}