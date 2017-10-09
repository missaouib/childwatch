import {ViewEncapsulation} from '@angular/core';
import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/platform-browser';

@Component({
  selector: 'basic-layout',
  templateUrl: './basic-layout.component.html',
  styles: [`
.logo {
  padding: 10px 10px 0 10px;
}

.name {
  font-size: 20px;
  padding-top: 15px;
  font-family: 'Pangolin', cursive;
}

  .sm-img {
  min-height: 30px;
  height: 30px;
  min-width: 30px;
  width: 30px;    
  }
`],
  encapsulation: ViewEncapsulation.None
})
export class BasicLayoutComponent implements OnInit {


  currentTheme = 'paper';

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {}

  navToCalendar() {
    this.router.navigate(['/meals']);
  }

  setTheme(theme: string) {
    this.currentTheme = theme;
    this.document.getElementById('theme').setAttribute('href', './assets/css/bootswatch/' + this.currentTheme + '/bootstrap.css');
  }
}
