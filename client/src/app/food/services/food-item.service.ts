import {AppState} from '../../app.state';
import * as FoodActions from '../food.actions';
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
    private http: Http
  ) {}

  query(projection = FoodItemService.FULL) {
    const params = new URLSearchParams();
    params.append('projection', projection);

    return this.http.get(this.URL, {search: params})
      .map(res => res.json())
      .map(({_embedded: {foodItems}}) => foodItems.filter((item: FoodItem) => !item.parent))
      .map(items => this.store.dispatch(new FoodActions.FoodItemsReceivedAction(items)));
  }

  update(foodItem: FoodItem) {
    return this.http.put('/api/foodItem/' + foodItem.id, foodItem)
      .subscribe(
      () => this.store.dispatch(new FoodActions.FoodItemUpdatedAction(foodItem)),
      (err) => this.handleError(err));
  }

  delete(foodItem: FoodItem) {
    return this.http.delete(this.URL + '/' + foodItem.id)
      .subscribe(
      () => this.store.dispatch(new FoodActions.FoodItemDeletedAction(foodItem)),
      (err) => this.handleError(err));
  }

  handleError(err: any) {
    console.log(err);
  }


}
