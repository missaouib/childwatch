import {FoodItem} from '../model/food-item';
import {FoodStateService} from '../services/food-state.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cw-food-item-editor',
  templateUrl: './food-item-editor.component.html',
  styleUrls: ['./food-item-editor.component.css']
})
export class FoodItemEditorComponent implements OnInit {

  FoodItems: FoodItem[] = [];

  _opened = true;

  constructor(
    private state: FoodStateService
  ) {}

  ngOnInit() {
    this.state.foodItems$.subscribe(items => this.FoodItems = items);
  }

}
