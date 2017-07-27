
import { Meal, FoodComponent, MealFoodItem } from '../meal.interfaces';
import { MealStateService } from '../services/meal-state.service';
import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs/Observable';


import 'rxjs/add/observable/of';


@Component({
  selector: 'cw-meal-detail',
  templateUrl: './meal-detail.component.html',
  styleUrls: ['./meal-detail.component.css']
})
export class MealDetailComponent implements OnInit {
    foodComponents: FoodComponent[];
    meal: Meal;
    mealFoodItems: MealFoodItem[];

 constructor(private state: MealStateService  ) {}

  ngOnInit() {
    this.state.foodComponents$.subscribe( fc => this.foodComponents = fc );
    
    this.state.selectedMeal$.subscribe( sm => {
      console.log( 'Subscribed to selectedMeal' );
      this.meal = sm;
      this.mealFoodItems = (sm !== undefined) ? sm.mealFoodItems : [];
      console.log( 'mealFoodItems has ' + (this.mealFoodItems ? this.mealFoodItems.length : 0 ) + ' items' );
     });
    console.log( 'ngInit');
    console.log( this.foodComponents );
  }

}
