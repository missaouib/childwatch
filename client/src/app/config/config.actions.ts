import {Action} from '@ngrx/store';
import {ActionCreatorFactory} from '../utils/actioncreatorfactory';
import {Injectable} from '@angular/core';


export interface ConfigState {
  supportedAges: string[];
};

export var INITIAL_ConfigState: ConfigState = {
  supportedAges: ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT']
};

@Injectable()
export class ConfigActions {


  static SUPPORTED_AGEGROUP = "CONFIG:SUPPORTED_AGEGROUP";


  supportedAgeGroup = ActionCreatorFactory.create<{ageGroup: string, supported: boolean}>(ConfigActions.SUPPORTED_AGEGROUP);


  static reducer(state: ConfigState = INITIAL_ConfigState, action: Action): ConfigState {
    switch (action.type) {
      case ConfigActions.SUPPORTED_AGEGROUP:
        return ConfigActions.setSupportedAgeGroup(state, action);
    }
    return state;
  }

  static setSupportedAgeGroup(state: ConfigState, action: Action) {

    var {ageGroup, supported} = action.payload;

    var supportedAges = state.supportedAges.filter(ag => ag !== ageGroup);
    if (supported) supportedAges.push(ageGroup);

    return {
      ...state,
      supportedAges: supportedAges
    }
  }
}