import {AppState} from '../../app.state';
import {User} from '../../config/config.state';
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

  user: User;


  constructor(
    private store: Store<AppState>,
    private http: HttpClient
  ) {
    this.store.select(s => s.config.user).subscribe(user => this.user = user);
  }


  query(projection = FoodItemService.FULL) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };

    const params = {projection: projection};

    return this.http.get<Response>(this.URL, {params: params, headers: headers})
      .map(({_embedded: {foodItems}}) => foodItems.filter((item: FoodItem) => !item.parent))
      .map(items => this.store.dispatch(new FoodActions.FoodItemsReceivedAction(items)));
  }

  update(foodItem: FoodItem) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };

    return this.http.put('/api/foodItem/' + foodItem.id, foodItem, {headers: headers})
      .subscribe(
      () => this.store.dispatch(new FoodActions.FoodItemUpdatedAction(foodItem)),
      (err) => this.handleError(err));
  }

  delete(foodItem: FoodItem) {
    const headers = {
      'X-CHILDWATCH-TENANT': (this.user) ? this.user.tenant.id : null,
      'X-CHILDWATCH-USER': (this.user) ? this.user.id : null
    };

    return this.http.delete(this.URL + '/' + foodItem.id, {headers: headers})
      .subscribe(
      () => this.store.dispatch(new FoodActions.FoodItemDeletedAction(foodItem)),
      (err) => this.handleError(err));
  }

  handleError(err: any) {
    console.log(err);
  }


}
