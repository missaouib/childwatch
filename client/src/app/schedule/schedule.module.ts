import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MdSliderModule, MdButtonToggleModule, MdIconModule, MdCardModule, MdTabsModule,
  MdButtonModule, MdInputModule, MdSelectModule, MdCheckboxModule, MdDatepickerModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EffectsModule } from '@ngrx/effects';

import { ScheduleScreenComponent } from './schedule-screen/schedule-screen.component';
import { RoomTimelineComponent } from './room-timeline-screen/room-timeline/room-timeline.component';
import { RoomSnapshotComponent } from './room-assignment-screen/room-snapshot/room-snapshot.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PersonScheduleEditorComponent } from './room-assignment-screen/person-schedule-editor/person-schedule-editor.component';
import { PersonScheduleEditorViewComponent } from './room-assignment-screen/person-schedule-editor/person-schedule-editor-view.component';
import { PersonTimelineComponent } from './room-assignment-screen/person-timeline/person-timeline.component';
import { PersonTimelineViewComponent } from './room-assignment-screen/person-timeline/person-timeline-view.component';
import { SchedulingService } from './schedule.service';
import { ScheduleServerApiService } from './schedule-server-api.service';
import { RoomOverviewComponent } from './overview-screen/room-overview/room-overview.component';
import { RoomOverviewViewComponent } from './overview-screen/room-overview/room-overview.view.component';
import { OverviewScreenComponent } from './overview-screen/overview-screen.component';
import { ViewControlsService } from './view-controls/view-controls.service';
import { ViewControlsComponent } from './view-controls/view-controls.component';
import { ViewControlsViewComponent } from './view-controls/view-controls.view.component';
import { RoomAssignmentScreenComponent } from './room-assignment-screen/room-assignment-screen.component';
import { RoomTimelineScreenComponent } from './room-timeline-screen/room-timeline-screen.component';
import { ChangeSchedulesComponent } from './change-schedules/change-schedules.component';
import { ChangeSchedulesViewComponent } from './change-schedules/change-schedules.view.component';
import { ViewMode } from './interfaces';

const routerData: { [key: string]: ViewMode } = {
  overview: 'overview',
  assignment: 'assignment',
  timeline: 'timeline',
  recurring: 'recurring'
};

const routes: Routes = [
  {
    path: '',
    component: ScheduleScreenComponent,
    children: [
      { path: '', redirectTo: 'overview' },
      { path: 'overview', component: OverviewScreenComponent, data: {scheduleViewMode: routerData.overview }},
      { path: 'assignment', component: RoomAssignmentScreenComponent, data: {scheduleViewMode: routerData.assignment} },
      { path: 'timeline', component: RoomTimelineScreenComponent, data: {scheduleViewMode: routerData.timeline}},
      { path: 'recurring', component: ChangeSchedulesComponent, data: {scheduleViewMode: routerData.recurring} }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EffectsModule.run(SchedulingService),
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
    MdCheckboxModule,
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
    ViewControlsViewComponent,
    ChangeSchedulesComponent,
    ChangeSchedulesViewComponent,
    OverviewScreenComponent,
    RoomAssignmentScreenComponent,
    RoomTimelineScreenComponent
  ],
  providers: [
    ViewControlsService,
    SchedulingService,
    ScheduleServerApiService
  ]
})
export class ScheduleModule { }
