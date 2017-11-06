import {ConfigService} from '../../config/config.service';
import {Style, User} from '../../config/config.state';
import {Component, OnInit, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';

@Component({
  selector: 'basic-layout',
  templateUrl: './page-layout.component.html',
})
export class PageLayoutComponent implements OnInit {
  _opened = true;
  style: Style;

  user: User;



  constructor(
    @Inject(DOCUMENT) private document: any,
    private configSvc: ConfigService
  ) {
    this.configSvc.style$.subscribe(style => this.style = style);
    this.configSvc.user$.subscribe(user => this.user = user);

    this.setTheme();
  }

  ngOnInit() {}

  toggleSidebar(state: boolean) {
    this._opened = state;
  }

  setTheme() {
    this.document.getElementById('theme').setAttribute('href', './assets/bootswatch/' + this.style.theme + '/bootstrap.min.css');
  }

}
