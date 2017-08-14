import { Meal } from '../meal.interfaces';
import { MealStateService } from '../services/meal-state.service';
import { trigger, transition, style, animate} from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'cw-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.css'],
  animations: [
    trigger(
      'changeAnimation', [
        transition('0 => 1', [
          style({transform: 'translateX(-100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0%)', opacity: 1}))
        ])
      ]
    )
  ]
})
export class MenuCardComponent implements OnInit {

  @Input() scheduleDate: Date;
  @Output() showHideDetails = new EventEmitter();
  detailsShowing = false;
  
  show: {
    BREAKFAST: boolean,
    AM_SNACK: boolean,
    LUNCH: boolean,
    PM_SNACK: boolean,
    DINNER: boolean
  } = { BREAKFAST: false, AM_SNACK: false, LUNCH: false, PM_SNACK: false, DINNER: false };
  
  
  meals: {
    BREAKFAST: Meal,
    AM_SNACK: Meal,
    LUNCH: Meal,
    PM_SNACK: Meal,
    DINNER: Meal,
    [key: string ]: Meal    
  } = { BREAKFAST: undefined, AM_SNACK: undefined, LUNCH: undefined, PM_SNACK: undefined, DINNER: undefined };

  constructor( private state: MealStateService ) {  }

  ngOnInit() {
      this.state.menus$.subscribe( 
        m => m.filter( (menu) => moment(menu.startDate).isSame( this.scheduleDate, 'day' ) )
              .forEach( (menu) => this.meals[menu.meal.type] = menu.meal )
    );
  }

  toggleDetailsShowing() {
    this.detailsShowing = !this.detailsShowing;
    this.showHideDetails.emit( this.detailsShowing );
  }

}
