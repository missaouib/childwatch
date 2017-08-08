import { AppState } from '../../app.state';
import { MealActions } from '../meal.actions';
import { Menu } from '../meal.interfaces';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

@Injectable()
export class MenuService {

  /**
   * @constructor
   */
  constructor(
    private store: Store<AppState>,
    private http: Http,
    private mealActions: MealActions
  ) { }

  /**
   * Query for menu items between two dates (inclusive)
   */
  queryBetween(start: Date, end: Date) {
    const params = new URLSearchParams();
    params.append( 'projection', 'menuFull' );
    params.append( 'start', moment( start ).format( 'MM/DD/YYYY' ) );
    params.append( 'end', moment(end).format( 'MM/DD/YYYY' ) );

    return this.http.get( '/api/menu/search/between', {search: params} )
      .map( res => res.json() )
      .map( ({_embedded: {menus} }) => this.store.dispatch( this.mealActions.menusReceived( { start: start, end: end, menus: menus } ) ) );
  }

  /**
   * Update the menu item
   */
  update( menu: Menu ) {
    return ( menu.id === undefined ) ?
      this.http.post( '/api/menu/' + menu.id, menu ) :
      this.http.patch( '/api/menu/' + menu.id, menu );
  }

}
