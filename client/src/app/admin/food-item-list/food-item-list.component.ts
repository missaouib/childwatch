import { FoodItem } from '../../meals/meal.interfaces';
import { Page } from '../admin.interfaces';
import { AdminStateService } from '../services/admin-state.service';
import { transition, trigger, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cw-food-item-list',
  templateUrl: './food-item-list.component.html',
  styleUrls: ['./food-item-list.component.css'],
  animations: [
    trigger(
      'changeAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 1}),
          animate('750ms ease-in')          
        ])
      ]
    )
  ]
})
export class FoodItemListComponent implements OnInit {

  foodItems: FoodItem[];
  pageInfo: Page = {
    size: 20,
    totalElements: 0,
    totalPages: 1,
    number: 1
  };
  
 lastSortOrder = 'description,desc';
  
 rowSelected: any = undefined;

  constructor(private state: AdminStateService ) { }

  ngOnInit() {
    this.state.foodItems$.subscribe( items => this.foodItems = items );
    this.state.foodItemsPageInfo$.subscribe( page => this.pageInfo = page );
  }

  pageChanged( event: any ){
    console.log( 'Page changed to ' + event.page );
    this.rowSelected = undefined;
    this.state.loadFoodItems( event.page - 1 );
  }
  
  sort( sortOrder: string ) {
    if ( this.lastSortOrder.startsWith(sortOrder) && this.lastSortOrder.endsWith(',asc') ){
      this.lastSortOrder = sortOrder +',desc';
      
    }
    else{
      this.lastSortOrder = sortOrder +',asc';
    }
    
    this.state.loadFoodItems( this.pageInfo.number, this.lastSortOrder );
    
  }


}
