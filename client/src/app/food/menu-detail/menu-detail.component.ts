import { Meal } from '../food.interfaces';
import { FoodStateService } from '../services/food-state.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'cw-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.css']
})
export class MenuDetailComponent implements OnInit {

  targetDate: Date = undefined;
  meals: {
    BREAKFAST: Meal,
    AM_SNACK: Meal,
    LUNCH: Meal,
    PM_SNACK: Meal,
    DINNER: Meal,
    [key: string ]: Meal    
  } = { BREAKFAST: undefined, AM_SNACK: undefined, LUNCH: undefined, PM_SNACK: undefined, DINNER: undefined };  id: string = undefined;
  
  show: {
    BREAKFAST: boolean,
    AM_SNACK: boolean,
    LUNCH: boolean,
    PM_SNACK: boolean,
    DINNER: boolean
  } = { BREAKFAST: false, AM_SNACK: false, LUNCH: false, PM_SNACK: false, DINNER: false };
  
  constructor( 
    private state: FoodStateService, 
    private route: ActivatedRoute ) {  }

  ngOnInit() {
    this.route.params.subscribe( (params) => {
        const id = params['id'];
        this.targetDate = moment(id).toDate();
        this.state.menus$.subscribe( 
          m => m.filter( (menu) => moment(menu.startDate).isSame( this.targetDate, 'day' ) )
                .forEach( (menu) => this.meals[menu.meal.type] = menu.meal ));
    });
  }

}
