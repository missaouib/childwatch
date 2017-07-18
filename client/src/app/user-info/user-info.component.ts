import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { AuthenticationService } from '../security/authentication.service';

@Component({
  selector: 'cw-user-info',
  templateUrl: './user-info.component.html'
})
export class UserInfoComponent {
  loggedInUser$: Observable<any>;

  constructor(authenticationService: AuthenticationService) {
    this.loggedInUser$ = authenticationService.loggedInUser$;
  }
}
