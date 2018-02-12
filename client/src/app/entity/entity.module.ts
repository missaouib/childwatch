import {UserService} from '../user/user.service';
import {DashboardComponent} from "../dashboard/components/dashboard/dashboard.component";
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import {TabsModule} from 'ngx-bootstrap/tabs';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';

import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {TooltipModule} from 'ngx-bootstrap/tooltip';

import {CalendarModule} from 'angular-calendar';

import {DndModule} from 'ng2-dnd';

import {EffectsModule} from '@ngrx/effects';

import {AlertModule} from 'ngx-bootstrap/alert';
import {SidebarModule} from 'ng-sidebar';

import {ModalModule} from 'ngx-bootstrap/modal';

import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';

import {CollapseModule} from 'ngx-bootstrap/collapse';
import {TagInputModule} from 'ngx-chips';
import {EntitySearchComponent} from './components/entity-search/entity-search.component';
import {EntityDetailComponent} from './components/entity-detail/entity-detail.component';
import {EntitySearchHeaderComponent} from './components/entity-search/entity-search-header/entity-search-header.component';
import {EntitySearchIndividualListComponent} from './components/entity-search/entity-search-individual-list/entity-search-individual-list.component';
import {EntityService} from "./services/entity.service";
import {EntityDetailHeaderComponent} from './components/entity-detail/entity-detail-header/entity-detail-header.component';
import {EntityDetailSidebarComponent} from './components/entity-detail/entity-detail-sidebar/entity-detail-sidebar.component';
import {EntityComponent} from './components/entity/entity.component';
import {EntityDetailPersonalComponent} from './components/entity-detail/entity-detail-personal/entity-detail-personal.component';
import {EntityDetailCacfpComponent} from './components/entity-detail/entity-detail-cacfp/entity-detail-cacfp.component';
import {EntityDetailHealthComponent} from './components/entity-detail/entity-detail-health/entity-detail-health.component';
import {EntityDetailAuthorizationsComponent} from './components/entity-detail/entity-detail-authorizations/entity-detail-authorizations.component';
import {EntityDetailAttendanceComponent} from './components/entity-detail/entity-detail-attendance/entity-detail-attendance.component';
import {EntityDetailScheduleComponent} from './components/entity-detail/entity-detail-schedule/entity-detail-schedule.component';
import {EntityDetailNotesComponent} from './components/entity-detail/entity-detail-notes/entity-detail-notes.component';


const routes: Routes = [
  {path: '', component: EntitySearchComponent},
  {path: 'detail/:id', component: EntityDetailComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CalendarModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule, FormsModule,
    HttpClientModule,
    AlertModule.forRoot(),
    SidebarModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    DndModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    TagInputModule,
    TimepickerModule.forRoot()
  ],
  declarations: [
    EntitySearchComponent,
    EntityDetailComponent,
    EntitySearchHeaderComponent,
    EntitySearchIndividualListComponent,
    EntityDetailHeaderComponent,
    EntityDetailSidebarComponent,
    EntityComponent,
    EntityDetailPersonalComponent,
    EntityDetailCacfpComponent,
    EntityDetailHealthComponent,
    EntityDetailAuthorizationsComponent,
    EntityDetailAttendanceComponent,
    EntityDetailScheduleComponent,
    EntityDetailNotesComponent,],
  providers: [UserService, EntityService]
})
export class EntityModule {

  constructor() {}
}
