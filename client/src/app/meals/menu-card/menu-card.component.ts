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
  
  showBreakfast: false;
  showAmSnack: false;
  showLunch: false;
  showPmSnack: false;

  breakfast: Meal = undefined;
  amSnack: Meal = undefined;
  lunch: Meal = undefined;
  pmSnack: Meal = undefined;

  constructor( private state: MealStateService ) {  }

  ngOnInit() {
      this.state.menus$.subscribe( m => {

      const today = m ? m.filter( (menu) => moment(menu.startDate).isSame( this.scheduleDate, 'day' ) ) : [];
      const breakfastMenu = today.find( (menu) => menu.meal.type === 'BREAKFAST' );
      const amSnackMenu = today.find( (menu) => menu.meal.type === 'AM_SNACK' );
      const lunchMenu = today.find( (menu) => menu.meal.type === 'LUNCH' );
      const pmSnackMenu = today.find( (menu) => menu.meal.type === 'PM_SNACK' );

      this.breakfast = breakfastMenu ? breakfastMenu.meal : undefined;
      this.amSnack = amSnackMenu ? amSnackMenu.meal : undefined;
      this.lunch = lunchMenu ? lunchMenu.meal : undefined;
      this.pmSnack = pmSnackMenu ? pmSnackMenu.meal : undefined;
    });
  }

  toggleDetailsShowing() {
    this.detailsShowing = !this.detailsShowing;
    this.showHideDetails.emit( this.detailsShowing );
  }

}
