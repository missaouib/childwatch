import { FoodComponent, Meal, FoodItem } from '../food.interfaces';
import { FoodStateService } from '../services/food-state.service';
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'cw-meal-builder',
  templateUrl: './meal-builder.component.html',
  styleUrls: ['./meal-builder.component.css']
})
export class MealBuilderComponent implements OnInit {
  @ViewChild("containerPieChart") element: ElementRef;
  
  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private radius: number;

  private arc: any;
  private labelArc: any;
  private pie: any;
  private color: any;
  private svg: any;
  
  foodComponents: any[] = [];
  
  mealForm: FormGroup;
  foodItems: FormArray;
  
  food: FoodItem[] = [];
  
  activeTab = 'AGE_0_5MO';
  
  meal: Meal = {
    id: undefined,
    description: undefined,
    type: undefined
  };
  
  private Colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
  
  Stats: any[] = [
  {component: "MILK", population: 2, color: '#98abc5' },
  {component: "VEGETABLES/FRUIT", population: 1, color: '#8a89a6'},
  {component: "GRAINS", population: 2, color: '#7b6888' }
];
  

  constructor(
    private state: FoodStateService,
    private formBuilder: FormBuilder,
    public toastr: ToastsManager, 
    vcr: ViewContainerRef,
   ) {
    this.width = 1800 - this.margin.left - this.margin.right ;
    this.height = 1500 - this.margin.top - this.margin.bottom;
    this.radius = 420; //Math.min(this.width, this.height) / 2;
    
    this.state.foodComponents$.subscribe( (fc: FoodComponent[]) => {
      this.foodComponents = fc.filter( (c: FoodComponent) => c.parentComponent === null )
          .map( (f: FoodComponent) => { return { ...f, children: [] }; } );
      fc.filter( (c) => c.parentComponent !== null )
        .forEach( (c) => this.foodComponents.find( (p) => p.id === c.parentComponent.id ).children.push( c ) );
      
    });
    
    this.state.foodItems$.subscribe( (fi: FoodItem[]) => this.food = fi );
    
    this.state.currentMeal$.subscribe( (currentMeal: Meal) => {
      console.log( 'currentMeal id = ' + currentMeal.id );
      this.meal = currentMeal; });
    
    this.toastr.setRootViewContainerRef(vcr);
    
  }

  ngOnInit() {
      this.initSvg();
      this.drawPie();
      this.mealForm = this.formBuilder.group({
        id: this.meal.id,
        name: [ this.meal.description, Validators.required ],
        type: [ this.meal.type, Validators.required ],
        AGE_0_5MO:  this.formBuilder.array([]),
        AGE_6_11MO: this.formBuilder.array([]),
        AGE_1_2YR: this.formBuilder.array([]),
        AGE_3_5YR: this.formBuilder.array([]),
        AGE_6_12YR: this.formBuilder.array([]),
        AGE_13_18YR: this.formBuilder.array([]),
        AGE_ADULT: this.formBuilder.array([]) 
      });
        
    this.mealForm.valueChanges.debounceTime(3000).subscribe( () => { 
      if ( this.mealForm.valid && (this.mealForm.get('name').dirty || this.mealForm.get('type').dirty) ) {
        this.toastr.success( 'Saved the meal', 'Save' );
        const meal = this.buildMeal();
        this.state.updateMeal( meal );
      }          
    });
    
  }
  
  activateTab( tabName: string ) {
    this.activeTab = tabName;
    this.foodItems = this.mealForm.get(this.activeTab) as FormArray;    
  }
  
  foodForComponent( component: FoodComponent ): FoodItem[] {
    return this.food.filter( (fi) => fi.foodComponent.id === component.id );
  }
  
  createComponent(component: FoodComponent, foodItem?: FoodItem ): FormGroup {
    return this.formBuilder.group( { 
      mealFoodItemId: UUID.UUID(), 
      description: [ foodItem ? foodItem.description : undefined, Validators.required ],      
      foodComponent: [ foodItem ? foodItem.foodComponent : component, Validators.required ],
      quantity: ['1', Validators.required ],
      units: ['each', Validators.required ],
      foodItemId: [ foodItem ? foodItem.id : undefined, Validators.required ]
    });
  }
  
  /**
   * Add a food component to the meal
   */
  addComponent(c: FoodComponent): void {
    console.log( 'adding component ' + c.id );
    this.foodItems = this.mealForm.get(this.activeTab) as FormArray;
    const createdComponent = this.createComponent(c);
     
    // when this value changes; update it in the state
    createdComponent.valueChanges.debounceTime(3000).subscribe( ($event) => {
      // we're only valid if we have a foodItemId
      if ( $event.foodItemId ) { this.state.updateMealFoodItem( $event, this.activeTab, this.meal ); }
    });
    
    this.foodItems.push( createdComponent );  
    
    this.toastr.info( 'ageGroup: ' + this.activeTab + ', meal: ' + this.meal.id, 'Adding MealFoodItem' ); 
  }
  
  copyTo(ageGroup:string, except?: string){
    if( ageGroup === 'ALL' ) {
      const ageGroups = 
        ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT' ]
          .filter( (ag) => ag !== except );      
      ageGroups.forEach( (ag) => this.copyTo( ag ) );      
    }
    else{
      this.foodItems = this.mealForm.get(this.activeTab) as FormArray;
      const copy = this.mealForm.get(ageGroup) as FormArray;
      this.foodItems.controls.forEach( (fic) => { console.log( 'Pushing ' ); copy.push(fic) } );
    }
  }
  
  buildMeal(): Meal {
    return {
      id: this.meal.id,
      description: this.mealForm.get('name').value,
      type: (this.mealForm.get('type').value as string).toUpperCase(),
      mealFoodItems: [
        {
          
        }
      ]
    }; 
  }

  private initSvg() {
    this.color = d3Scale.scaleOrdinal()
        .range(this.Colors);
    this.arc = d3Shape.arc()
                      .outerRadius(this.radius - 10)
                      .innerRadius(0);
    this.labelArc = d3Shape.arc()
                           .outerRadius(this.radius - 40)
                           .innerRadius(this.radius - 40);
    this.pie = d3Shape.pie()
                      .sort(null)
                      .value((d: any) => d.population);
    
    this.svg = d3.select("svg")
                 .append("g")
                 .attr("transform", "translate( 870,935 )" ); // + this.width / 2 + "," + this.height / 2 + ")");
        
  }
  
  removeComponent( i: number ) {
    this.foodItems = this.mealForm.get(this.activeTab) as FormArray;
    this.foodItems.removeAt(i);
  }
  
  private onClick( d: any ) {
    console.log( "Selected " + d.data.component );
  }

  private drawPie() {
    let g = this.svg.selectAll(".arc")
                    .data(this.pie(this.Stats))
                    .enter().append("g")
                    .attr("class", "arc")
                    .on( "click", this.onClick );
    g.append("path").attr("d", this.arc)
                    .style("fill", (d: any) => this.color(d.data.component) );
    g.append("text").attr("transform", (d: any) => "translate(" + this.labelArc.centroid(d) + ")")
                    
                    .attr("font-size", "48" )
                    .text((d: any) => d.data.component);
  }


}
