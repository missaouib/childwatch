import {User, ConfigState} from './config.state';
import {Action} from '@ngrx/store';

export const SUPPORTED_AGEGROUP: string = "[CONFIG] SUPPORTED AGEGROUP";
export const USER_LOGIN: string = '[CONFIG] USER LOGIN';
export const USER_LOGOUT: string = '[CONFIG] USER LOGOUT';
export const CONFIG_CHANGED: string = '[CONFIG] CONFIG CHANGED'
export const USER_UPDATE: string = '[CONFIG]'


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

export class ConfigChangedAction implements Action {
  readonly type = CONFIG_CHANGED;
  constructor(public payload: ConfigState) {}
}


export type ACTIONS = SupportedAgeGroupAction | UserLoginAction | UserLogoutAction | ConfigChangedAction;