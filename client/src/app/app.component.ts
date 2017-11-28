import {ConfigService} from './config/config.service';
import {Component} from '@angular/core';
import {Router, Routes} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';


@Component({
  selector: 'cw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cw works!';
  menuItems: Routes;
  constructor(
    router: Router,
    configSvc: ConfigService,
    cookieSvc: CookieService
  ) {
    const routes = router.config as Routes;
    this.menuItems = routes; //.filter(route => route.navLink);


    //const exceptionAgesStr = cookieSvc.get('CW_AGEEXCEPTION');

    const cookies: any = cookieSvc.getAll();

    console.log("Found the following cookies", cookies);

    //if (exceptionAgesStr) exceptionAgesStr.split(',').forEach(age => configSvc.supportAgeGroup(age, false));


  }
}
