import {MealFoodItem, FoodItem} from '../food.interfaces';
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

  foodItemForm: FormGroup;
  favorite = false;

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {

    this.foodItemForm = this.formBuilder.group({
      foodItem: [this.mealFoodItem.foodItem, Validators.required],
      quantity: [this.mealFoodItem.quantity.toString(), Validators.required],
      unit: [this.mealFoodItem.foodItem.servingUom, Validators.required]
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
    console.log('Emitting ' + this.mealFoodItem.id);
    this.deleted.emit(this.mealFoodItem.id);
  }

  setFoodItem(foodItem: FoodItem) {
    this.foodItemForm.patchValue({foodItem: foodItem, unit: foodItem.servingUom});
  }

  noUnitMatch(): boolean {
    const foodItem = this.foodItemForm.get('foodItem').value;

    return foodItem && foodItem.servingUom !== this.foodItemForm.get('unit').value;
  }

}
