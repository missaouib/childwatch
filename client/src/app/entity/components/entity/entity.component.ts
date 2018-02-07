import {Entity} from "../../model/entity";
import {EntityRelationship} from "../../model/entity-relationship";
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'cw-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {

  @Input() relationship: EntityRelationship;
  @Input() direction: string = "from";

  constructor() {}

  ngOnInit() {
  }

  relationshipDisplay() {
    console.log(`type = ${this.relationship.type}`);
    if (this.relationship.type === 'PARENT' && this.relationship[this.direction].gender === 'MALE')
      return 'Father';
    else if (this.relationship.type === 'PARENT' && this.relationship[this.direction].gender === 'FEMALE')
      return 'Mother'
    else return this.relationship.type;
  }

}
