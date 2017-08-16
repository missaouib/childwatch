import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdSidenavModule, MdToolbarModule, MdListModule, MaterialModule, MdNativeDateModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appReducer } from './app.state';
import { ChildDetailComponent } from './child/child-detail/child-detail.component';
import { TimeService } from './time.service';
import { SecurityModule } from './security/security.module';

import './rxjs-imports.ts';

import { SidebarModule } from './sidebar/sidebar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { RoomDetailsComponent } from './rooms/room-details/room-details.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    RoomDetailsComponent,
    ChildDetailComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    SecurityModule,
    AppRoutingModule,
    StoreModule.provideStore(appReducer),
    EffectsModule.run(TimeService),
    BrowserAnimationsModule,
    FlexLayoutModule,
    MdSidenavModule,
    MdToolbarModule,
    MdListModule,
    MaterialModule,
    MdNativeDateModule,
    NavbarModule,
    FooterModule,
    FixedPluginModule,
    SidebarModule,
    CollapseModule.forRoot()
  ],
  providers: [TimeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
