
import { Food } from '../meal.interfaces';
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

  @Input() mealId: string;
  @Input() Foods: Observable<Food[]>;

  ngOnInit() {
    this.mealDetail = new FormGroup( {
      milk: new FormControl('Milk, 16oz (skim)'),
      bread: new FormControl('Bread, whole wheat, 1 slice'),
      meat: new FormControl( 'Bacon, 1 slice' )
    });
  }

}
