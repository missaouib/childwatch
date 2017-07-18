import { Component, OnInit } from '@angular/core';

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
}

// Menu Items
export const ROUTES: RouteInfo[] = [
  { path: '/family', title: 'Family Info', type: 'link', icontype: 'cw-icon icon-family'},
  { path: '/schedule', title: 'Scheduling', type: 'link', icontype: 'cw-icon icon-schedule'},
  { path: '/meals', title: 'Meal Planning', type: 'link', icontype: 'cw-icon icon-dinner' },
  { path: '/billing', title: 'Billing', type: 'link', icontype: 'cw-icon icon-money' }
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    isNotMobileMenu() {
        return true;
    }

    ngOnInit() {
        this.menuItems = ROUTES;
    }
}
