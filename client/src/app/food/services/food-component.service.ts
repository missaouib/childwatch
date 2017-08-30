import { AppState } from '../../app.state';
import { FoodActions } from '../food.actions';
import { FoodComponent } from '../food.interfaces';
import { Injectable, ViewContainerRef } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Injectable()
export class FoodComponentService {

  static FULL = 'foodComponentFull';
  static WITH_ID = 'foodComponentWithId';
  
  private URL = '/api/foodComponent';
  
  vcr: ViewContainerRef = null;
  
  constructor(
    private store: Store<AppState>,
    private http: Http,
    private actions: FoodActions,
    private toastr: ToastsManager
    
  ) { 
    
  }
    
  
    
    query( projection = FoodComponentService.FULL ) {
      
      const params = new URLSearchParams();
      params.append( 'projection', projection );
      
      return this.http.get( this.URL, {search: params} )
        .map( res => res.json() )
        .map( ({_embedded: {foodComponents} })  => this.store.dispatch( this.actions.foodComponentsReceived( foodComponents ) ) );
    };
  
    queryFoodItemsFor( component: FoodComponent ) {
      const params = new URLSearchParams();
      params.append( 'projection', FoodComponentService.FULL );
      
      return this.http.get( component._links.foodItems.href, {search: params} )
        .map( res => res.json() )
        .map( ({_embedded: {foodItems} })  => {
          this.store.dispatch( this.actions.foodItemsReceived( foodItems ) );
          if ( this.vcr ) {
            this.toastr.setRootViewContainerRef( this.vcr ); 
            this.toastr.info( 'Received ' + foodItems.length + ' items', 'Food Items Received') ;
          }
        });
  }
    

}
