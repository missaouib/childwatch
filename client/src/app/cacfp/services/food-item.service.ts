import {AppState} from '../../app.state';
import * as FoodActions from '../store/food.actions';
import {FoodItem} from '../model/food-item';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';

interface Response {
  _embedded: {foodItems: FoodItem[]}
}

@Injectable()
export class FoodItemService {

  static FULL = 'foodItemFull';
  private URL = '/api/foodItem';
  private HEADERS = {
    'X-CHILDWATCH-TENANT': null,
    'X-CHILDWATCH-USER': null
  };

  constructor(
    private store: Store<AppState>,
    private http: HttpClient
  ) {
    this.store.select(s => s.config.user).subscribe(user => {
      this.HEADERS['X-CHILDWATCH-TENANT'] = (user && user.tenant) ? user.tenant.id : null,
        this.HEADERS['X-CHILDWATCH-USER'] = (user) ? user.id : null
    });
  }


  query(projection = FoodItemService.FULL) {
    const params = {projection: projection};
    return this.http.get<Response>(this.URL, {params: params, headers: this.HEADERS})
      .map(({_embedded: {foodItems}}) => foodItems.filter((item: FoodItem) => !item.parent))
      .map(items => this.store.dispatch(new FoodActions.FoodItemsReceivedAction(items)));
  }

  update(foodItem: FoodItem) {
    return this.http.put(this.URL + '/' + foodItem.id, foodItem, {headers: this.HEADERS})
      .subscribe(
      () => this.store.dispatch(new FoodActions.FoodItemUpdatedAction(foodItem)),
      (err) => this.handleError(err));
  }

  delete(foodItem: FoodItem) {
    return this.http.delete(this.URL + '/' + foodItem.id, {headers: this.HEADERS})
      .subscribe(
      () => this.store.dispatch(new FoodActions.FoodItemDeletedAction(foodItem)),
      (err) => this.handleError(err));
  }

  handleError(err: any) {
    console.log(err);
  }


}
