import {ActionReducer, Action, combineReducers} from '@ngrx/store';
import {compose} from '@ngrx/core';
import {storeFreeze} from 'ngrx-store-freeze';
import {storeLogger} from 'ngrx-store-logger';

import {environment} from '../environments/environment';
import {ConfigState, INITIAL_ConfigState, ConfigActions} from './config/config.actions';
import {FoodUIState, INITIAL_FoodUIState} from './food/food.interfaces';
import {FoodActions} from './food/food.actions';
import {User} from './security/interfaces';

export interface AppState {
  // Current time is combined into many displays across the application
  // rather than synchronously polling for it, we can consume it as an observable in the stroe
  currentTime: number;
  loggedInUser?: User;
  food: FoodUIState;
  config: ConfigState;
}

// Allow subreducers to initialize their own state
export const INITIAL_APP_STATE: AppState = {
  currentTime: Date.now(),
  food: INITIAL_FoodUIState,
  config: INITIAL_ConfigState
};

export const SET_CURRENT_TIME = 'SET_CURRENT_TIME';
export function setCurrentTime(time: number): Action {
  return {type: SET_CURRENT_TIME, payload: time};
}

export const LOGGED_IN_USER_DATA_ARRIVED = 'LOGGED_IN_USER_DATA_ARRIVED';
export function loggedInUserDataArrived(data: User): Action {
  return {type: LOGGED_IN_USER_DATA_ARRIVED, payload: data};
}

export function currentTime(state: number = Date.now(), action: Action): number {
  switch (action.type) {
    case SET_CURRENT_TIME:
      return action.payload;
  }
  return state;
}

function loggedInUser(state: User = undefined, action: Action): User {
  switch (action.type) {
    case LOGGED_IN_USER_DATA_ARRIVED:
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
  loggedInUser,
  food: FoodActions.reducer,
  config: ConfigActions.reducer
});
const developmentReducer = compose(storeLogger({filter: {blacklist: ['SET_CURRENT_TIME']}}), storeFreeze)(productionReducer);

export function appReducer(previousAppState: AppState = INITIAL_APP_STATE, action: Action): ActionReducer<AppState> {
  if (environment.production) {
    return productionReducer(previousAppState, action);
  } else {
    return developmentReducer(previousAppState, action);
  }
}

