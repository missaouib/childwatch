
import { Meal, FoodItem, FoodComponent } from '../food.interfaces';
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
    foodComponents: FoodComponent[];
    @Input() meal: Meal;

 constructor(private state: FoodStateService ) {}

  ngOnInit() {
    this.state.foodComponents$.subscribe( (fc: FoodComponent[]) => this.foodComponents = fc );
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
