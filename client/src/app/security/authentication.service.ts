import {Injectable} from '@angular/core/';
import {Store} from '@ngrx/store';

import {AppState} from '../app.state';
import {UserLogoutAction, UserLoginAction} from '../config/config.actions';
import {User} from '../config/config.state';
import {HttpClient} from '@angular/common/http';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CookieService} from 'ngx-cookie-service';


@Injectable()
export class AuthenticationService implements CanActivate {

  authUser: User = undefined;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private router: Router,
    private cookieSvc: CookieService
  ) {
    this.store.select(s => s.config.user).subscribe((user: User) => this.authUser = user);
  }


  hasUser() {
    if (!this.authUser) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (route.queryParams.tenant) {
      return this.preauth(route.queryParams.tenant, route.queryParams.user);
    }
    else if (this.cookieSvc.get('childwatch-tenant')) {
      return this.preauth(this.cookieSvc.get('childwatch-tenant'), this.cookieSvc.get('childwatch-user'));
    }
    else
      return this.hasUser();
  }

  preauth(tenant: string, user: string): Observable<boolean> {

    if (!tenant) return Observable.of(false);

    let params = {
      'tenant': btoa(`${tenant}:${Date.now()}`)
    };


    if (user) params['user'] = btoa(`${tenant}:${Date.now()}`);

    return this.http.get<User>('/user', {params: params})
      .map((user: User) => this.store.dispatch(new UserLoginAction(user)))
      .map(() => true)
      .catch(() => Observable.of(false));
  }


  login(username: string, password: string) {
    return this.http.get<User>('/user', {
      params: {
        token: btoa(`${username}:${password}:${Date.now()}`)
      }
    })
      .map((user: User) => this.store.dispatch(new UserLoginAction(user)));
  }

  logout() {
    this.store.dispatch(new UserLogoutAction());
  }
}
