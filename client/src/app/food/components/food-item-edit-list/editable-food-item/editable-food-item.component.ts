import {User} from "../../../../user/config.state";
import {UserService} from "../../../../user/user.service";
import {FoodItem} from '../../../model/food-item';
import {FoodItemUtils} from '../../../model/food-item-utils';
import {FoodItemService} from "../../../services/food-item.service";
import {FoodStateService} from "../../../services/food-state.service";
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
    console.log('setting food item ', foodItem);
    this._foodItem = foodItem;
    this.tags = foodItem ? foodItem.tags.map((tag) => tag.value).filter(tag => tag && !tag.startsWith('AGE_')) : [];
    if (foodItem) {
      this.foodItemForm.setValue({
        description: foodItem.description,
        shortDescription: foodItem.shortDescription,
        purchaseUom: foodItem.purchaseUom,
        servingUom: foodItem.servingUom,
        age05mo: this.FoodItemUtils.isAppropriateForAgeGroup(foodItem, 'AGE_0_5MO'),
        age611mo: this.FoodItemUtils.isAppropriateForAgeGroup(foodItem, 'AGE_6_11MO'),
        age1yr: this.FoodItemUtils.isAppropriateForAgeGroup(foodItem, 'AGE_1YR'),
        age2yr: this.FoodItemUtils.isAppropriateForAgeGroup(foodItem, 'AGE_2YR'),
        age35yr: this.FoodItemUtils.isAppropriateForAgeGroup(foodItem, 'AGE_3_5YR'),
        age612yr: this.FoodItemUtils.isAppropriateForAgeGroup(foodItem, 'AGE_6_12YR'),
        age1318yr: this.FoodItemUtils.isAppropriateForAgeGroup(foodItem, 'AGE_13_18YR'),
        ageAdult: this.FoodItemUtils.isAppropriateForAgeGroup(foodItem, 'AGE_ADULT'),
        tags: foodItem ? foodItem.tags.map((tag) => tag.value).filter(tag => tag && !tag.startsWith('AGE_')) : []
      });
    }
  }

  get foodItem(): FoodItem {return this._foodItem;}

  constructor(
    private formBuilder: FormBuilder,
    userSvc: UserService,
    private foodState: FoodStateService,
    private FoodItemSvc: FoodItemService
  ) {
    this.FoodItemUtils = new FoodItemUtils();
    this.foodItemForm = this.formBuilder.group({
      description: [this.foodItem ? this.foodItem.description : undefined, Validators.required],
      shortDescription: [this.foodItem ? this.foodItem.shortDescription : undefined, Validators.required],
      purchaseUom: [this.foodItem ? this.foodItem.purchaseUom : undefined, Validators.required],
      servingUom: [this.foodItem ? this.foodItem.servingUom : undefined, Validators.required],
      age05mo: [false, Validators.required],
      age611mo: [false, Validators.required],
      age1yr: [false, Validators.required],
      age2yr: [false, Validators.required],
      age35yr: [false, Validators.required],
      age612yr: [false, Validators.required],
      age1318yr: [false, Validators.required],
      ageAdult: [false, Validators.required],
      tags: [[], Validators.required]

    });

    userSvc.user$.subscribe((user: User) => this.editable = user.authorities.includes('ADMIN'));
  }

  update() {
    console.log('Saving food item');
    this.foodItemForm.markAsPristine();

    var foodItemCpy = Object.assign({}, this.foodItem, this.foodItemForm.value);

    this.FoodItemSvc.update(foodItemCpy);


    //this.foodState.updateFoodItem(foodItemCpy);
  }

  ngOnInit() {
  }

}
