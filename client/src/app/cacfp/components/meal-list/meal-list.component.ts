import {User} from "../../../user/config.state";
import {UserService} from "../../../user/user.service";
import {Meal} from '../../model/meal';
import {FoodStateService} from '../../services/food-state.service';
import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {MealType} from '../../model/meal-type';

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
  _meals: Meal[] = [];
  MEALTYPE: MealType;

  set Meals(meals: Meal[]) {
    this._meals = meals;
    let meal = this._meals.find(m => m.id === 'ecacb2ca-4fe3-4a9f-7ca1-8ba3c4574b05');
    if (meal) console.log(`meal ${meal.description} === ${meal.inactive}`);
    console.log('Meals updated');
    this.refresh.next();
    if (this.search) this.searchList();
    else this.filterMeals(this.filter);
  };
  get Meals(): Meal[] {return this._meals;}
  PagedMeals: Meal[] = [];

  @Output() edit: EventEmitter<Meal> = new EventEmitter<Meal>();
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() activate: EventEmitter<Meal> = new EventEmitter<Meal>();
  @Output() recurrence: EventEmitter<Meal> = new EventEmitter<Meal>();

  showNoncompliant: false;
  showInactive: false;
  user: User;

  refresh: Subject<any> = new Subject();

  constructor(private state: FoodStateService,
    private userSvc: UserService) {
    this.MEALTYPE = new MealType();
  }

  ngOnInit() {
    this.state.meals$.subscribe(meals => this.Meals = meals.concat().sort((a, b) => a.description.toUpperCase().localeCompare(b.description.toUpperCase())));
    this.userSvc.user$.subscribe(user => this.user = user);
  }

  filterNonCompliantAndInactive(meals: Meal[]): Meal[] {
    return meals.filter(m => this.showNoncompliant ? true : m.compliant).filter(m => this.showInactive ? true : !m.inactive);
  }

  filterMeals(filter: string) {

    this.filter = filter;
    this.search = undefined;
    var filteredList = (filter === 'ALL' || filter === 'CUSTOM') ? this.filterNonCompliantAndInactive(this.Meals) : this.filterNonCompliantAndInactive(this.Meals).filter(meal => meal.type === filter);
    /*if (!this.showNoncompliant)
      filteredList = filteredList.filter(meal => meal.compliant);*/
    this.currentPage = 1;
    this.totalItems = filteredList.length;
    this.PagedMeals = filteredList;
  }

  searchList() {
    this.currentPage = 1;
    this.filter = this.search && this.search.length > 0 ? 'CUSTOM' : 'ALL';
    const filteredList = this.search ? this.filterNonCompliantAndInactive(this.Meals).filter(meal => meal.description.toLowerCase().includes(this.search.toLowerCase())) : this.filterNonCompliantAndInactive(this.Meals);
    console.log('search = ' + this.search);
    this.totalItems = filteredList.length;
    this.PagedMeals = filteredList;
  }

  pagedMeals() {
    const start = (this.currentPage - 1) * 10;
    this.totalItems = (this.filter !== 'ALL') ? this.PagedMeals.length : this.filterNonCompliantAndInactive(this.Meals).length;
    return (this.filter !== 'ALL') ? this.PagedMeals.slice(start, start + 10) : this.filterNonCompliantAndInactive(this.Meals).slice(start, start + 10);
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

  toggleActivateMeal(meal: Meal) {
    var copyMeal = {...meal};
    copyMeal.inactive = !copyMeal.inactive;
    this.activate.emit(copyMeal);
  }

  setupRecurrence(meal: Meal) {
    this.recurrence.emit(meal);
  }

}
