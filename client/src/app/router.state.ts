import { routerActions, RouterState } from '@ngrx/router-store';
import { Action } from '@ngrx/store';

export interface AppRouterState extends RouterState {
  routeListMetadata: any[];
}

export const ROUTE_CHANGED = 'ROUTE_CHANGED';
export function routeChanged(payload: any[]) {
  return {
    type: ROUTE_CHANGED,
    payload
  };
}

// Replaces the built in ngrx/router-store reducer
// We needed this reducer to capture more than just the URL and the built in
// reducer was just throwing all of the old data away.
export function appRouterReducer(prevRouterState: AppRouterState, action: Action): AppRouterState {
  let newState: AppRouterState;
  if (prevRouterState === void 0) {
    newState = {
      path: '',
      routeListMetadata: []
    };
    return newState;
  } else {
    switch (action.type) {
      case routerActions.UPDATE_LOCATION:
        return { ...prevRouterState, path: action.payload };
      case ROUTE_CHANGED:
        return { ...prevRouterState, routeListMetadata: action.payload };
      default:
        return prevRouterState;
    }
  }
}
