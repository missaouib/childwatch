import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';


import * as AppRouting from './app.routes';
import {AppComponent} from './app.component';
import {appReducer} from './app.state';
import {ChildDetailComponent} from './child/child-detail/child-detail.component';
import {ConfigService} from './config/config.service';
import {SecurityModule} from './security/security.module';

import './rxjs-imports.ts';

import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';

import {CollapseModule} from 'ngx-bootstrap/collapse';
import {RoomDetailsComponent} from './rooms/room-details/room-details.component';

import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {ToastOptions} from 'ng2-toastr';
import {PageLayoutComponent} from './layouts/page-layout/page-layout.component';

import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

import {NavbarComponent} from './layouts/navbar/navbar.component';
import {SidebarComponent} from './layouts/sidebar/sidebar.component';
import {RouterModule} from '@angular/router';
import {SidebarModule} from 'ng-sidebar';
import {CookieService} from 'ngx-cookie-service';
import {SettingsComponent} from './config/settings/settings.component';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import {AccordionModule} from 'ngx-bootstrap/accordion';


export class CustomOption extends ToastOptions {
  animate = 'fade';
  newestOnTop = false;
  showCloseButton = true;
  toastLife = 5000;
  positionClass = 'toast-bottom-right';
};

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    RoomDetailsComponent,
    ChildDetailComponent,
    PageLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    SecurityModule,
    RouterModule.forRoot(AppRouting.AppRoutes, {enableTracing: true}),
    StoreModule.provideStore(appReducer),
    BrowserAnimationsModule,
    SidebarModule.forRoot(),
    CollapseModule.forRoot(),
    ToastModule.forRoot(),
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    AccordionModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [{provide: ToastOptions, useClass: CustomOption}, ConfigService, CookieService]
})
export class AppModule {}
