import {NgModule} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {LoginScreenComponent} from "./login-screen/login-screen.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path: 'login', component: LoginScreenComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  declarations: [LoginScreenComponent],
  providers: [AuthenticationService]
})
export class SecurityModule {}
