import {AppState} from '../../app.state';
import {User} from '../../config/config.state';
import * as FoodActions from '../store/food.actions';
import {FoodItem} from '../model/food-item';
import {Injectable} from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import {Store} from '@ngrx/store';

@Injectable()
export class FoodItemService {

  static FULL = 'foodItemFull';

  private URL = '/api/foodItem';

  user: User;


  constructor(
    private store: Store<AppState>,
    private http: Http
  ) {
    this.store.select(s => s.config.user).subscribe(user => this.user = user);

  }


  query(projection = FoodItemService.FULL) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);
    const params = new URLSearchParams();
    params.append('projection', projection);

    return this.http.get(this.URL, {search: params, headers: headers})
      .map(res => res.json())
      .map(({_embedded: {foodItems}}) => foodItems.filter((item: FoodItem) => !item.parent))
      .map(items => this.store.dispatch(new FoodActions.FoodItemsReceivedAction(items)));
  }

  update(foodItem: FoodItem) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);
    return this.http.put('/api/foodItem/' + foodItem.id, foodItem, {headers: headers})
      .subscribe(
      () => this.store.dispatch(new FoodActions.FoodItemUpdatedAction(foodItem)),
      (err) => this.handleError(err));
  }

  delete(foodItem: FoodItem) {
    let headers = new Headers();
    this.user && headers.append('X-CHILDWATCH-TENANT', this.user.tenant.id);
    this.user && headers.append('X-CHILDWATCH-USER', this.user.id);
    return this.http.delete(this.URL + '/' + foodItem.id, {headers: headers})
      .subscribe(
      () => this.store.dispatch(new FoodActions.FoodItemDeletedAction(foodItem)),
      (err) => this.handleError(err));
  }

  handleError(err: any) {
    console.log(err);
  }


}
