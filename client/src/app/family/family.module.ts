import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MdTabsModule,
  MdButtonModule,
  MdCardModule,
  MdChipsModule,
  MdInputModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdSelectModule
} from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EffectsModule } from '@ngrx/effects';

import { FamilyScreenComponent } from './family-screen/family-screen.component';
import { EntityListComponent } from './family-screen/entity-list/entity-list.component';
import { EntityListViewComponent } from './family-screen/entity-list/entity-list.view.component';
import { FamilyDetailsComponent } from './family-screen/family-details/family-details.component';
import { FamilyDetailsViewComponent } from './family-screen/family-details/family-details.view.component';
import { RelationshipGraphComponent } from './family-screen/relationship-graph/relationship-graph.component';
import { RelationshipGraphViewComponent } from './family-screen/relationship-graph/relationship-graph.view.component';
import { RelationshipGraphService } from './family-screen/relationship-graph/relationship-graph.service';
import { FamilyInfoService } from './family-info.service';
import { ParticipantDetailsComponent } from './family-screen/participant-details/participant-details.component';
import { ParticipantDetailsViewComponent } from './family-screen/participant-details/participant-details.view.component';
const routes: Routes = [
  { path: '', component: FamilyScreenComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MdTabsModule,
    MdCardModule,
    MdChipsModule,
    MdButtonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    MdInputModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdSelectModule,
    EffectsModule.run(FamilyInfoService)
  ],
  declarations: [
    FamilyScreenComponent,
    EntityListComponent,
    EntityListViewComponent,
    FamilyDetailsComponent,
    FamilyDetailsViewComponent,
    RelationshipGraphComponent,
    RelationshipGraphViewComponent,
    ParticipantDetailsComponent,
    ParticipantDetailsViewComponent
  ],
  providers: [
    RelationshipGraphService,
    FamilyInfoService
  ]
})
export class FamilyModule { }
