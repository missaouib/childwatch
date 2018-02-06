import {Entity} from "../../model/entity";
import {EntityService} from "../../services/entity.service";
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'cw-entity-detail',
  templateUrl: './entity-detail.component.html',
  styleUrls: ['./entity-detail.component.css']
})
export class EntityDetailComponent implements OnInit {

  entity: Entity = undefined;

  constructor(
    private EntitySvc: EntityService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {

      var entityId = params['id'];
      if (entityId)
        this.EntitySvc.fetch(entityId).subscribe(entity => this.entity = entity);
    });
  }

}
