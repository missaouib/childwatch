import { Meal } from '../meal.interfaces';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cw-meal-card',
  templateUrl: './meal-card.component.html',
  styleUrls: ['./meal-card.component.css']
})
export class MealCardComponent implements OnInit {

  @Input() scheduleDate: Date;
  
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

  constructor() { }

  ngOnInit() {
  }
  
  toggleDetailsShowing() {
    this.detailsShowing = !this.detailsShowing;
  }

}
