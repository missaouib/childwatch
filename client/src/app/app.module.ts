import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';


import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {appReducer} from './app.state';
import {ChildDetailComponent} from './child/child-detail/child-detail.component';
import {ConfigService} from './config/config.service';
import {SecurityModule} from './security/security.module';

import './rxjs-imports.ts';

import {SidebarModule} from './sidebar/sidebar.module';
import {FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';
import {FooterModule} from './shared/footer/footer.module';
import {NavbarModule} from './shared/navbar/navbar.module';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';

import {CollapseModule} from 'ngx-bootstrap/collapse';
import {RoomDetailsComponent} from './rooms/room-details/room-details.component';

import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {ToastOptions} from 'ng2-toastr';
import {CustomOption} from './shared/toast-custom-options';
import {BasicLayoutComponent} from './layouts/basic-layout/basic-layout.component';

import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

import {CookieService} from 'ngx-cookie-service';



@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    RoomDetailsComponent,
    ChildDetailComponent,
    BasicLayoutComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    SecurityModule,
    AppRoutingModule,
    StoreModule.provideStore(appReducer),
    BrowserAnimationsModule,
    NavbarModule,
    FooterModule,
    FixedPluginModule,
    SidebarModule,
    CollapseModule.forRoot(),
    ToastModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [{provide: ToastOptions, useClass: CustomOption}, ConfigService, CookieService]
})
export class AppModule {}
