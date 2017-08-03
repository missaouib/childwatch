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
  

  queryFoodItems(page: number = 0, sort: string = 'description,asc', size: number = 20){
    /*
    let params: URLSearchParams = new URLSearchParams();
params.set('var1', val1);
params.set('var2', val2);

let requestOptions = new RequestOptions();
requestOptions.search = params;

this.http.get(StaticSettings.BASE_URL, requestOptions)
    .toPromise()
    .then(response => response.json())
    */
    console.log( 'query page:' + page + ' sort:' + sort + ' size:' + size );
    
    return this.http.get( '/api/foodItem?projection=foodItemFull&page=' + page + '&size=' + size + '&sort=' + sort )
      .map( res => res.json() )
      .map( ({_embedded: { foodItems }, page: pageInfo } ) => 
          this.store.dispatch( this.adminActions.foodItemsReceived( { items: foodItems, page: pageInfo }  ) ) );
  }
}
