import { Component, OnInit } from '@angular/core';


// Metadata

export interface ChildRouteInfo {
  path: string;
  title: string;
}

export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    children?: ChildRouteInfo[];
}

// Menu Items
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', type: 'link', icontype: 'ti-dashboard'},
  { path: '/family', title: 'Family Info', type: 'link', icontype: 'cw-icon icon-family'},
  { path: '/schedule', title: 'Scheduling', type: 'link', icontype: 'cw-icon icon-schedule'},
  { path: '/meals', title: 'Meals', type: 'sub', icontype: 'cw-icon icon-dinner',
    children: [
      { path: 'meal', title: 'Meal Planning' },
      { path: 'menu',  title: 'Menu Planning' }
    ]}, 
  { path: '/billing', title: 'Billing', type: 'link', icontype: 'cw-icon icon-money' },
  { path: '/admin', title: 'Administration', type: 'sub', icontype: 'cw-icon icon-dinner',
    children: [
      { path: 'food-items', title: 'Food Items' }
  ]}
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    isCollapsed = false;
  
    isNotMobileMenu() {
        return true;
    }

    ngOnInit() {
        this.menuItems = ROUTES;
    }
}
