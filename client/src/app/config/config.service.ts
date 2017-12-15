import {AppState} from '../app.state';
import * as ConfigActions from './config.actions';
import {ConfigState} from './config.state';
import {Injectable} from '@angular/core';
//import { Http } from '@angular/http';
import {Store} from '@ngrx/store';

@Injectable()
export class ConfigService {

  constructor(
    private store: Store<AppState>,
    //private http: Http
  ) {}



  public get AGEGROUPS$() {
    return this.store.select(s => s.config.general.supportedAges);
  }

  public get style$() {
    return this.store.select(s => s.config.general.style);
  }

  public supportAgeGroup(ageGroup: string, support: boolean) {
    this.store.dispatch(new ConfigActions.SupportedAgeGroupAction({ageGroup: ageGroup, supported: support}));
  }

  public get user$() {
    return this.store.select(s => s.config.user);
  }

  public get config$() {
    return this.store.select(s => s.config)
  }

  public updateConfig(config: ConfigState) {
    this.store.dispatch(new ConfigActions.ConfigChangedAction(config));
  }

  public query() {
  }

  public update() {

  }
}
