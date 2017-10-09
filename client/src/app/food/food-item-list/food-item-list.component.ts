import {FoodItem} from '../food.interfaces';
import {FoodStateService} from '../services/food-state.service';
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'cw-food-item-list',
  templateUrl: './food-item-list.component.html',
  styleUrls: ['./food-item-list.component.css']
})
export class FoodItemListComponent implements OnInit {


  @Input() show: boolean;

  @Input() ageGroup: string;

  FoodItems: FoodItem[] = [];
  currentPage = 1;
  totalItems = 0;
  numPages = 0;

  filter = 'ALL';
  search: string = undefined;

  PagedItems: FoodItem[] = [];

  filteredList: FoodItem[] = [];

  constructor(
    private state: FoodStateService
  ) {}

  ngOnInit() {
    this.state.foodItems$.subscribe(foodItems => {
      this.FoodItems = foodItems.slice();
      this.FoodItems.sort((a, b) => a.description.toLowerCase().localeCompare(b.description.toLowerCase()));
      this.totalItems = this.FoodItems.length;
    });
  }

  filterFoodItems(filter: string) {
    this.filter = filter;
    this.search = undefined;
    const filteredList = (filter === 'ALL' || filter === 'CUSTOM') ? this.FoodItems : this.FoodItems.filter(item => item.foodComponent.icon === filter);
    this.currentPage = 1;
    this.totalItems = filteredList.length;
    this.PagedItems = filteredList;
  }

  tagContainsAll(arr: string[], items: string[]) {
    for (var i = 0; i < items.length; i++) {
      if (arr.indexOf(items[i]) === -1)
        return false;
    }
    return true;
  }

  tagContainsAny(arr: string[], items: string[]) {
    return items.some(v => arr.indexOf(v) >= 0);
  }


  foodItemWithTag(tag: string[], except: string[]) {

    const _tag = tag.slice();
    const _except = except ? except.slice() : [];

    ((this.ageGroup == 'AGE_0_5MO' || this.ageGroup == 'AGE_6_11MO') ? _tag : _except).push('INFANT');


    return (this.search ? this.filteredList : this.FoodItems)
      .filter(({tags}) => {
        const tagAsStringArray = tags.map(t => t.value);
        return this.tagContainsAll(tagAsStringArray, _tag) &&
          ((_except) ? !this.tagContainsAny(tagAsStringArray, _except) : true);
      });
  }

  pagedFoodItems() {
    const start = (this.currentPage - 1) * 10;
    return (this.filter !== 'ALL') ? this.PagedItems.slice(start, start + 10) : this.FoodItems.slice(start, start + 10);
  }

  filterList() {
    this.filteredList = this.search ? this.FoodItems.filter(item => item.description.toLowerCase().includes(this.search.toLowerCase())) : this.FoodItems;
  }




  searchList() {

    // this.filterList();

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
