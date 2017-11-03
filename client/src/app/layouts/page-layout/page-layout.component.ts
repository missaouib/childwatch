import {Component, OnInit, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';

@Component({
  selector: 'basic-layout',
  templateUrl: './page-layout.component.html',
})
export class PageLayoutComponent implements OnInit {
  _opened = true;
  theme = 'readable';

  constructor(
    @Inject(DOCUMENT) private document: any
  ) {
    this.setTheme();
  }

  ngOnInit() {}

  toggleSidebar(state: boolean) {
    this._opened = state;
  }

  setTheme() {
    this.document.getElementById('theme').setAttribute('href', './assets/bootswatch/' + this.theme + '/bootstrap.min.css');
  }

}
