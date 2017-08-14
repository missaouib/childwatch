import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdSidenavModule, MdToolbarModule, MdListModule, MaterialModule, MdNativeDateModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ApolloModule } from 'apollo-angular';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appReducer } from './app.state';
import { ChildDetailComponent } from './child/child-detail/child-detail.component';
import { TimeService } from './time.service';
import { SecurityModule } from './security/security.module';

import './rxjs-imports.ts';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserInfoViewComponent } from './user-info/user-info-view.component';

import { SidebarModule } from './sidebar/sidebar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { RoomDetailsComponent } from './rooms/room-details/room-details.component';


export function apolloClientProvider() {
  return new ApolloClient({
    networkInterface: createNetworkInterface({
      uri: '/graphql',
      opts: {
        credentials: 'same-origin'
      }
    })
  });
}

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    UserInfoComponent,
    UserInfoViewComponent,
    RoomDetailsComponent,
    ChildDetailComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    SecurityModule,
    AppRoutingModule,
    ApolloModule.forRoot(apolloClientProvider),
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
  providers: [TimeService, { provide: XSRFStrategy, useValue: new CookieXSRFStrategy('myCookieName', 'My-Header-Name')}],
  bootstrap: [AppComponent]
})
export class AppModule { }
