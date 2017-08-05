import { Meal } from '../meal.interfaces';
import { MealStateService } from '../services/meal-state.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cw-menu-screen',
  templateUrl: './menu-screen.component.html',
  styleUrls: ['./menu-screen.component.css']
})
export class MenuScreenComponent implements OnInit {
    Meals: Meal[];

  constructor(private state: MealStateService) {
    this.state.meals$.subscribe( ms => this.Meals = ms );
   }

  ngOnInit() {
  }

}
