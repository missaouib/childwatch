import * as ConfigActions from './config.actions';


export interface User {
  id: string;
  fullName: string;
  isAdmin: boolean;
  avatar: string;
  username: string;
  authorities: string[];
  weekendsShowing: boolean;
  dark: boolean;
  primary: string;
  secondary: string;
  theme: string;
  tenant: Tenant;
}

export interface Tenant {
  id: string;
  name: string;
  active: boolean;
  ageGroups: string[];
  mealTypes: string[];
}


export interface ConfigState {
  user: User;
};

export var INITIAL: ConfigState = {
  user: undefined,
};

export function reducer(state: ConfigState = INITIAL, action: ConfigActions.ACTIONS): ConfigState {
  switch (action.type) {
    case ConfigActions.SUPPORTED_AGEGROUP:
      return setSupportedAgeGroup(state, action as ConfigActions.SupportedAgeGroupAction);

    case ConfigActions.USER_LOGIN:
      return setUserLogin(state, action as ConfigActions.UserLoginAction);

    case ConfigActions.USER_LOGOUT:
      return setUserLogout(state, action as ConfigActions.UserLoginAction);

    case ConfigActions.CONFIG_CHANGED:
      return setConfigChanged(state, action as ConfigActions.ConfigChangedAction);

  }
  return state;
}

function setSupportedAgeGroup(state: ConfigState, action: ConfigActions.SupportedAgeGroupAction) {

  /*

  var {ageGroup, supported} = action.payload;

  var supportedAges = state.general.supportedAges.filter(ag => ag !== ageGroup);
  if (supported) supportedAges.push(ageGroup);

  return {
    ...state,
    general: {
      ...state.general,
      supportedAges: supportedAges
    }
  }
   */

  return state;
}

function setUserLogin(state: ConfigState, action: ConfigActions.UserLoginAction) {

  var user: User = Object.assign({}, action.payload);

  return {
    ...state,
    user: user
  };
}

function setUserLogout(state: ConfigState, action: ConfigActions.UserLogoutAction) {
  return {
    ...state,
    user: undefined
  };
}

function setConfigChanged(state: ConfigState, action: ConfigActions.ConfigChangedAction) {
  return Object.assign({}, state, action.payload);
}
