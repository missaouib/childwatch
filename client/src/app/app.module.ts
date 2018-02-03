import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';


import * as AppRouting from './app.routes';
import {AppComponent} from './app.component';
import {ChildDetailComponent} from './childcare/components/child-detail/child-detail.component';
import {UserService} from './user/user.service';
import {UserModule} from './user/user.module';

import '../common/rxjs-imports.ts';

import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';

import {CollapseModule} from 'ngx-bootstrap/collapse';
import {RoomDetailsComponent} from './childcare/components/room-details/room-details.component';

import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {ToastOptions} from 'ng2-toastr';
import {PageLayoutComponent} from './layouts/page-layout/page-layout.component';

import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

import {NavbarComponent} from './layouts/navbar/navbar.component';
import {SidebarComponent} from './layouts/sidebar/sidebar.component';
import {RouterModule} from '@angular/router';
import {SidebarModule} from 'ng-sidebar';
import {CookieService} from 'ngx-cookie-service';
import {SettingsComponent} from './user/settings/settings.component';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {EffectsModule} from '@ngrx/effects';
import {FoodEffects} from './cacfp/store/food.effects';

import {reducers, metaReducers} from './app.state';
import {PendingChangesGuard} from "./cacfp/components/meal/pending-changes-guard";
import {FoodItemService} from "./cacfp/services/food-item.service";
import {FoodStateService} from "./cacfp/services/food-state.service";
import {MealEventService} from "./cacfp/services/meal-event.service";
import {MealProductionRecordService} from "./cacfp/services/meal-production-record.service";
import {MealService} from "./cacfp/services/meal.service";
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {UserIdleModule} from 'angular-user-idle';
import {AlertModule} from 'ngx-bootstrap/alert';


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
    HttpClientModule,
    UserModule,
    RouterModule.forRoot(AppRouting.AppRoutes, {enableTracing: true}),
    StoreModule.forRoot(reducers, {metaReducers}),
    BrowserAnimationsModule,
    SidebarModule.forRoot(),
    CollapseModule.forRoot(),
    ToastModule.forRoot(),
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    AccordionModule.forRoot(),
    TypeaheadModule.forRoot(),
    EffectsModule.forRoot([FoodEffects]),
    UserIdleModule.forRoot({idle: 3600, timeout: 120, ping: 120}),
    AlertModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [{provide: ToastOptions, useClass: CustomOption}, UserService, CookieService, FoodItemService, MealService, FoodStateService, MealEventService, PendingChangesGuard, MealProductionRecordService]
})
export class AppModule {}
