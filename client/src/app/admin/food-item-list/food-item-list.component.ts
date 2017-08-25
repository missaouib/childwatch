import { FoodItem, FoodComponent, Page } from '../../food/food.interfaces';
import { FoodStateService } from '../../food/services/food-state.service';
import { transition, trigger, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  foodItem: FormGroup;
    
  foodItems: FoodItem[];
  foodComponentsFlat: FoodComponent[];
  foodComponents: any[];
  
  foodItemList: FoodItem[];
  
  
  
  pageInfo: Page = {
    size: 20,
    totalElements: 0,
    totalPages: 1,
    number: 1
  };
  
  filter: any = undefined;
  
 lastSortOrder = 'description,desc';
  
 showDetail = false; 
  
 constructor(
   private state: FoodStateService, 
   private fb: FormBuilder 
 ) { }

  
  ngOnInit() {

    this.foodItem = this.fb.group({
      id: [''],
      description: [ '', Validators.required ],
      shortDescription: [ '' ],
      foodComponent: [ undefined, Validators.required ],
      purchaseUom: [ '' ],
      servingUom: [ '' ],
      _links: [ undefined ]
    });
    
    this.foodItem.valueChanges.debounceTime(500).subscribe( () => { 
      if ( this.foodItem.valid ) {
        console.log( 'SAVING FoodItem ' + this.foodItem.value.id );
        // this.state.updateFoodItem( this.foodItem.value );
      }
    });
    
    this.state.foodItems$.subscribe( (items: FoodItem[]) => {
      this.pageInfo.totalElements = items.length;
      this.pageInfo.totalPages = Math.ceil(this.pageInfo.totalElements / this.pageInfo.size );      
      this.foodItems = items; 
      this.foodItemList = items;
    });
    this.state.foodComponents$.subscribe( (fc: FoodComponent[]) => {
      this.foodComponentsFlat = fc;
      this.foodComponents = fc.filter( (c: FoodComponent) => c.parentComponent === null )
          .map( (f: FoodComponent) => { return { ...f, children: [] }; } );
      fc.filter( (c) => c.parentComponent !== null )
        .forEach( (c) => this.foodComponents.find( (p) => p.id === c.parentComponent.id ).children.push( c ) );
      
    });    
  }
  
  pagedFoodItems() {
    return this.foodItems.slice( this.pageInfo.number - 1 * this.pageInfo.size, this.pageInfo.size );
  }
  
  filterList( filter: any ) {
    this.filter = filter;
    
    this.foodItemList = (this.filter === undefined) ? 
      this.foodItems : this.foodItems.filter( (foodItem) => foodItem.foodComponent.id === this.filter.id );
    this.pageInfo.totalElements = this.foodItemList.length;
    this.pageInfo.totalPages = Math.ceil(this.pageInfo.totalElements / this.pageInfo.size );
    this.pageInfo.number = 1;
    this.showDetail = false;
  }

  pageChanged( event: any ) {
    this.pageInfo.number = event.page;
    this.showDetail = false;
  }
    
  onFoodItemSelected(foodItem: FoodItem) {
    // need to pick the value from the list being used in the dropdown    
    const foodComponent = this.foodComponentsFlat.find( (fc) => fc.id === foodItem.foodComponent.id );    
    this.foodItem.setValue( { ...foodItem, foodComponent: foodComponent } );   
    this.showDetail = true;
  }

}
