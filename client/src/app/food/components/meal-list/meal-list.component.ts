import {Meal} from '../../model/meal';
import {FoodStateService} from '../../services/food-state.service';
import {Component, OnInit, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'cw-meal-list',
  templateUrl: './meal-list.component.html',
  styleUrls: ['./meal-list.component.css']
})
export class MealListComponent implements OnInit {

  filter = 'ALL';
  search: string = undefined;
  currentPage = 1;
  totalItems = 0;

  Meals: Meal[] = [];
  PagedMeals: Meal[] = [];

  @Output() edit: EventEmitter<Meal> = new EventEmitter<Meal>();
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<Meal> = new EventEmitter<Meal>();

  showNoncompliant: false;

  constructor(private state: FoodStateService) {}

  ngOnInit() {
    this.state.meals$.share().subscribe(meals => this.Meals = meals.filter(meal => !meal.inactive));
  }

  filterMeals(filter: string) {

    this.filter = filter;
    this.search = undefined;
    var filteredList = (filter === 'ALL' || filter === 'CUSTOM') ? this.Meals.filter(m => this.showNoncompliant ? true : m.compliant) : this.Meals.filter(m => this.showNoncompliant ? true : m.compliant).filter(meal => meal.type === filter);
    if (!this.showNoncompliant)
      filteredList = filteredList.filter(meal => meal.compliant);
    this.currentPage = 1;
    this.totalItems = filteredList.length;
    this.PagedMeals = filteredList;
  }

  searchList() {
    this.currentPage = 1;
    this.filter = this.search && this.search.length > 0 ? 'CUSTOM' : 'ALL';
    const filteredList = this.search ? this.Meals.filter(m => this.showNoncompliant ? true : m.compliant).filter(meal => meal.description.toLowerCase().includes(this.search.toLowerCase())) : this.Meals.filter(m => this.showNoncompliant ? true : m.compliant);
    console.log('search = ' + this.search);
    this.totalItems = filteredList.length;
    this.PagedMeals = filteredList;
  }

  pagedMeals() {
    const start = (this.currentPage - 1) * 10;
    this.totalItems = (this.filter !== 'ALL') ? this.PagedMeals.length : this.Meals.filter(m => this.showNoncompliant ? true : m.compliant).length;
    return (this.filter !== 'ALL') ? this.PagedMeals.slice(start, start + 10) : this.Meals.filter(m => this.showNoncompliant ? true : m.compliant).slice(start, start + 10);
  }

  limit(text: string) {
    return text.slice(0, 30) + (text.length > 30 ? "..." : "");
  }

  editMeal(meal: Meal) {
    this.edit.emit(meal);
  }

  addMeal() {
    this.add.emit();
  }

  deleteMeal(meal: Meal) {
    this.delete.emit(meal);
  }
}
