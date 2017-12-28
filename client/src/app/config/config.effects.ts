import {Injectable} from "@angular/core";
import {Effect, Actions} from "@ngrx/effects";
import * as ConfigActions from './config.actions';
import '../../rxjs-imports';
import {ConfigState} from "./config.state";
import {Observable} from "rxjs/Observable";

/**
 * ConfigEffects
 */
@Injectable()
export class ConfigEffects {

  @Effect() _onConfigChanged = this.actions$.ofType(ConfigActions.CONFIG_CHANGED)
    .map((action: ConfigActions.ConfigChangedAction) => action.payload)
    .switchMap((payload: ConfigState) => this.onConfigChanged(payload));

  constructor(
    private actions$: Actions,
  ) {}


  private onConfigChanged(config: ConfigState) {
    return Observable.of(config);
  }
}