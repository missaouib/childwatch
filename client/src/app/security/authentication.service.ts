import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core/';
import { Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';

import { loggedInUserDataArrived, AppState } from '../app.state';
import { User } from './interfaces';

const myselfQuery = gql`
  query myself {
    myself {
      username
      authorities
    }
  }
`;

const MYSELF_RETRY_DELAY_MS = 2000;
const MYSELF_POLLING_INTERVAL_MS = 60 * 1000;

@Injectable()
export class AuthenticationService {
  @Effect()
  // tslint:disable-next-line:no-unused-variable
  public loadMyself$ = this.loadMyself()
    .map(loggedInUserDataArrived);

  constructor(
    private apollo: Apollo,
    private store: Store<AppState>
  ) {
  }

  private loadMyself() {
    return this.apollo.watchQuery({
      query: myselfQuery,
      pollInterval: MYSELF_POLLING_INTERVAL_MS
    })
      .map(result => (<any>result.data).myself)
      .retryWhen(errors => errors.delay(MYSELF_RETRY_DELAY_MS));
  }

  get loggedInUser$(): Observable<User> {
    return this.store.select(s => s.loggedInUser);
  }
}
