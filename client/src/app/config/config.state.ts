import * as ConfigActions from './config.actions';

export interface Style {
  dark: boolean;
  primary: string;
  secondary: string;
  theme: string;
}

export interface User {
  fullName: string;
  isAdmin: boolean;
  avatar: string;
}


export interface ConfigState {
  supportedAges: string[];
  style: Style;
  user: User;
};

export var INITIAL: ConfigState = {
  supportedAges: ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1YR', 'AGE_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT'],
  style: {
    dark: false,
    primary: '#F8F5F0', // rgba(0, 0, 0, 0.85)',
    secondary: '#FFB300', // '#01579B',
    theme: 'readable'
  },
  user: {
    fullName: 'Admin User',
    isAdmin: true,
    avatar: 'boy.svg'
  }
};

export function reducer(state: ConfigState = INITIAL, action: ConfigActions.ACTIONS): ConfigState {
  switch (action.type) {
    case ConfigActions.SUPPORTED_AGEGROUP:
      return setSupportedAgeGroup(state, action as ConfigActions.SupportedAgeGroupAction);
  }
  return state;
}

function setSupportedAgeGroup(state: ConfigState, action: ConfigActions.SupportedAgeGroupAction) {

  var {ageGroup, supported} = action.payload;

  var supportedAges = state.supportedAges.filter(ag => ag !== ageGroup);
  if (supported) supportedAges.push(ageGroup);

  return {
    ...state,
    supportedAges: supportedAges
  }
}
