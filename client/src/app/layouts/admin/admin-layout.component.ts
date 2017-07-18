import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../shared/navbar/navbar.component';


@Component({
    selector: 'app-layout',
    templateUrl: './admin-layout.component.html'
})

export class AdminLayoutComponent implements OnInit {
    location: Location;
    private _router: Subscription;

    @ViewChild('sidebar') sidebar: any;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;
    constructor( private router: Router, location: Location ) {
      this.location = location;
    }

    ngOnInit() {
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe( () => {});

    }
    public isMap() {
        // console.log(this.location.prepareExternalUrl(this.location.path()));
        return ( this.location.prepareExternalUrl(this.location.path()) === '/maps/fullscreen');
    }
}
