import {Injectable} from '@angular/core/';
import {Store} from '@ngrx/store';

import {AppState} from '../app.state';
import {UserLogoutAction, UserLoginAction} from '../config/config.actions';
import {User} from '../config/config.state';
import {Http, URLSearchParams} from '@angular/http';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CookieService} from 'ngx-cookie-service';


@Injectable()
export class AuthenticationService implements CanActivate {

  authUser: User = undefined;

  constructor(
    private store: Store<AppState>,
    private http: Http,
    private router: Router,
    private cookieSvc: CookieService
  ) {
    this.store.select(s => s.config.user).subscribe((user: User) => this.authUser = user);
  }


  hasUser() {
    if (!this.authUser) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (route.queryParams.tenant) {
      return this.preauth(route.queryParams.tenant);
    }
    else if (this.cookieSvc.get('childwatch-tenant')) {
      return this.preauth(this.cookieSvc.get('childwatch-tenant'));
    }
    else
      return this.hasUser();
  }

  preauth(tenant: string): Observable<boolean> {

    if (!tenant) return Observable.of(false);

    const params = new URLSearchParams();

    params.append('tenant', btoa(`${tenant}:${Date.now()}`));

    console.log(`preauth => tenant = ${tenant}:${Date.now()}`);

    return this.http.get('/user', {search: params})
      .map(res => res.json())
      .map((user: User) => this.store.dispatch(new UserLoginAction(user)))
      .map(() => true)
      .catch(() => Observable.of(false));
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
