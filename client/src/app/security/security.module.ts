import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { AuthenticationService } from './authentication.service';

@NgModule({
  imports: [EffectsModule.run(AuthenticationService)],
  providers: [AuthenticationService]
})
export class SecurityModule { }
