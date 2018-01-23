import {FoodItem} from '../../model/food-item';
import {FoodItemUtils} from '../../model/food-item-utils';
import {MealFoodItem} from '../../model/meal-food-item';
import {FoodStateService} from '../../services/food-state.service';
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
  @Output() errors: EventEmitter<{id: string, errors: boolean}> = new EventEmitter<{id: string, errors: boolean}>();

  FoodItemUtils: FoodItemUtils;
  FoodItems: FoodItem[] = [];
  foodItemForm: FormGroup;

  /**
   * Constructor for the FoodItemComponent
   * @constructor
   */
  constructor(
    private formBuilder: FormBuilder,
    private FoodStateSvc: FoodStateService) {
    this.FoodItemUtils = new FoodItemUtils();
  }

  /**
   * Initializer for the component
   * 
   * @onInit
   */
  ngOnInit() {
    if (!this.mealFoodItem) {
      this.FoodStateSvc.foodItems$.subscribe(foodItems => this.FoodItems = foodItems);
    }

    this.foodItemForm = this.formBuilder.group({
      foodItem: [this.mealFoodItem ? this.mealFoodItem.foodItem : undefined, Validators.required],
      description: [undefined],
      quantity: [this.mealFoodItem ? this.mealFoodItem.quantity.toString() : undefined, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]],
      unit: [this.mealFoodItem ? (this.mealFoodItem.unit || this.mealFoodItem.foodItem.servingUom) : undefined, Validators.required]
    });

    // when the mealFoodItem changes
    this.foodItemForm.valueChanges.debounceTime(1000).subscribe(() => {
      if (this.foodItemForm.valid) {
        this.changed.emit(this.extractMealFoodItem());
      }
      this.errors.emit({id: this.mealFoodItem.id, errors: !this.foodItemForm.valid});
    });

  }

  /**
   * Extract a meal foodItem from the form 
   * 
   * @returns {MealFoodItem}
   */
  extractMealFoodItem(): MealFoodItem {
    const mealFoodItem: MealFoodItem = Object.assign({}, this.mealFoodItem);

    mealFoodItem.foodItem = this.foodItemForm.get('foodItem').value;
    mealFoodItem.quantity = this.foodItemForm.get('quantity').value;
    mealFoodItem.unit = this.foodItemForm.get('unit').value;

    return mealFoodItem;
  }

  /**
   * Callback for deleting a food item
   */
  deleteFoodItem() {
    this.deleted.emit(this.mealFoodItem.id);
  }

  /**
   * Callback for selecting a food item
   */
  selectItem(foodItem: FoodItem) {
    this.selectedItem.emit(foodItem);
    this.foodItemForm.reset();
  }

  /**
   * Determine if the fooditem in the form matches the expected unit value
   * 
   * @returns {boolean}
   */
  noUnitMatch(): boolean {
    const foodItem = this.foodItemForm.get('foodItem').value;

    return foodItem && foodItem.servingUom !== this.foodItemForm.get('unit').value;
  }

}
