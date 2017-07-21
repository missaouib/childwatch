
import { FoodComponent } from '../meal.interfaces';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cw-food-item-select',
  templateUrl: './food-item-select.component.html',
  styleUrls: ['./food-item-select.component.css']
})
export class FoodItemSelectComponent implements OnInit {

  @Input() foodComponent: FoodComponent;

  constructor() { }

  ngOnInit() {
  }

}
