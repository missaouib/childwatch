import {Entity} from "../../model/entity";
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'cw-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {

  @Input() entity: Entity;
  @Input() relatedEntity: Entity;

  constructor() {}

  ngOnInit() {
  }

}
