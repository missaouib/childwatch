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
  foodComponents: FoodComponent[];
  pageInfo: Page = {
    size: 20,
    totalElements: 0,
    totalPages: 1,
    number: 1
  };
  
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
        //this.state.updateFoodItem( this.foodItem.value );
      }
    });
    
    this.state.foodItems$.subscribe( items => this.foodItems = items );
    this.state.foodComponents$.subscribe( items => this.foodComponents = items );
  }

  pageChanged( event: any ) {
    console.log( 'Page changed to ' + event.page );
    //this.state.loadFoodItems( event.page - 1 );
    this.showDetail = false;
  }
  
  sort( sortOrder: string ) {
    this.lastSortOrder = sortOrder + 
      ( this.lastSortOrder.startsWith(sortOrder) && this.lastSortOrder.endsWith(',asc') ) ? ',desc' : ',asc';
    //this.state.loadFoodItems( this.pageInfo.number, this.lastSortOrder );    
  }
  
  onFoodItemSelected(foodItem: FoodItem) {
    // need to pick the value from the list being used in the dropdown
    const foodComponent = this.foodComponents.find( (fc) => fc.id === foodItem.foodComponent.id );
    this.foodItem.setValue( { ...foodItem, foodComponent: foodComponent } );
    
    this.showDetail = true;
  }
  
  onSubmit() {
    console.log( this.foodItem.value, this.foodItem.valid );
  }


}
