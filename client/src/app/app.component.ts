import { Component } from '@angular/core';
import { Router, Routes} from '@angular/router';


@Component({
  selector: 'cw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cw works!';
  menuItems: Routes;
  constructor(router: Router){
    const routes = router.config as Routes;
    this.menuItems = routes; //.filter(route => route.navLink);
  }
}
