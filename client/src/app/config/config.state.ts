import * as ConfigActions from './config.actions';

export interface ConfigState {
  supportedAges: string[];
};

export var INITIAL: ConfigState = {
  supportedAges: ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1YR', 'AGE_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT']
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
