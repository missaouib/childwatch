import {
  Component,
  AnimationEntryMetadata,
  trigger,
  state,
  style,
  animate,
  transition,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnInit
} from '@angular/core';

import { EntityGraphNode, RelationshipLink } from './relationship-graph.service';

// Animate the mouseover transition of entity size
const animations: AnimationEntryMetadata[] = [
  trigger('hoverState', [
    state('on', style({
      transform: 'scale(2.5)'
    })),
    transition('off <=> on', animate('150ms')),
  ]),
  trigger('hoverText', [
    state('on', style({
      opacity: '1',
      fontWeight: 'bold'
    })),
    transition('off <=> on', animate('150ms'))
  ])
];

/**
 * Component used to render the force directed graph
 * of a family
 */
@Component({
  selector: 'cw-relationship-graph-view',
  templateUrl: './relationship-graph.view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: animations,
})
export class RelationshipGraphViewComponent implements OnInit {
  @Input() set linksAndNodes(value: { relationships: RelationshipLink[], entities: EntityGraphNode[] }) {
    if (value) {
      this.relationships = value.relationships;
      this.entities = value.entities;
    }
  };
  @ViewChild('svgEle') svgElement: ElementRef;
  @Output() windowSizeChanged = new EventEmitter<{ height: number; width: number }>()
  // The entity that the user's mouse is currently over, if any
  hoverEntity: EntityGraphNode = undefined;
  // The list of relationships within the current family
  relationships: RelationshipLink[];
  // The list of entities within the current family
  entities: EntityGraphNode[];
  constructor() {
    window.addEventListener('resize', () => {
      this.windowSizeChanged.emit({
        height: this.svgElement.nativeElement.clientHeight,
        width: this.svgElement.nativeElement.clientWidth
      });
    });
  }

  ngOnInit() {
    this.windowSizeChanged.emit({
      height: this.svgElement.nativeElement.clientHeight,
      width: this.svgElement.nativeElement.clientWidth
    });
  }

  /**
   * Event that is fired when a user's mouse moves over an entity
   * This is used in conjunction with animation above to enlarge the appearance
   * of the entity.
   * @param entity The entity that triggered the event
   */
  mouseOver(entity: EntityGraphNode) {
    this.hoverEntity = entity;
  }

  /**
   * Event that is fired when a user selects
   * a relationship from the graph.
   */
  relationshipSelected(relationship: RelationshipLink) {
    console.log('selected', relationship);
  }

  /**
   * Event that is fired when a user selectes
   * an entity from the graph
   */
  entitySelected(entity: EntityGraphNode) {
    console.log('selected', entity);
  }

}
