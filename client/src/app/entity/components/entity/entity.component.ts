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

  public relationshipDisplay() {
    console.log(`type = ${this.relationship.type}`);
    if (this.relationship.type === 'PARENT' && this.relationship[this.direction].gender === 'MALE')
      return 'Father';
    else if (this.relationship.type === 'PARENT' && this.relationship[this.direction].gender === 'FEMALE')
      return 'Mother'
    else return this.relationship.type;
  }

  public image(): string {
    switch (this.relationship[this.direction].id) {
      case '1':
        return '/assets/img/baby9.jpg';
      case '2':
        return '/assets/img/dad.jpg';
      case '3':
        return '/assets/img/mom.jpg';
      case '4':
        return '/assets/img/uncle.jpg';
      case '5':
        return '/assets/img/aupair.jpg';
      default:
        return '/assets/face-0.jpg';
    }
  }
}
