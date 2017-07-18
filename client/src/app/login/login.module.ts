import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MdCardModule, MdButtonModule, MdInputModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LoginScreenComponent } from './login-screen/login-screen.component';

const routes: Routes = [
  { path: '', component: LoginScreenComponent }
];

@NgModule({
  imports: [
    CommonModule,
    MdCardModule,
    MdButtonModule,
    MdInputModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginScreenComponent]
})
export class LoginModule { }
