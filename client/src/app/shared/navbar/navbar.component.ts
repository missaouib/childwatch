import { Component, OnInit, ViewChild } from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar.component';
import { Location } from '@angular/common';


@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private sidebarVisible: boolean;

    @ViewChild("navbar-cmp") button: any;

    constructor(location: Location ) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit(){
        this.listTitles = ROUTES; // .filter(listTitle => listTitle);
    }

    isMobileMenu() {
        return true;
    }


    getTitle(){
       var titlee = this.location.prepareExternalUrl(this.location.path());
        if(titlee.charAt(0) === '#'){
            titlee = titlee.slice( 2 );
        }
        for(var item = 0; item < this.listTitles.length; item++){
            var parent = this.listTitles[item];
            if(parent.path === titlee){
                return parent.title;
            }else if(parent.children){
                var children_from_url = titlee.split("/")[2];
                for(var current = 0; current < parent.children.length; current++){
                    if(parent.children[current].path === children_from_url ){
                        return parent.children[current].title;
                    }
                }
            }
        }
        return 'Dashboard';

    }

    getPath(){
        // console.log(this.location);
        return this.location.prepareExternalUrl(this.location.path());
    }
}
