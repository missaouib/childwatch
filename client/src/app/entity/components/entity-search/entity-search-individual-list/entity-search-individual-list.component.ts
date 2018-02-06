import {Entity} from "../../../model/entity";
import {EntityService} from "../../../services/entity.service";
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cw-entity-search-individual-list',
  templateUrl: './entity-search-individual-list.component.html',
  styleUrls: ['./entity-search-individual-list.component.css']
})
export class EntitySearchIndividualListComponent implements OnInit {


  Entities: Entity[] = [];

  constructor(private EntitySvc: EntityService) {}

  ngOnInit() {
    this.EntitySvc.query().subscribe(entities => this.Entities = entities);
  }

}
