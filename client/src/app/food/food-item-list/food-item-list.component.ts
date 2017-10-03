import {FoodItem} from '../food.interfaces';
import {FoodStateService} from '../services/food-state.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cw-food-item-list',
  templateUrl: './food-item-list.component.html',
  styleUrls: ['./food-item-list.component.css']
})
export class FoodItemListComponent implements OnInit {

  FoodItems: FoodItem[] = [];
  currentPage = 1;
  totalItems = 0;
  numPages = 0;

  filter = 'ALL';
  search: string = undefined;

  PagedItems: FoodItem[] = [];

  constructor(
    private state: FoodStateService
  ) {}

  ngOnInit() {
    this.state.foodItems$.subscribe(foodItems => {
      this.FoodItems = foodItems.slice();
      this.FoodItems.sort((a, b) => a.description.localeCompare(b.description));
      this.totalItems = this.FoodItems.length;
    });
  }

  filterFoodItems(filter: string) {
    this.filter = filter;
    const filteredList = (filter === 'ALL' || filter === 'CUSTOM') ? this.FoodItems : this.FoodItems.filter(item => item.foodComponent.icon === filter);
    this.currentPage = 1;
    this.totalItems = filteredList.length;
    this.PagedItems = filteredList;
  }


  pagedFoodItems() {
    const start = (this.currentPage - 1) * 10;
    return (this.filter !== 'ALL') ? this.PagedItems.slice(start, start + 10) : this.FoodItems.slice(start, start + 10);
  }


  searchList() {
    this.currentPage = 1;
    this.filter = this.search && this.search.length > 0 ? 'CUSTOM' : 'ALL';
    const filteredList = this.search ? this.FoodItems.filter(item => item.description.toLowerCase().includes(this.search.toLowerCase())) : this.FoodItems;
    console.log('search = ' + this.search);
    this.totalItems = filteredList.length;
    this.PagedItems = filteredList;
  }
}
