import { Meal, MealEvent } from '../food.interfaces';
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
  
  
  tabs: {
    AGE_0_5MO: any,
    AGE_6_11MO: any,
    AGE_1_2YR: any,
    AGE_3_5YR: any,
    AGE_6_12YR: any,
    AGE_13_18YR: any,
    AGE_ADULT: any
    [key: string ]: any
  } = { 
    AGE_0_5MO: { title: '0 - 5 MO', active: true },
    AGE_6_11MO: { title: '6 - 11 MO', active: false },
    AGE_1_2YR: { title: '1 - 2 YR', active: false },
    AGE_3_5YR: { title: '3 - 5 YR', active: false },
    AGE_6_12YR: { title: '6 - 12 YR', active: false },
    AGE_13_18YR: { title: '13 - 18 YR', active: false },
    AGE_ADULT: { title: 'ADULT', active: false }
  };
  
  constructor( 
    private state: FoodStateService, 
    private route: ActivatedRoute ) {  }

  ngOnInit() {
    this.route.params.subscribe( (params) => {
        const id = params['id'];
        this.targetDate = moment(id).toDate();
        this.state.menus$.subscribe( 
          (m: MealEvent[]) => m.filter( (mealEvent: MealEvent) => moment(mealEvent.startDate).isSame( this.targetDate, 'day' ) )
                .forEach( (mealEvent: MealEvent) => this.meals[mealEvent.meal.type] = mealEvent.meal ));
    });
    
    
  } 

}
