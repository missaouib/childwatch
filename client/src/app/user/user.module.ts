import {NgModule} from '@angular/core';
import {UserService} from './user.service';
import {LoginScreenComponent} from "./login-screen/login-screen.component";
import {UserEffects} from "./user.effects";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {EffectsModule} from "@ngrx/effects";
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {path: 'login', component: LoginScreenComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    EffectsModule.forFeature([UserEffects]),
  ],
  declarations: [LoginScreenComponent, UserListComponent],
  providers: [UserService]
})
export class UserModule {}
