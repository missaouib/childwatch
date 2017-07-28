import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MdSliderModule, MdButtonToggleModule, MdIconModule, MdCardModule, MdTabsModule,
  MdButtonModule, MdInputModule, MdSelectModule, MdDatepickerModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EffectsModule } from '@ngrx/effects';

import { ScheduleScreenComponent } from './schedule-screen/schedule-screen.component';
import { RoomTimelineComponent } from './room-timeline/room-timeline.component';
import { RoomSnapshotComponent } from './room-snapshot/room-snapshot.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PersonScheduleEditorComponent } from './person-schedule-editor/person-schedule-editor.component';
import { PersonScheduleEditorViewComponent } from './person-schedule-editor/person-schedule-editor-view.component';
import { PersonTimelineComponent } from './person-timeline/person-timeline.component';
import { PersonTimelineViewComponent } from './person-timeline/person-timeline-view.component';
import { SchedulingQueryService } from './services/scheduling-query.service';
import { ScheduleManagementService } from './services/schedule-editing.service';
import { SchedulingStateService } from './services/scheduling-state.service';
import { RoomOverviewComponent } from './room-overview/room-overview.component';
import { RoomOverviewViewComponent } from './room-overview/room-overview.view.component';
import { ViewControlsService } from './view-controls/view-controls.service';
import { ViewControlsComponent } from './view-controls/view-controls.component';
import { ViewControlsViewComponent } from './view-controls/view-controls.view.component';

const routes: Routes = [
  { path: '', component: ScheduleScreenComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EffectsModule.run(SchedulingQueryService),
    EffectsModule.run(ScheduleManagementService),
    ReactiveFormsModule,
    FlexLayoutModule,
    MdSliderModule,
    MdButtonToggleModule,
    MdIconModule,
    MdCardModule,
    MdTabsModule,
    MdButtonModule,
    MdInputModule,
    MdSelectModule,
    MdDatepickerModule
  ],
  declarations: [
    ScheduleScreenComponent,
    RoomTimelineComponent,
    RoomSnapshotComponent,
    PeopleListComponent,
    PersonScheduleEditorComponent,
    PersonScheduleEditorViewComponent,
    PersonTimelineComponent,
    PersonTimelineViewComponent,
    RoomOverviewComponent,
    RoomOverviewViewComponent,
    ViewControlsComponent,
    ViewControlsViewComponent
  ],
  providers: [
    SchedulingQueryService,
    ScheduleManagementService,
    SchedulingStateService,
    ViewControlsService
  ]
})
export class ScheduleModule { }
