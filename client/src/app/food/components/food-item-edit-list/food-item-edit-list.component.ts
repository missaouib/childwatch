import {FoodItem} from '../../model/food-item';
import {FoodItemService} from '../../services/food-item.service';
import {FoodStateService} from '../../services/food-state.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cw-food-item-edit-list',
  templateUrl: './food-item-edit-list.component.html',
  styleUrls: ['./food-item-edit-list.component.css']
})
export class FoodItemEditListComponent implements OnInit {

  foodItems: FoodItem[] = [];
  selected: FoodItem = undefined;

  constructor(
    private foodItemSvc: FoodItemService,
    private foodState: FoodStateService,
  ) {
    this.foodState.foodItems$.subscribe((foodItems) => this.foodItems = foodItems);
    this.foodItemSvc.query(FoodItemService.FULL).subscribe();

  }

  ngOnInit() {

  }
}
