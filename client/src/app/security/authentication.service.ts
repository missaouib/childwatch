import { Injectable } from '@angular/core/';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../app.state';
import { User } from './interfaces';


@Injectable()
export class AuthenticationService {
  constructor(
    private store: Store<AppState>
  ) {
  }
  get loggedInUser$(): Observable<User> {
    return this.store.select(s => s.loggedInUser);
  }
}
