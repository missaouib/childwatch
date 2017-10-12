import {FoodItem} from '../model/food-item';
import {FoodStateService} from '../services/food-state.service';
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'cw-food-item-list',
  templateUrl: './food-item-list.component.html',
  styleUrls: ['./food-item-list.component.css']
})
export class FoodItemListComponent implements OnInit {


  private _ageGroup: string = 'AGE_0_5MO';

  @Input() show: boolean;

  @Input()
  set ageGroup(ageGroup: string) {

    this.AgeAppropriateItems = this.FoodItems.filter(item => item.isAppropriateForAgeGroup(ageGroup));
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
    private state: FoodStateService
  ) {}

  ngOnInit() {
    this.state.foodItems$.subscribe(foodItems => {
      this.FoodItems = foodItems.slice();
      this.FoodItems.sort((a, b) => a.description.toLowerCase().localeCompare(b.description.toLowerCase()));
      this.totalItems = this.FoodItems.length;
      this.AgeAppropriateItems = this.FoodItems.filter(item => item.isAppropriateForAgeGroup(this._ageGroup))
      this.PagedItems = this.AgeAppropriateItems;

    });
  }

  filterFoodItems(filter: string) {
    this.filter = filter;
    this.search = undefined;
    const filteredList = (filter === 'ALL' || filter === 'CUSTOM') ? this.AgeAppropriateItems : this.AgeAppropriateItems.filter(item => item.category === filter || item.hasTag(filter));

    this.currentPage = 1;
    this.totalItems = filteredList.length;
    this.PagedItems = filteredList;
  }


  pagedFoodItems() {
    const start = (this.currentPage - 1) * 10;

    return ((this.filter !== 'ALL') ? this.PagedItems : this.AgeAppropriateItems).slice(start, start + 10);
  }


  searchList() {

    this.currentPage = 1;
    this.filter = this.search && this.search.length > 0 ? 'CUSTOM' : 'ALL';
    const filteredList = this.search ? this.FoodItems.filter(item => item.description.toLowerCase().includes(this.search.toLowerCase())) : this.FoodItems;
    console.log('search = ' + this.search);
    this.totalItems = filteredList.length;
    this.PagedItems = filteredList;
  }

  limit(text: string, len?: number) {
    const _len = len || 30;
    return text.slice(0, _len) + (text.length > _len ? "..." : "");
  }
}
