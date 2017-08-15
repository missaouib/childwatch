
import { Meal, FoodItem, FoodComponent, MealFoodItem } from '../food.interfaces';
import { FoodStateService } from '../services/food-state.service';
import { Component, OnInit, Input } from '@angular/core';
import { TypeaheadMatch } from 'ngx-bootstrap';

// import { Observable } from 'rxjs/Observable';


import 'rxjs/add/observable/of';


@Component({
  selector: 'cw-meal-detail',
  templateUrl: './meal-detail.component.html',
  styleUrls: ['./meal-detail.component.css']
})
export class MealDetailComponent implements OnInit {
    foodItems: FoodItem[];
    foodComponents: FoodComponent[];
    @Input() meal: Meal;
    @Input() ageGroup: string;

 constructor(private state: FoodStateService ) {}

  ngOnInit() {
    this.state.foodComponents$.subscribe( (fc: FoodComponent[]) => this.foodComponents = fc );
    this.state.foodItems$.subscribe( (fi: FoodItem[]) => this.foodItems = fi );
  }
  
  ageGroupFoodItems() {
    return this.meal.mealFoodItems.filter( (item: MealFoodItem) => item.ageGroup === this.ageGroup );
  }

  topLevelComponents(): FoodComponent[] {
    return this.foodComponents.filter( (fc) => fc.parentComponent === null );
  }
  
  childrenFor( component: FoodComponent ) {
    return this.foodComponents.filter( (fc) => fc.parentComponent != null && fc.parentComponent.id === component.id );
  }

  food( component: FoodComponent ): FoodItem[] {
    return this.foodItems.filter( (fi) => fi.foodComponent.id === component.id );
  }

  selectedItem(e: TypeaheadMatch, item: FoodItem) {
    console.log( e.value );
    console.log( 'selected for ' + item.id );
  }

}
