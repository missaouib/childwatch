import {Component, OnInit} from '@angular/core';

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

export interface Style {
  dark: boolean;
  primary: string;
  secondary: string;
  theme: string;
}

export interface User {
  fullName: string;
  isAdmin: boolean;
  avatar: string;
}

@Component({
  selector: 'cw-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


  style: Style = {
    dark: true,
    primary: '#F8F5F0', // rgba(0, 0, 0, 0.85)',
    secondary: '#FFB300', // '#01579B',
    theme: 'paper'
  };

  user: User = {
    fullName: 'Admin User',
    isAdmin: true,
    avatar: 'boy.svg'
  };

  ROUTES: RouteInfo[] = [
    {path: '/dashboard', title: 'Dashboard', type: 'link', icon: 'fa fa-2x fa-dashboard', disabled: true},
    {
      path: '/meals', title: 'Meals', type: 'sub', icon: 'fa fa-2x fa-cutlery',
      children: [
        {path: '', title: 'Meal Calendar'},
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
