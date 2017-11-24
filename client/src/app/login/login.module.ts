import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {LoginScreenComponent} from './login-screen/login-screen.component';

const routes: Routes = [
  {path: '', component: LoginScreenComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  declarations: [LoginScreenComponent]
})
export class LoginModule {}
