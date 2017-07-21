import { FoodItem } from '../meal.interfaces';
import { MealStateService } from '../services/meal-state.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cw-meals-screen',
  templateUrl: './meals-screen.component.html',
  styleUrls: ['./meals-screen.component.css']
})
export class MealsScreenComponent implements OnInit {

   foodItems$: Observable<FoodItem[]>;

  constructor(private state: MealStateService ) { }

  ngOnInit() {
    this.foodItems$ = this.state.foodItems$; // this.foodSvc.foodItems$;
  }

}
