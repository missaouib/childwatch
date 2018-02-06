import {UserService} from '../../user/user.service';
import {User} from '../../user/config.state';
import {Component, OnInit, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {UserIdleService} from 'angular-user-idle';

@Component({
  selector: 'basic-layout',
  templateUrl: './page-layout.component.html',
})
export class PageLayoutComponent implements OnInit {
  _opened = true;
  user: User;


  count: number;
  timesUp: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private userSvc: UserService,
    private userIdle: UserIdleService
  ) {
    this.userSvc.user$.subscribe(user => {
      this.user = user;
      if (this.user.authorities.includes('ADMIN-CW')) this._opened = true;
      this.setTheme();
    });

    this.userIdle.startWatching();

    this.userIdle.onTimerStart().subscribe(count => {this.count = count; this.timesUp = true;});

    this.userIdle.onTimeout().subscribe(() => window.location.href = 'http://www.childwatch.com');

    //this.setTheme();
  }

  ngOnInit() {}

  toggleSidebar() {
    this._opened = !this._opened;;
  }

  setTheme() {
    var theme = this.user && this.user.theme ? this.user.theme : 'readable';
    console.log(`theme = ${theme}`);
    if (!theme) theme = 'readable';

    var href = `./assets/bootswatch/${theme}/bootstrap.min.css`;

    this.document.getElementById('theme').setAttribute('href', href);
  }

  stopAndReset() {
    this.timesUp = false;
    this.userIdle.stopTimer();
    this.userIdle.resetTimer();
  }

}
