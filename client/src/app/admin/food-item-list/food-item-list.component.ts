import { FoodItem } from '../../meals/meal.interfaces';
import { Page } from '../admin.interfaces';
import { AdminStateService } from '../services/admin-state.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cw-food-item-list',
  templateUrl: './food-item-list.component.html',
  styleUrls: ['./food-item-list.component.css']
})
export class FoodItemListComponent implements OnInit {

  foodItems: FoodItem[];
  pageInfo: Page = {
    size: 20,
    totalElements: 0,
    totalPages: 0,
    number: 0
  };

  constructor(private state: AdminStateService ) { }

  ngOnInit() {
    this.state.foodItems$.subscribe( items => this.foodItems = items );
    this.state.foodItemsPageInfo$.subscribe( page => this.pageInfo = page );
  }

  pageChanged( event: any ){
    console.log( 'Page changed to ' + event.page );
    this.state.loadFoodItems( event.page - 1 );
  }

}
