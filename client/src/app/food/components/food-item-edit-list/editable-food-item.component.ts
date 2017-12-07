import {FoodItem} from '../../model/food-item';
import {FoodItemUtils} from '../../model/food-item-utils';
import {Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'cw-editable-food-item',
  templateUrl: './editable-food-item.component.html',
  styleUrls: ['./editable-food-item.component.css']
})
export class EditableFoodItemComponent implements OnInit {

  _foodItem: FoodItem;
  tags: string[] = [];
  editable = false;
  foodItemForm: FormGroup;

  FoodItemUtils: FoodItemUtils;
  @Input()
  set foodItem(foodItem: FoodItem) {
    this._foodItem = foodItem;
    this.tags = foodItem ? foodItem.tags.map((tag) => tag.value).filter(tag => !tag.startsWith('AGE_')) : [];
    if (foodItem) {
      this.foodItemForm.setValue({
        description: foodItem.description,
        shortDescription: foodItem.shortDescription,
        purchaseUom: foodItem.purchaseUom,
        servingUom: foodItem.servingUom
      });
    }
  }

  get foodItem(): FoodItem {return this._foodItem;}

  constructor(private formBuilder: FormBuilder) {
    this.FoodItemUtils = new FoodItemUtils();
    /*var ageGroup = this.formBuilder.group({
      AGE_0_5MO: [this.foodItem ? this.FoodItemUtils.isAppropriateForAgeGroup(this.foodItem, 'AGE_0_5MO') : false],
      AGE_6_11MO: [this.foodItem ? this.FoodItemUtils.isAppropriateForAgeGroup(this.foodItem, 'AGE_6_11MO') : false],
      AGE_1YR: [this.foodItem ? this.FoodItemUtils.isAppropriateForAgeGroup(this.foodItem, 'AGE_1YR') : false],
      AGE_2YR: [this.foodItem ? this.FoodItemUtils.isAppropriateForAgeGroup(this.foodItem, 'AGE_2YR') : false],
      AGE_3_5YR: [this.foodItem ? this.FoodItemUtils.isAppropriateForAgeGroup(this.foodItem, 'AGE_3_5YR') : false],
      AGE_6_12YR: [this.foodItem ? this.FoodItemUtils.isAppropriateForAgeGroup(this.foodItem, 'AGE_6_12YR') : false],
      AGE_13_18YR: [this.foodItem ? this.FoodItemUtils.isAppropriateForAgeGroup(this.foodItem, 'AGE_13_18YR') : false],
      AGE_ADULT: [this.foodItem ? this.FoodItemUtils.isAppropriateForAgeGroup(this.foodItem, 'AGE_ADULT') : false],
    });
     */
    this.foodItemForm = this.formBuilder.group({
      description: [this.foodItem ? this.foodItem.description : undefined, Validators.required],
      shortDescription: [this.foodItem ? this.foodItem.shortDescription : undefined, Validators.required],
      purchaseUom: [this.foodItem ? this.foodItem.purchaseUom : undefined, Validators.required],
      servingUom: [this.foodItem ? this.foodItem.servingUom : undefined, Validators.required],
    });
    //this.foodItemForm.addControl('age', ageGroup);
  }

  ngOnInit() {
  }

}
