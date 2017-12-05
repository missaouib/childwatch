import {FoodItem} from '../../model/food-item';
import {FoodItemUtils} from '../../model/food-item-utils';
import {FoodItemService} from '../../services/food-item.service';
import {FoodStateService} from '../../services/food-state.service';
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'cw-food-item-list',
  templateUrl: './food-item-list.component.html',
  styleUrls: ['./food-item-list.component.css']
})
export class FoodItemListComponent implements OnInit {


  private _ageGroup: string = 'AGE_0_5MO';
  FoodItemUtils: FoodItemUtils;

  @Input() show: boolean;

  @Input()
  set ageGroup(ageGroup: string) {

    this.AgeAppropriateItems = this.FoodItems.filter(item => this.FoodItemUtils.isAppropriateForAgeGroup(item, ageGroup));
    if (this.filter === 'CUSTOM')
      this.searchList();
    else
      this.filterFoodItems(this.filter);
  }

  get ageGroup() {return this._ageGroup;}

  FoodItems: FoodItem[] = [];
  currentPage = 1;
  totalItems = 0;
  numPages = 0;

  filter = 'ALL';
  search: string = undefined;

  PagedItems: FoodItem[] = [];
  AgeAppropriateItems: FoodItem[] = [];

  filteredList: FoodItem[] = [];

  constructor(
    private state: FoodStateService,
    private foodItemSvc: FoodItemService
  ) {
    this.FoodItemUtils = new FoodItemUtils();
    this.foodItemSvc.query(FoodItemService.FULL).subscribe();
  }

  ngOnInit() {

    this.state.foodItems$.subscribe(foodItems => {
      this.FoodItems = foodItems.slice();
      this.FoodItems.sort((a, b) => a.description.toLowerCase().localeCompare(b.description.toLowerCase()));
      this.totalItems = this.FoodItems.length;
      this.AgeAppropriateItems = this.FoodItems.filter(item => this.FoodItemUtils.isAppropriateForAgeGroup(item, this._ageGroup))
      this.PagedItems = this.AgeAppropriateItems;

    });
  }

  filterFoodItems(filter: string) {
    this.filter = filter;
    this.search = undefined;
    const filteredList = (filter === 'ALL' || filter === 'CUSTOM') ? this.AgeAppropriateItems : this.AgeAppropriateItems.filter(item => this.FoodItemUtils.category(item) === filter || this.FoodItemUtils.hasTag(item, filter));

    this.currentPage = 1;
    this.totalItems = filteredList.length;
    this.PagedItems = filteredList;
  }


  pagedFoodItems() {
    const start = (this.currentPage - 1) * 10;

    const foodItemsList = ((this.filter !== 'ALL') ? this.PagedItems : this.AgeAppropriateItems).slice(start, start + 10);

    return foodItemsList.sort((a, b) => a.shortDescription.toLowerCase().localeCompare(b.shortDescription.toLowerCase()))
  }


  searchList() {

    this.currentPage = 1;
    this.filter = this.search && this.search.length > 0 ? 'CUSTOM' : 'ALL';
    const filteredList = this.search ? this.AgeAppropriateItems.filter(item => item.description.toLowerCase().includes(this.search.toLowerCase())) : this.AgeAppropriateItems;
    console.log('search = ' + this.search);
    this.totalItems = filteredList.length;
    this.PagedItems = filteredList;
  }

}
