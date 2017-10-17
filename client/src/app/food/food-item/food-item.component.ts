import {MealFoodItem, FoodItem} from '../food.interfaces';
import {FoodItemUtils} from '../model/food-item-utils';
import {FoodStateService} from '../services/food-state.service';
import {EventEmitter} from '@angular/core';
import {Output} from '@angular/core';
import {Input} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormBuilder} from '@angular/forms';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'cw-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css']
})
export class FoodItemComponent implements OnInit {

  @Input() mealFoodItem: MealFoodItem;
  @Output() deleted: EventEmitter<string> = new EventEmitter<string>();
  @Output() changed: EventEmitter<MealFoodItem> = new EventEmitter<MealFoodItem>();
  @Output() selectedItem: EventEmitter<FoodItem> = new EventEmitter<FoodItem>();


  FoodItems: any[] = [];
  foodItemForm: FormGroup;
  favorite = false;

  constructor(
    private formBuilder: FormBuilder,
    private state: FoodStateService,
  ) {}

  ngOnInit() {

    if (!this.mealFoodItem) {
      this.state.foodItems$.subscribe(foodItems => this.FoodItems = foodItems);
    }

    this.foodItemForm = this.formBuilder.group({
      foodItem: [this.mealFoodItem ? this.mealFoodItem.foodItem : undefined, Validators.required],
      description: [undefined],
      quantity: [this.mealFoodItem ? this.mealFoodItem.quantity.toString() : undefined, Validators.required],
      unit: [this.mealFoodItem ? (this.mealFoodItem.unit || this.mealFoodItem.foodItem.servingUom) : undefined, Validators.required]
    });

    // when the mealFoodItem changes
    this.foodItemForm.valueChanges.debounceTime(1000).subscribe(() => {
      if (this.foodItemForm.valid) {
        this.changed.emit(this.extractMealFoodItem());
      }
    });

  }

  extractMealFoodItem(): MealFoodItem {
    const mealFoodItem: MealFoodItem = Object.assign({}, this.mealFoodItem);

    mealFoodItem.foodItem = this.foodItemForm.get('foodItem').value;
    mealFoodItem.quantity = this.foodItemForm.get('quantity').value;
    mealFoodItem.unit = this.foodItemForm.get('unit').value;

    return mealFoodItem;
  }

  deleteFoodItem() {
    this.deleted.emit(this.mealFoodItem.id);
  }

  selectItem(foodItem: FoodItem) {
    this.selectedItem.emit(foodItem);
    this.foodItemForm.reset();
  }


  noUnitMatch(): boolean {
    const foodItem = this.foodItemForm.get('foodItem').value;

    return foodItem && foodItem.servingUom !== this.foodItemForm.get('unit').value;
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
}
