/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import {FoodComponent, Meal, FoodItem} from '../food.interfaces';
import {FoodStateService} from '../services/food-state.service';
import {Component, OnInit, ViewChild, ElementRef, ViewContainerRef} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {UUID} from 'angular2-uuid';


/**
 * MealBuilderComponent
 * 
 * @component
 */
@Component({
  selector: 'cw-meal-builder',
  templateUrl: './meal-builder.component.html',
  styleUrls: ['./meal-builder.component.css']
})
export class MealBuilderComponent implements OnInit {

  @ViewChild('containerPieChart')
  element: ElementRef;

  AGEGROUPS = ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT'];

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

  private Colors = ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'];

  Stats: any[] = [
    {component: 'MILK', population: 2, color: '#98abc5'},
    {component: 'VEGETABLES/FRUIT', population: 1, color: '#8a89a6'},
    {component: 'GRAINS', population: 2, color: '#7b6888'}
  ];

  /**
   * constructor for the MealBuilderComponent
   * 
   * @constructor
   */
  constructor(
    private state: FoodStateService,
    private formBuilder: FormBuilder,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
  ) {
    this.width = 1800 - this.margin.left - this.margin.right;
    this.height = 1500 - this.margin.top - this.margin.bottom;
    this.radius = 420; // Math.min(this.width, this.height) / 2;



    this.toastr.setRootViewContainerRef(vcr);

  }

  /**
   * Initialization of the component
   * 
   * @onInit
   */
  ngOnInit() {
    this.initSvg();
    this.drawPie();
    
    // create the meal form
    this.mealForm = this.formBuilder.group({
      id: undefined,
      name: [undefined, Validators.required],
      type: [undefined, Validators.required],
      AGE_0_5MO: this.formBuilder.array([]),
      AGE_6_11MO: this.formBuilder.array([]),
      AGE_1_2YR: this.formBuilder.array([]),
      AGE_3_5YR: this.formBuilder.array([]),
      AGE_6_12YR: this.formBuilder.array([]),
      AGE_13_18YR: this.formBuilder.array([]),
      AGE_ADULT: this.formBuilder.array([])
    });

    // subscribe to the current meal
    // this is where the initial data will reside
    this.state.currentMeal$.subscribe((currentMeal: Meal) => {
      console.log('currentMeal id = ' + currentMeal.id + '');
      this.mealForm.patchValue({'name': currentMeal.description, 'type': currentMeal.type});
      this.meal = currentMeal;
      if ( this.meal.id ) { this.state.mealFoodItemsFor( this.meal.id ); }
    });

    // get the food components
    this.state.foodComponents$.subscribe((fc: FoodComponent[]) => {
      this.foodComponents = fc.filter((c: FoodComponent) => c.parentComponent === null)
        .map((f: FoodComponent) => {return {...f, children: []};});
      fc.filter((c) => c.parentComponent !== null)
        .forEach((c) => this.foodComponents.find((p) => p.id === c.parentComponent.id).children.push(c));

    });

    // get the food items
    this.state.foodItems$.subscribe((fi: FoodItem[]) => this.food = fi);

    // when the name/type change - save the meal
    this.mealForm.valueChanges.debounceTime(3000).subscribe(() => {
      if (this.mealForm.valid && (this.mealForm.get('name').dirty || this.mealForm.get('type').dirty)) {
        this.toastr.success('Saved the meal ' + this.mealForm.get('name').value + ' (' + this.mealForm.get('type').value + ')', 'Save');
        const meal = this.buildMeal();
        this.state.updateMeal(meal);
        this.mealForm.markAsPristine();
        this.mealForm.markAsUntouched();        
      }
    });
    
    this.state.currentMealFoodItems$.subscribe( (mealFoodItems) => {
      this.clearMealFoodItems();
            
      mealFoodItems.forEach( (mealFoodItem) => {
            console.log( 'Adding ' + mealFoodItem.foodItem.description + ' to ' + mealFoodItem.ageGroup );
          (this.mealForm.get( mealFoodItem.ageGroup) as FormArray)
            .push(this.createMealFoodItem(            
              mealFoodItem.foodItem.description, 
              mealFoodItem.foodItem.foodComponent, 
              mealFoodItem.quantity.toString(), 
              mealFoodItem.units, 
              mealFoodItem.foodItem.id ) ); 
      });
    });

  }
  
  clearMealFoodItems() {
    this.AGEGROUPS.forEach( (ageGroup) => {
      const ageGroupArray = (this.mealForm.get(ageGroup) as FormArray ); 
      for ( let i = 0; i < ageGroupArray.length; i++ )  { ageGroupArray.removeAt( i ); }
    });
  }

  /**
   * Activates the given tab
   * 
   * @param tabName
   */
  activateTab(tabName: string) {
    this.activeTab = tabName;
    this.foodItems = this.mealForm.get(this.activeTab) as FormArray;
  }

  /**
   * fetches the food for the given component by filtering the full list
   * 
   * @param component {FoodComponent}
   *  
   * @returns FoodItem[]
   */
  foodForComponent(component: FoodComponent): FoodItem[] {
    return this.food.filter((fi) => fi.foodComponent.id === component.id);
  }

  /**
   * Creates a new MealFoodItem 
   * 
   * @returns FormGroup
   */
  createMealFoodItem(description: string, foodComponent: FoodComponent, quantity: string, units: string, foodItemId: string): FormGroup {
    const ctrl = this.formBuilder.group({
      mealFoodItemId: UUID.UUID(),
      description: [description, Validators.required],
      foodComponent: [foodComponent, Validators.required],
      quantity: [quantity, Validators.required],
      units: [units, Validators.required],
      foodItemId: [foodItemId, Validators.required]
    });
    
    // when the mealFoodItem changes - save it
    ctrl.valueChanges.debounceTime(3000).subscribe(($event) => {
      // we're only valid if we have a foodItemId
      if ($event.foodItemId) {
        this.state.updateMealFoodItem($event, this.activeTab, this.meal);
        this.toastr.success('Saved the meal ' + this.mealForm.get('name').value + ' (' + this.mealForm.get('type').value + ')', 'Save');
      }
    });
    return ctrl;
  }

  /**
   * Add a food component to the meal
   * 
   * @param c {FoodComponent}
   */
  addComponent(c: FoodComponent): void {
    this.foodItems = this.mealForm.get(this.activeTab) as FormArray;
    this.foodItems.push(this.createMealFoodItem( undefined, c, '1', 'each', undefined ));
  }

  /**
   * Copies an age group's components to another age group (or ALL)
   * 
   * @param ageGroup - ageGroup to copy to (can also be ALL )
   * @param [except] - agetGroup to not copy to (useful for not copying to yourself)
   */
  copyTo(ageGroup: string, except?: string): void {
    if (ageGroup === 'ALL') {
      this.AGEGROUPS.filter((ag) => ag !== except)
        .forEach((ag) => this.copyTo(ag));
    } else {

      this.foodItems = this.mealForm.get(this.activeTab) as FormArray;
      const copy: FormArray = this.mealForm.get(ageGroup) as FormArray;

      this.foodItems.controls.forEach((fic) =>
        copy.push(this.createMealFoodItem(
          fic.get('description').value,
          fic.get('foodComponent').value,
          fic.get('quantity').value,
          fic.get('units').value,
          fic.get('foodItemId').value
        )));
    }
  }

  /**
   * builds a meal object
   * 
   * @returns {Meal} 
   */
  buildMeal(): Meal {
    return {
      id: this.meal.id,
      description: this.mealForm.get('name').value,
      type: (this.mealForm.get('type').value as string).toUpperCase().replace( ' ', '_')
    };
  }

  /**
   * Removes a food component from the current active ageGroup by index
   * 
   * @param i {number}
   */
  removeComponent(i: number) {
    this.foodItems = this.mealForm.get(this.activeTab) as FormArray;
    this.state.deleteMealFoodItem( this.foodItems.at(i).get( 'mealFoodItemId' ).value );
    
    this.foodItems.removeAt(i);
  }


  /**
   * Initialize the SVG drawing
   */
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

    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate( 870,935 )'); // + this.width / 2 + ',' + this.height / 2 + ')');

  }


  /**
   * Callback when a pie segment is selected
   */
  private onClick(d: any) {
    console.log('Selected ' + d.data.component);
  }

  /**
   * draws the pie chart
   */
  private drawPie() {
    const g = this.svg.selectAll('.arc')
      .data(this.pie(this.Stats))
      .enter().append('g')
      .attr('class', 'arc')
      .on('click', this.onClick);
    g.append('path').attr('d', this.arc)
      .style('fill', (d: any) => this.color(d.data.component));
    g.append('text').attr('transform', (d: any) => 'translate(' + this.labelArc.centroid(d) + ')')

      .attr('font-size', '48')
      .text((d: any) => d.data.component);
  }

}
