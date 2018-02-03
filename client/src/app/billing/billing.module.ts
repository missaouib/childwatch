import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BillingScreenComponent } from './billing-screen/billing-screen.component';

const routes: Routes = [
  { path: '', component: BillingScreenComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BillingScreenComponent]
})
export class BillingModule { }
