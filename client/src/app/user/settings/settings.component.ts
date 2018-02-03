import {UserService} from '../user.service';
import {ConfigState, INITIAL} from '../config.state';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'cw-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  DEFAULT_PASSWORD = '--**password**--';

  theme: string = undefined;
  themes: string[] = ['cerulean', 'cosmo', 'cyborg', 'carkly', 'clatly', 'journal', 'lumen', 'paper', 'readable', 'sandstone', 'simplex', 'slate', 'spacelab', 'superhero', 'united', 'yeti'];

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
    private userSvc: UserService,
    private formBuilder: FormBuilder
  ) {
    this.userSvc.config$.subscribe(config => this.config = config);
    this.settingsForm = this.formBuilder.group({
      displayName: [this.config.user.fullName, Validators.required],
      username: [this.config.user.username, Validators.required],
      password: [this.DEFAULT_PASSWORD],
      confirmPassword: [null],
      showWeekends: [this.config.user.weekendsShowing, Validators.required],
      dark: [this.config.user.dark],
      theme: [this.config.user.theme]
    });

    this.settingsForm.controls['password'].valueChanges.subscribe(() => {if (this.settingsForm.controls['password'].value !== this.DEFAULT_PASSWORD) {console.log('password changed'); this.showConfirmPassword = true;} });

    this.settingsForm.valueChanges.subscribe(() => {this.updateConfig(); this.settingsForm.markAsPristine()});
  }

  ngOnInit() {}

  updateConfig(avatar?: string) {
    if (avatar || !this.settingsForm.pristine && this.passwordConfirmed()) {
      console.log('Updating config', this.settingsForm.value);

      const formValues = this.settingsForm.value;

      let newConfig: ConfigState = {
        ...this.config,
        user: {
          ...this.config.user,
          username: formValues.username,
          fullName: formValues.displayName,
          weekendsShowing: formValues.showWeekends,
          avatar: avatar ? avatar : this.config.user.avatar
        },
      }

      this.userSvc.updateConfig(newConfig);
      this.settingsForm.markAsPristine();
    }
  }

  updateFormValues() {
    if (this.settingsForm)
      this.settingsForm.setValue({
        displayName: this.config.user.fullName,
        username: this.config.user.username,
        password: this.DEFAULT_PASSWORD,
        confirmPassword: null,
        showWeekends: this.config.user.weekendsShowing,
        dark: this.config.user.dark,
        theme: this.config.user.theme
      });
  }

  passwordConfirmed() {
    return !this.showConfirmPassword || this.settingsForm.controls['confirmPassword'] !== null && this.settingsForm.controls['password'].value === this.settingsForm.controls['confirmPassword'].value;
  }

}
