import {UserService} from '../../user/user.service';
import {User} from '../../user/config.state';
import {Component, OnInit, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';

@Component({
  selector: 'basic-layout',
  templateUrl: './page-layout.component.html',
})
export class PageLayoutComponent implements OnInit {
  _opened = false;
  user: User;



  constructor(
    @Inject(DOCUMENT) private document: any,
    private userSvc: UserService
  ) {
    this.userSvc.user$.subscribe(user => {
      this.user = user;
      if (this.user.authorities.includes('ADMIN-CW')) this._opened = true;
      this.setTheme();
    });

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

    console.log(`setting href to ${href}`);

    this.document.getElementById('theme').setAttribute('href', href);
  }

}
