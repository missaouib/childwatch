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


export interface PreauthToken {
  accountID: string;
  userID: string;
  adminUser: boolean;
  ageGroups: string[];
  mealTypes: string[];
  theme: string;
  accountName: string;
  userName: string;
  showWeekends: boolean;
};


@Injectable()
export class UserService implements CanActivate {

  authUser: User = undefined;

  bootswatchThemes = ['cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly', 'journal', 'lumen', 'paper', 'readable', 'sandstone', 'simplex', 'slate', 'spacelab', 'superhero', 'united', 'yeti'];

  backUrl = undefined;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private router: Router,
    private cookieSvc: CookieService
  ) {
    this.store.select(s => s.config.user).subscribe((user: User) => {this.authUser = user; console.log(`Setting authorized user to ${(user) ? user.id : '???'}`);});
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


  hasUser(redirect: boolean) {
    if (!this.authUser) {
      (redirect) ?
        window.location.href = 'http://www.childwatch.com' :
        this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  decode(encoded: string): string {
    return (encoded && encoded.length > 0) ? decodeURIComponent(encoded).replace(/\s/g, '').toUpperCase() : undefined;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    var adminUserStr = this.decode(this.cookieSvc.get('adminUser'));
    var ageGroupsStr = this.decode(this.cookieSvc.get('ageGroups'));
    var mealTypesStr = this.decode(this.cookieSvc.get('mealTypes'));
    var showWeekendsStr = this.decode(this.cookieSvc.get('showWeekends'));

    let preAuth: PreauthToken = {
      accountID: this.cookieSvc.get('accountID') || null,
      userID: this.cookieSvc.get('userID') || null,
      adminUser: adminUserStr && adminUserStr.toLowerCase() === 'false' ? false : true,
      ageGroups: ageGroupsStr ? ageGroupsStr.split(',') : null,
      mealTypes: mealTypesStr ? mealTypesStr.split(',') : null,
      theme: this.cookieSvc.get('theme') ? this.cookieSvc.get('theme').toLowerCase() : null,
      accountName: this.cookieSvc.get('accountName') || null,
      userName: this.cookieSvc.get('userName') || null,
      showWeekends: showWeekendsStr && showWeekendsStr.toLowerCase() === 'true' ? true : false
    }

    this.backUrl = this.cookieSvc.get('cwSessionUrl');

    var redirect = route.queryParams['login'] == undefined;

    console.log(`preAuthorization attempt accountId = ${preAuth.accountID}; userId = ${preAuth.userID}; accountName = ${preAuth.accountName}; userName: ${preAuth.userName} `);

    if (preAuth.theme && !this.bootswatchThemes.includes(preAuth.theme)) preAuth.theme = 'readable';

    this.cookieSvc.delete('accountID');

    return this.authUser ? true :
      ((preAuth.accountID) ? this.preauth(preAuth) : this.hasUser(redirect));
  }

  /**
   * Build the preauthorization request
   * 
   * @param tenant
   * @param user
   * 
   * @returns {Observable<boolean>}
   */
  preauth(preauthToken: PreauthToken): Observable<boolean> {

    if (!preauthToken || !preauthToken.accountID) return Observable.of(false);

    let params = {
      'preauth': btoa(`${preauthToken.accountID}:${preauthToken.userID}:${preauthToken.adminUser}:${preauthToken.ageGroups}:${preauthToken.mealTypes}:${preauthToken.theme}:${preauthToken.accountName}:${preauthToken.userName}:${preauthToken.showWeekends}:${Date.now()}`)
    };

    return this.http.get<User>('/user', {params: params})
      .map((user: User) => {
        user.tenant.ageGroups = this.buildAgeGroups(user);
        user.tenant.mealTypes = this.buildMealTypes(user);
        this.store.dispatch(new UserLoginAction(user));
      }).map(() => true)
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
        return user;
      });
  }

  logout() {
    this.store.dispatch(new UserLogoutAction());
  }
}
