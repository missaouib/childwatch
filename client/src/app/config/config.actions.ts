import {Action} from '@ngrx/store';

export const SUPPORTED_AGEGROUP: string = "[CONFIG] SUPPORTED AGEGROUP";


export class SupportedAgeGroupAction implements Action {
  readonly type = SUPPORTED_AGEGROUP;
  constructor(public payload: {ageGroup: string, supported: boolean}) {}
}

export type ACTIONS = SupportedAgeGroupAction;