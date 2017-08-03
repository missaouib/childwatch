import { Meal } from '../meal.interfaces';
import { MealStateService } from '../services/meal-state.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cw-meals-screen',
  templateUrl: './meals-screen.component.html',
  styleUrls: ['./meals-screen.component.css']
})
export class MealsScreenComponent implements OnInit {

  Meals: Meal[];
  selectedMeal: Meal;

  constructor(private state: MealStateService) {
    this.state.meals$.subscribe( ms => this.Meals = ms );
    this.state.selectedMeal$.subscribe( sm => this.selectedMeal = sm );
  }

  selectMeal( meal: Meal ) {
    this.state.selectedMeal$ = Observable.of( meal );
  }

  addMenuItem( menuItem: { type: string } ) {
    this.state.addMenuItem( menuItem );
  }
  
  ngOnInit() {}

}
