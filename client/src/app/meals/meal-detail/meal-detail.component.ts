
import { FoodComponent, Meal } from '../meal.interfaces';
import { MealStateService } from '../services/meal-state.service';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup } from '@angular/forms';


import 'rxjs/add/observable/of';


@Component({
  selector: 'cw-meal-detail',
  templateUrl: './meal-detail.component.html',
  styleUrls: ['./meal-detail.component.css']
})
export class MealDetailComponent implements OnInit {
  mealDetail: FormGroup;
  foodComponents$: Observable<FoodComponent[]>;
  foodComponent: FoodComponent = { id: '123456-A', description: 'Milk/Alt', foodItems: [] };

  @Input() meal: Meal;

 constructor(private state: MealStateService  ) {
  this.foodComponents$ = state.foodComponents$;
 }

  ngOnInit() {
    this.mealDetail = new FormGroup( {
      milk: new FormControl('Milk, 16oz (skim)'),
      bread: new FormControl('Bread, whole wheat, 1 slice'),
      meat: new FormControl( 'Bacon, 1 slice' )
    });
  }

  addComponent( category: FoodComponent ) {
    this.state.selectedFoodComponent$ = Observable.of(category);
  }

}
