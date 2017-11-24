import {Injectable} from '@angular/core/';
import {Store} from '@ngrx/store';

import {AppState} from '../app.state';
import {UserLogoutAction, UserLoginAction} from '../config/config.actions';
import {User} from '../config/config.state';
import {Http, URLSearchParams} from '@angular/http';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthenticationService implements CanActivate {

  authUser: User = undefined;

  constructor(
    private store: Store<AppState>,
    private http: Http,
    private router: Router
  ) {
    this.store.select(s => s.config.user).subscribe((user: User) => this.authUser = user);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log(route.queryParams.tenant);
    if (!this.authUser) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  preauth(tenant: string) {
    const params = new URLSearchParams();

    params.append('tenant', tenant);

    console.log(`preauth => tenant = ${tenant}`);

    return this.http.get('/user', {search: params})
      .map(res => res.json())
      .map((user: User) => this.store.dispatch(new UserLoginAction(user)));
  }


  login(username: string, password: string) {
    const params = new URLSearchParams();

    params.append('token', btoa(`${username}:${password}:${Date.now()}`));

    console.log(`login => token = ${username}:${password}:${Date.now()}`);

    return this.http.get('/user', {search: params})
      .map(res => res.json())
      .map((user: User) => this.store.dispatch(new UserLoginAction(user)));
  }

  logout() {
    this.store.dispatch(new UserLogoutAction());
  }
}
