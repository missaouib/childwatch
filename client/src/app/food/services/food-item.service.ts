import {AppState} from '../../app.state';
import {FoodActions} from '../food.actions';
import {FoodItem} from '../food.interfaces';
import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Store} from '@ngrx/store';

@Injectable()
export class FoodItemService {

  static FULL = 'foodItemFull';

  private URL = '/api/foodItem';



  constructor(
    private store: Store<AppState>,
    private http: Http,
    private actions: FoodActions
  ) {}

  query(projection = FoodItemService.FULL) {
    const params = new URLSearchParams();
    params.append('projection', projection);

    return this.http.get(this.URL, {search: params})
      .map(res => res.json())
      .map(({_embedded: {foodItems}}) =>
        this.store.dispatch(this.actions.foodItemsReceived(foodItems)));
  }

  update(foodItem: FoodItem) {
    return this.http.put('/api/foodItem/' + foodItem.id, foodItem)
      .subscribe(
      () => this.store.dispatch(this.actions.foodItemUpdated(foodItem)),
      (err) => this.handleError(err));
  }

  delete(foodItem: FoodItem) {
    return this.http.delete(this.URL + '/' + foodItem.id)
      .subscribe(
      () => this.store.dispatch(this.actions.foodItemDeleted(foodItem)),
      (err) => this.handleError(err));
  }

  handleError(err: any) {
    console.log(err);
  }


}
