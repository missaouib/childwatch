import {ActionReducer, Action, combineReducers} from '@ngrx/store';
import {compose} from '@ngrx/core';
import {storeFreeze} from 'ngrx-store-freeze';
import {storeLogger} from 'ngrx-store-logger';

import {environment} from '../environments/environment';
import * as FoodState from './food/food.state';
import * as ConfigState from './config/config.state';

export interface AppState {
  // Current time is combined into many displays across the application
  // rather than synchronously polling for it, we can consume it as an observable in the stroe
  currentTime: number;
  food: FoodState.FoodState;
  config: ConfigState.ConfigState;
}

// Allow subreducers to initialize their own state
const INITIAL: AppState = {
  currentTime: Date.now(),
  food: FoodState.INITIAL,
  config: ConfigState.INITIAL
};

export const SET_CURRENT_TIME = 'SET_CURRENT_TIME';
export function setCurrentTime(time: number): Action {
  return {type: SET_CURRENT_TIME, payload: time};
}


export function currentTime(state: number = Date.now(), action: Action): number {
  switch (action.type) {
    case SET_CURRENT_TIME:
      return action.payload;
  }
  return state;
}


/*
  The following is used to setup the store based on environment and create a reducer for
  providing.
*/
const productionReducer = compose(combineReducers)({
  currentTime,
  food: FoodState.reducer,
  config: ConfigState.reducer
});
const developmentReducer = compose(storeLogger({filter: {blacklist: ['SET_CURRENT_TIME']}}), storeFreeze)(productionReducer);

export function appReducer(previousAppState: AppState = INITIAL, action: Action): ActionReducer<AppState> {
  if (environment.production) {
    return productionReducer(previousAppState, action);
  } else {
    return developmentReducer(previousAppState, action);
  }
}

