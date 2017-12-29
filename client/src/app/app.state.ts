import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {storeFreeze} from 'ngrx-store-freeze';
import {storeLogger} from 'ngrx-store-logger';

import {environment} from '../environments/environment';
import * as FoodState from './food/store/food.state';
import * as ConfigState from './user/config.state';

export interface AppState {
  food: FoodState.FoodState;
  config: ConfigState.ConfigState;
}

// Allow subreducers to initialize their own state
export const INITIAL_AppState: AppState = {
  food: FoodState.INITIAL,
  config: ConfigState.INITIAL
};



export const reducers: ActionReducerMap<AppState> = {
  food: FoodState.reducer,
  config: ConfigState.reducer
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeLogger(), storeFreeze] : [];

