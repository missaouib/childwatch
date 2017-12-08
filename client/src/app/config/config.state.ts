import * as ConfigActions from './config.actions';

export interface Style {
  dark: boolean;
  primary: string;
  secondary: string;
  theme: string;
}

export interface User {
  id: string;
  fullName: string;
  isAdmin: boolean;
  avatar: string;
  username: string;
  authorities: string[];
  deleteBy?: Date;
  tenant: Tenant;
}

export interface Tenant {
  id: string;
  name: string;
  active: boolean;
}


export interface ConfigState {
  general: {
    supportedAges: string[];
    supportedMealTypes: string[];
    style: Style;
  },
  user: User;
  food: {
    showWeekends: boolean
  }
};

export var INITIAL: ConfigState = {
  general: {
    supportedAges: ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1YR', 'AGE_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT'],
    supportedMealTypes: ['BREAKFAST', 'LUNCH', 'AM_SNACK', 'PM_SNACK', 'SUPPER', 'EV_SNACK'],
    style: {
      dark: false,
      primary: '#F8F5F0', // rgba(0, 0, 0, 0.85)',
      secondary: '#FFB300', // '#01579B',
      theme: 'readable'
    },
  },
  user: undefined,
  food: {
    showWeekends: false
  }
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
}

function setUserLogin(state: ConfigState, action: ConfigActions.UserLoginAction) {

  var user: User = Object.assign({}, action.payload);

  //TODO: set deleteBy

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
