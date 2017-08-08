import { Meal } from '../meal.interfaces';
import { MealStateService } from '../services/meal-state.service';
import { trigger, transition, style, animate} from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cw-meal-card',
  templateUrl: './meal-card.component.html',
  styleUrls: ['./meal-card.component.css'],
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
export class MealCardComponent implements OnInit {

  @Input() scheduleDate: Date;
  @Output() showHideDetails = new EventEmitter();
  detailsShowing: boolean = false;
  
  breakfast: Meal = { description: 'Breakfast #1',
      type: 'BREAKFAST',
      mealFoodItems: [
        {
          amount: 8,
          units: 'oz',
          foodItem: {
            description: 'Milk, skim',
            foodComponent: { id: '1', description: 'Dairy & Egg Products' }
          }
        },
        {
          amount: 1,
          units: 'slice',
          foodItem: {
            description: 'Toast, whole wheat',
            foodComponent: { id: '1', description: 'Bread' }
          }
        },
        {
          amount: 2,
          units: 'slices',
          foodItem: {
            description: 'Bacon, low fat',
            foodComponent: { id: '1', description: 'Bread' }
          }
        }
      ]
    };
   
 amSnack: Meal = { description: 'Snack #3',
      type: 'AM_SNACK',
      mealFoodItems: [
        {
          amount: 16,
          units: 'oz',
          foodItem: {
            description: 'Juice, fruit',
            foodComponent: { id: '1', description: 'Dairy & Egg Products' }
          }
        },
        {
          amount: 1,
          units: 'each',
          foodItem: {
            description: 'Pear, bartlett or other',
            foodComponent: { id: '1', description: 'Dairy & Egg Products' }
          }
        }
      ]
    };
  
  lunch: Meal = undefined;
  
  pmSnack: Meal = { description: 'Snack #1',
      type: 'PM_SNACK',
      mealFoodItems: [
        {
          amount: 8,
          units: 'oz',
          foodItem: {
            description: 'Milk, skim',
            foodComponent: { id: '1', description: 'Dairy & Egg Products' }
          }
        },
        {
          amount: 6,
          units: 'oz',
          foodItem: {
            description: 'Nuts, assorted',
            foodComponent: { id: '1', description: 'Dairy & Egg Products' }
          }
        }
      ]
    };

  constructor( private state: MealStateService ) {  }

  ngOnInit() {
      this.state.menus$.subscribe( m => {
      const breakfastMenu = m? m.find( (menu) => menu.startDate === this.scheduleDate && menu.meal.type === 'BREAKFAST' ) : undefined;
      const amSnackMenu = m? m.find( (menu) => menu.startDate === this.scheduleDate && menu.meal.type === 'AM_SNACK' ) : undefined;
      this.breakfast = breakfastMenu ? breakfastMenu.meal : undefined;
      this.amSnack = amSnackMenu ? amSnackMenu.meal : undefined;
    });
  }
  
  toggleDetailsShowing() {
    this.detailsShowing = !this.detailsShowing;
    this.showHideDetails.emit( this.detailsShowing );
  }

}
