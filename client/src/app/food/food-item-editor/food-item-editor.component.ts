import {FoodItem} from '../food.interfaces';
import {FoodItemUtils} from '../model/food-item-utils';
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

  category(item: FoodItem): string {
    return FoodItemUtils.category(item);
  }

  isInfant(item: FoodItem): boolean {
    return FoodItemUtils.isInfant(item);
  }

  isCN(item: FoodItem): boolean {
    return FoodItemUtils.isCN(item);
  }

  tagstring(item: FoodItem): string {
    return FoodItemUtils.tagstring(item);
  }

  agetagstring(item: FoodItem): string {
    return FoodItemUtils.agetagstring(item);
  }


}
