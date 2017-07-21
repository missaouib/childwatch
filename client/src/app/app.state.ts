import { ActionReducer, Action, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core';
import { storeFreeze } from 'ngrx-store-freeze';
import { storeLogger } from 'ngrx-store-logger';

import { environment } from '../environments/environment';
import { schedulingReducer, SchedulingState } from './schedule/scheduling.state';
import { familyReducer, FamilyState } from './family/family.state';
import { mealReducer, MealState } from './meals/meal.state';
import { User } from './security/interfaces';

export interface AppState {
  // Used to track the state associated with the scheduling screen
  // Not related to event/messaging scheduling
  scheduling: SchedulingState;
  // Used on the family data screen
  family: FamilyState;
  // Current time is combined into many displays across the application
  // rather than synchronously polling for it, we can consume it as an observable in the stroe
  currentTime: number;
  loggedInUser?: User;
  meal: MealState;
}

// Allow subreducers to initialize their own state
export const INITIAL_APP_STATE: AppState = {
  scheduling: undefined,
  family: undefined,
  currentTime: Date.now(),
  meal: undefined
};

export const SET_CURRENT_TIME = 'SET_CURRENT_TIME';
export function setCurrentTime(time: number): Action {
  return { type: SET_CURRENT_TIME, payload: time };
}

export const LOGGED_IN_USER_DATA_ARRIVED = 'LOGGED_IN_USER_DATA_ARRIVED';
export function loggedInUserDataArrived(data: User): Action {
  return { type: LOGGED_IN_USER_DATA_ARRIVED, payload: data };
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
  scheduling: schedulingReducer,
  family: familyReducer,
  currentTime,
  loggedInUser,
  meal: mealReducer
});
const developmentReducer = compose(storeLogger({ filter: { blacklist: ['SET_CURRENT_TIME'] } }), storeFreeze)(productionReducer);

export function appReducer(previousAppState: AppState = INITIAL_APP_STATE, action: Action): ActionReducer<AppState> {
  if (environment.production) {
    return productionReducer(previousAppState, action);
  } else {
    return developmentReducer(previousAppState, action);
  }
}

