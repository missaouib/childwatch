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
  { path: '/meals', title: 'Meals', type: 'sub', icontype: 'cw-icon icon-dinner',
    children: [
      { path: 'menu-overview',  title: 'Menu Planning' },
      { path: 'menu-calendar',  title: 'Menu Calendar' },
      { path: 'meal-builder', title: 'Meal Builder' }
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
