import { AppState } from '../../app.state';
import { AdminActions } from '../admin.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Http, URLSearchParams } from '@angular/http';

@Injectable()
export class AdminQueryService {

  constructor(
    private store: Store<AppState>,
    private http: Http,
    private adminActions: AdminActions
  ) {} 
  

  queryFoodItems(page: number = 0, sort: string = 'description,asc', size: number = 20) {
    const params = new URLSearchParams();
    params.append( 'projection', 'foodItemFull' );
    params.append( 'page', page.toString() );
    params.append( 'size', size.toString() );
    params.append( 'sort', sort );
    
    return this.http.get( '/api/foodItem', { search: params } )
      .map( res => res.json() )
      .map( ({_embedded: { foodItems }, page: pageInfo } ) => 
          this.store.dispatch( this.adminActions.foodItemsReceived( { items: foodItems, page: pageInfo }  ) ) );
  }
}
