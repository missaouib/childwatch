import {User} from '../../user/config.state';
import {Component, OnInit, Input} from '@angular/core';
import {Subject} from "rxjs/Subject";

export interface ChildRouteInfo {
  path: string;
  title: string;
  disabled?: boolean;
  requireRole?: string[];
}

export interface RouteInfo extends ChildRouteInfo {
  type: string;
  icon: string;
  children?: ChildRouteInfo[];
}


@Component({
  selector: 'cw-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  _user: User = undefined;

  @Input() user: User;


  refresh: Subject<any> = new Subject();

  ROUTES: RouteInfo[] = [
    {path: '/dashboard', title: 'Dashboard', type: 'link', icon: 'fa fa-2x fa-dashboard', disabled: true},
    {
      path: '/meals', title: 'Meals', type: 'sub', icon: 'fa fa-2x fa-cutlery',
      children: [
        {path: '', title: 'Planning Calendar'},
        {path: '/meals/mpr', title: 'Meal Production Record', disabled: false, requireRole: ['ADMIN-CW']},
      ]
    },
    {path: '/billing', title: 'Billing', type: 'link', icon: 'fa fa-2x fa-money', disabled: true},
    {
      path: '/admin', title: 'Administration', type: 'sub', icon: 'fa fa-2x fa-cogs', disabled: false, requireRole: ['ADMIN-CW'],
      children: [
        {path: '/meals/food-items', title: 'Food Items'}
      ]
    }
  ];

  constructor() {}

  ngOnInit() {}

  hasRequiredRole(required: string[]): boolean {
    if (!required || required.length === 0) {return true;}
    else return required.find(role => this.user.authorities.find(authority => authority === role) !== undefined) !== undefined;
  }

  canShow(route: ChildRouteInfo): boolean {
    return this.hasRequiredRole(route.requireRole) && !route.disabled;
  }

  isAdminCW(): boolean {
    return this.user && this.user.authorities.find(authority => authority === 'ADMIN-CW') != undefined;
  }

}
