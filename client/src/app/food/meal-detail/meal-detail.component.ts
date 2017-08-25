
import { FoodItem, FoodComponent, MealFoodItem, Meal } from '../food.interfaces';
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
    foodComponents: any[] = [];    
    @Input() meal: Meal;
    @Input() ageGroup: string;

 constructor(private state: FoodStateService ) {}

  ngOnInit() {
    this.state.foodComponents$.subscribe( (fc: FoodComponent[]) => {
      this.foodComponents = fc.filter( (c: FoodComponent) => c.parentComponent === null )
          .map( (f: FoodComponent) => { return { ...f, children: [] }; } );
      fc.filter( (c) => c.parentComponent !== null )
        .forEach( (c) => this.foodComponents.find( (p) => p.id === c.parentComponent.id ).children.push( c ) );
      
    });
    this.state.foodItems$.subscribe( (fi: FoodItem[]) => this.foodItems = fi );
  }
  
  ageGroupFoodItems() {
    return this.meal.mealFoodItems.filter( (item: MealFoodItem) => item.ageGroup === this.ageGroup );
  }
  
  food( component: FoodComponent ): FoodItem[] {
    return this.foodItems.filter( (fi) => fi.foodComponent.id === component.id );
  }

  selectedItem(e: TypeaheadMatch, item: FoodItem) {
    console.log( e.value );
    console.log( 'selected for ' + item.id );
  }
  
  addFoodItem( component: FoodComponent ) {
    console.log( component );    
    this.state.addMealFoodItem( this.meal, this.ageGroup, component );
  }

  removeFoodItem( foodItem: FoodItem ) {
    const idx = this.meal.mealFoodItems
                    .findIndex( (item: MealFoodItem) => item.foodItem.id === foodItem.id && item.ageGroup === this.ageGroup );
    this.meal.mealFoodItems.splice( idx, 1 );
  }
}
