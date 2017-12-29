import {Injectable} from "@angular/core";
import {Effect, Actions} from "@ngrx/effects";
import * as UserActions from './user.actions';
import '../rxjs-imports';
import {UserService} from "./user.service";
import {ConfigState} from "./config.state";

/**
 * ConfigEffects
 */
@Injectable()
export class UserEffects {

  @Effect({dispatch: false}) _onConfigChanged = this.actions$.ofType(UserActions.CONFIG_CHANGED)
    .map((action: UserActions.ConfigChangedAction) => action.payload)
    .do((payload: ConfigState) => this.onConfigChanged(payload));

  constructor(
    private actions$: Actions,
    private userSvc: UserService
  ) {}


  private onConfigChanged(config: ConfigState) {
    this.userSvc.update(config.user).subscribe();
  }
}