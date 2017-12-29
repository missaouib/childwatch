import {Injectable} from '@angular/core/';
import {Store} from '@ngrx/store';

import {AppState} from '../app.state';
import {UserLogoutAction, UserLoginAction} from './user.actions';
import {User, ConfigState} from './config.state';
import {HttpClient} from '@angular/common/http';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CookieService} from 'ngx-cookie-service';
import * as ConfigActions from './user.actions';



@Injectable()
export class UserService implements CanActivate {

  authUser: User = undefined;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private router: Router,
    private cookieSvc: CookieService
  ) {
    this.store.select(s => s.config.user).subscribe((user: User) => this.authUser = user);
  }


  public get user$() {
    return this.store.select(s => s.config.user);
  }

  public get config$() {
    return this.store.select(s => s.config)
  }

  public updateConfig(config: ConfigState) {

    var configCpy = {
      ...config,
      user: {
        ...config.user,
        tenant: {
          ...config.user.tenant,
          ageGroups: this.buildAgeGroups(config.user),
          mealTypes: this.buildMealTypes(config.user)
        }
      }
    };

    this.store.dispatch(new ConfigActions.ConfigChangedAction(configCpy));
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

  update(user: User) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.authUser) ? this.authUser.tenant.id : null,
      'X-CHILDWATCH-USER': (this.authUser) ? this.authUser.id : null
    };

    var updated = {
      fullName: user.fullName,
      username: user.username,
      weekendsShowing: user.weekendsShowing
    };

    return this.http.patch('/api/user/' + user.id, updated, {headers: headers});
  }

  buildAgeGroups(user: User): string[] {
    var ageGroups: string[] = [];
    if (user.tenant['supportingAge0_5MO']) ageGroups.push('AGE_0_5MO');
    if (user.tenant['supportingAge6_11MO']) ageGroups.push('AGE_6_11MO');
    if (user.tenant['supportingAge1YR']) ageGroups.push('AGE_1YR');
    if (user.tenant['supportingAge2YR']) ageGroups.push('AGE_2YR');
    if (user.tenant['supportingAge3_5YR']) ageGroups.push('AGE_3_5YR');
    if (user.tenant['supportingAge6_12YR']) ageGroups.push('AGE_6_12YR');
    if (user.tenant['supportingAge13_18YR']) ageGroups.push('AGE_13_18YR');
    if (user.tenant['supportingAgeAdult']) ageGroups.push('AGE_ADULT');
    return ageGroups;
  }

  buildMealTypes(user: User): string[] {
    var mealTypes: string[] = [];
    if (user.tenant['supportingBreakfast']) mealTypes.push('BREAKFAST');
    if (user.tenant['supportingAMSnack']) mealTypes.push('AM_SNACK');
    if (user.tenant['supportingLunch']) mealTypes.push('LUNCH');
    if (user.tenant['supportingPMSnack']) mealTypes.push('PM_SNACK');
    if (user.tenant['supportingSupper']) mealTypes.push('SUPPER');
    if (user.tenant['supportingEVSnack']) mealTypes.push('EV_SNACK');
    return mealTypes;
  }

  login(username: string, password: string) {
    return this.http.get<User>('/user', {
      params: {
        token: btoa(`${username}:${password}:${Date.now()}`)
      }
    })
      .map((user: User) => {
        console.log('Tenant = ', user.tenant);

        user.tenant.ageGroups = this.buildAgeGroups(user);
        user.tenant.mealTypes = this.buildMealTypes(user);
        this.store.dispatch(new UserLoginAction(user));
      });
  }

  logout() {
    this.store.dispatch(new UserLogoutAction());
  }
}
