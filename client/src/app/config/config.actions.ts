import {User} from './config.state';
import {Action} from '@ngrx/store';

export const SUPPORTED_AGEGROUP: string = "[CONFIG] SUPPORTED AGEGROUP";
export const USER_LOGIN: string = '[CONFIG] USER LOGIN';
export const USER_LOGOUT: string = '[CONFIG] USER LOGOUT';


export class SupportedAgeGroupAction implements Action {
  readonly type = SUPPORTED_AGEGROUP;
  constructor(public payload: {ageGroup: string, supported: boolean}) {}
}

export class UserLoginAction implements Action {
  readonly type = USER_LOGIN;
  constructor(public payload: User) {}
}

export class UserLogoutAction implements Action {
  readonly type = USER_LOGOUT;
  constructor() {}
}


export type ACTIONS = SupportedAgeGroupAction | UserLoginAction | UserLogoutAction;