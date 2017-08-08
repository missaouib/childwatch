import { Menu } from '../meal.interfaces';
//import { MealStateService } from '../services/meal-state.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cw-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.css']
})
export class MenuDetailComponent implements OnInit {

  menu: Menu = undefined;
  id: string = undefined;
  
  constructor( 
    // private state: MealStateService, 
    private route: ActivatedRoute ) {  }

  ngOnInit() {
    this.route.params.subscribe( () => {
        this.id = 'hello';
        //this.state.menus$.subscribe( menus => this.menu = menus ? menus.find( (menu) => menu.id === id ) : undefined );
    });
  }

}
