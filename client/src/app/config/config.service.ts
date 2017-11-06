import {AppState} from '../app.state';
import * as ConfigActions from './config.actions';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

@Injectable()
export class ConfigService {

  constructor(
    private store: Store<AppState>
  ) {}



  public get AGEGROUPS$() {
    return this.store.select(s => s.config.supportedAges);
  }

  public get style$() {
    return this.store.select(s => s.config.style);
  }

  public supportAgeGroup(ageGroup: string, support: boolean) {
    this.store.dispatch(new ConfigActions.SupportedAgeGroupAction({ageGroup: ageGroup, supported: support}));
  }

  public get user$() {
    return this.store.select(s => s.config.user);
  }

}
