import { Food } from '../meal.interfaces';
import { FoodService } from '../services/food.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cw-meals-screen',
  templateUrl: './meals-screen.component.html',
  styleUrls: ['./meals-screen.component.css']
})
export class MealsScreenComponent implements OnInit {

   foods$: Observable<Food[]>;

  constructor(private foodSvc: FoodService ) { }

  ngOnInit() {
    this.foods$ = this.foodSvc.queryStaticData().map( (data: any) => data.foods );
  }

}
