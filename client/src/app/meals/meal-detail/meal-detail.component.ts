
import { AppState } from '../../app.state';
import { Meal, FoodComponent, MealFoodItem, FoodItem } from '../meal.interfaces';
import { MealStateService } from '../services/meal-state.service';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MealActions } from '../meal.actions';
import { TypeaheadMatch } from 'ngx-bootstrap';

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
    this.state.foodComponents$.subscribe( (fc: FoodComponent[]) => this.foodComponents = fc );

    this.state.selectedMeal$.subscribe( (sm: Meal) => {
      this.meal = sm;
      this.mealFoodItems = (sm !== undefined) ? sm.mealFoodItems : [];
     });
  }

  addFoodComponent( component: FoodComponent ) {
    this.store.dispatch( this.actions.addFoodComponentToSelectedMeal( component ) );
  }

  removeMealFoodItem( item: MealFoodItem ){
    this.store.dispatch( this.actions.removeMealFoodItemFromSelectedMeal(item) );
  }

  food( component: FoodComponent ): FoodItem[] {
    const comp = this.foodComponents.find( (fc) => fc.id === component.id );
    return comp ? comp.foodItems : [];
  }

  selectedItem(e: TypeaheadMatch, item: FoodItem) {
    console.log( e.value );
    console.log( 'selected for ' + item.id );
  }

}
