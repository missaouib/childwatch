import {ConfigService} from '../config.service';
import {ConfigState, INITIAL} from '../config.state';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'cw-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  _config: ConfigState = INITIAL;
  showConfirmPassword = false;

  set config(config: ConfigState) {
    this._config = config;
    this.updateFormValues();
  }

  get config(): ConfigState {return this._config;}

  settingsForm: FormGroup;

  activeSlideIdx = 0;
  constructor(
    private configSvc: ConfigService,
    private formBuilder: FormBuilder
  ) {
    this.configSvc.config$.subscribe(config => this.config = config);
    this.settingsForm = this.formBuilder.group({
      displayName: [this.config.user.fullName, Validators.required],
      username: [this.config.user.username, Validators.required],
      password: ['---password---'],
      confirmPassword: [null],
      showWeekends: [this.config.user.weekendsShowing, Validators.required]
    });
    this.settingsForm.controls['password'].valueChanges.subscribe(() => {console.log('password changed'); this.showConfirmPassword = true;});

    this.settingsForm.valueChanges.subscribe(() => this.updateConfig());
  }

  ngOnInit() {}

  updateConfig() {
    if (this.passwordConfirmed()) {
      console.log('Updating config', this.settingsForm.value);

      const formValues = this.settingsForm.value;

      let newConfig: ConfigState = {
        ...this.config,
        user: {
          ...this.config.user,
          username: formValues.username,
          fullName: formValues.displayName
        },
      }

      this.configSvc.updateConfig(newConfig);

    }
  }

  updateFormValues() {
    if (this.settingsForm)
      this.settingsForm.setValue({
        displayName: this.config.user.fullName,
        username: this.config.user.username,
        password: '---password---',
        confirmPassword: null,
        showWeekends: this.config.user.weekendsShowing
      });
  }

  passwordConfirmed() {
    return !this.showConfirmPassword || this.settingsForm.controls['confirmPassword'] !== null && this.settingsForm.controls['password'].value === this.settingsForm.controls['confirmPassword'].value;
  }

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
