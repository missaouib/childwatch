import {ConfigService} from '../config.service';
import {ConfigState, INITIAL} from '../config.state';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cw-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  config: ConfigState = INITIAL;

  activeSlideIdx = 0;
  constructor(
    private configSvc: ConfigService
  ) {
    this.configSvc.config$.subscribe(config => this.config = config);
  }

  ngOnInit() {}

  selectAvatar(avatar: string) {
    this.configSvc.updateConfig({
      ...this.config,
      user: {
        ...this.config.user,
        avatar: avatar
      }
    });
  }
}
