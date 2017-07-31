
import { AppState } from '../../app.state';
import { Meal, FoodComponent, MealFoodItem, FoodItem } from '../meal.interfaces';
import { MealStateService } from '../services/meal-state.service';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MealActions } from '../mealactions';

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

 constructor(private state: MealStateService, private store: Store<AppState>, private actions: MealActions ) {}

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

  addFoodComponent( component: FoodComponent ) {
    this.store.dispatch( this.actions.addFoodComponentToSelectedMeal( component ) );
  }

  food( component: FoodComponent ): FoodItem[] {
    const comp = this.foodComponents.find( (fc) => fc.id === component.id )
    return comp ? comp.foodItems : [];
  }

}
