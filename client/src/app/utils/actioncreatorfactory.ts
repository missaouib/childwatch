import {Action} from '@ngrx/store';

class ActionCreator<T> implements Action {
  constructor( public type: string = 'NOT_SET', public payload?: T ) {}
}

export class ActionCreatorFactory {
  static create?<T>( type: string ) {
    return (payload?: T) => {
      return new ActionCreator<T>(type, payload );
    };
  }
}
