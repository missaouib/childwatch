import {Style, User} from '../../config/config.state';
import {Component, OnInit, Input} from '@angular/core';

export interface ChildRouteInfo {
  path: string;
  title: string;
  restrict?: boolean;
  disabled?: boolean;
}

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icon: string;
  restrict?: boolean;
  disabled?: boolean;
  children?: ChildRouteInfo[];
}


@Component({
  selector: 'cw-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


  @Input() style: Style;
  @Input() user: User;


  ROUTES: RouteInfo[] = [
    {path: '/dashboard', title: 'Dashboard', type: 'link', icon: 'fa fa-2x fa-dashboard', disabled: true},
    {
      path: '/meals', title: 'Meals', type: 'sub', icon: 'fa fa-2x fa-cutlery',
      children: [
        {path: '', title: 'Planning Calendar'},
        {path: 'mpr', title: 'Meal Production Record', disabled: false},
        {path: 'meal-builder', title: 'Meal Builder', disabled: true}
      ]
    },
    {path: '/billing', title: 'Billing', type: 'link', icon: 'fa fa-2x fa-money', disabled: true},
    {
      path: '/admin', title: 'Administration', type: 'sub', icon: 'fa fa-2x fa-cogs', disabled: true, restrict: true,
      children: [
        {path: 'food-items', title: 'Food Items'}
      ]
    }
  ];

  constructor() {}

  ngOnInit() {}

}
