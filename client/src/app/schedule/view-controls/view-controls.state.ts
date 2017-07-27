import { Action } from '@ngrx/store';

import { DateType, ViewMode, makeEvent } from '../interfaces';
import { ROUTE_CHANGED } from '../../router.state';

export interface ViewControl {
  live: boolean;
  reviewingDateTime?: DateType;
  mode: ViewMode;
}

const initialViewControl: ViewControl = {
  live: true,
  mode: 'overview'
};

export const events = {
  liveChanged: 'liveChanged',
  reviewingDateTimeChanged: 'reviewingDateTimeChanged',
  modeChanged: 'modeChanged'
};

export function liveChanged(live: boolean) {
  return makeEvent(Date.now(), events.liveChanged, live);
}

export function reviewingDateTimeChanged(newDateTime: DateType) {
  return makeEvent(Date.now(), events.reviewingDateTimeChanged, newDateTime);
}

export function modeChanged(mode: ViewMode) {
  return makeEvent(Date.now(), events.modeChanged, mode);
}

export function viewControlReducer(state: ViewControl = initialViewControl, action: Action): ViewControl {
  switch (action.type) {
    case events.liveChanged:
      return { ...state, live: action.payload };
    case events.reviewingDateTimeChanged:
      const live = state.reviewingDateTime ? false : true;
      return { ...state, reviewingDateTime: action.payload, live };
    case events.modeChanged:
      return { ...state, mode: action.payload };
    case ROUTE_CHANGED:
      return routeChanged(state, action.payload);
    default:
      return state;
  }
};

// Certain route change events need to sync data to the store
// In this case changing the mode via the URL (as opposed to the controls) needs to set the mode in the state
function routeChanged(state: ViewControl, payload: any[]): ViewControl {
  let newState: ViewControl = state;
  const targetMeta = payload.find(meta => !!meta.scheduleViewMode);
  if (targetMeta) {
    newState = { ...state, mode: targetMeta.scheduleViewMode };
  }

  return newState;
}
