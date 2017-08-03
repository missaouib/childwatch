import { AppState } from '../../app.state';
import { FoodItem } from '../../meals/meal.interfaces';
import { Page } from '../admin.interfaces';
import { AdminQueryService } from './admin-query.service';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AdminStateService {


  lastSortOrder = 'none';
  
  constructor(
    private store: Store<AppState>,
    private querySvc: AdminQueryService
  ) {
    this.querySvc.queryFoodItems().subscribe();
  }

  get foodItems$(): Observable<FoodItem[]>{
    return this.store.select( s => s.admin.foodItems.items );
  }
  
  get foodItemsPageInfo$(): Observable<Page>{
    return this.store.select( s => s.admin.foodItems.page ); 
  }
  
  loadFoodItems( page: number, sortOrder: string = 'description,asc' ) {
    if( this.lastSortOrder !== sortOrder ){
      page = 0;
    }
    this.lastSortOrder = sortOrder;
      
    this.querySvc.queryFoodItems( page, sortOrder ).subscribe();
  }
  
}