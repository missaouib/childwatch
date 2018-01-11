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
      this._opened = user && user.authorities.find(authority => authority.toUpperCase() === 'ADMIN-CW') !== undefined;
    });

    this.setTheme();
  }

  ngOnInit() {}

  toggleSidebar() {
    this._opened = !this._opened;;
  }

  setTheme() {
    this.document.getElementById('theme').setAttribute('href', './assets/bootswatch/' + this.user.theme + '/bootstrap.min.css');
  }

}
