import { AppState } from '../../app.state';
import { AdminActions } from '../admin.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';

@Injectable()
export class AdminQueryService {

  constructor(
    private store: Store<AppState>, 
    private http: Http,
    private adminActions: AdminActions
  ) {} 
  

  queryFoodItems(page: number = 0, size: number = 20){
    const params = new URLSearchParams();
    params.set( 'page', page.toString() );
    params.set( 'size', size.toString() );
    
    return this.http.get( '/api/foodItem?projection=foodItemFull&page=' + page + '&size=20' )
      .map( res => res.json() )
      .map( ({_embedded: { foodItems }, page: pageInfo } ) => 
          this.store.dispatch( this.adminActions.foodItemsReceived( { items: foodItems, page: pageInfo }  ) ) );
  }
}
