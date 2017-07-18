import { Action } from '@ngrx/store';

import { DateType, ViewMode, makeEvent } from '../interfaces';

export interface ViewControl {
  live: boolean;
  reviewingDateTime?: DateType;
  mode: ViewMode;
}

const initialViewControl: ViewControl = {
  live: true,
  mode: 'SITE_OVERVIEW'
};

const events = {
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
    default:
      return state;
  }
};
