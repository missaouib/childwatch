import {Component} from '@angular/core';
import {Router, Routes} from '@angular/router';


@Component({
  selector: 'cw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  menuItems: Routes;
  constructor(
    router: Router
  ) {
    this.menuItems = router.config as Routes;
  }
}
