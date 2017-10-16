import {AppState} from '../app.state';
import {ConfigActions} from './config.actions';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

@Injectable()
export class ConfigService {

  constructor(
    private store: Store<AppState>,
    private actions: ConfigActions
  ) {}



  public get AGEGROUPS$() {
    return this.store.select(s => s.config.supportedAges);
  }

  public supportAgeGroup(ageGroup: string, support: boolean) {
    this.store.dispatch(this.actions.supportedAgeGroup({ageGroup: ageGroup, supported: support}));
  }
}
