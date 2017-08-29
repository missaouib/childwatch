import { FoodComponent, Meal } from '../food.interfaces';
import { FoodStateService } from '../services/food-state.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'cw-meal-builder',
  templateUrl: './meal-builder.component.html',
  styleUrls: ['./meal-builder.component.css']
})
export class MealBuilderComponent implements OnInit {
  @ViewChild("containerPieChart") element: ElementRef;
  
title: string = 'D3.js with Angular 2!';
  subtitle: string = 'Pie Chart';

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
  
  meal: Meal = {
    id: undefined,
    description: undefined,
    type: undefined,
    mealFoodItems: []
  };
  
  private Colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
  
  Stats: any[] = [
  {component: "MILK", population: 2, color: '#98abc5' },
  {component: "VEGETABLES/FRUIT", population: 1, color: '#8a89a6'},
  {component: "GRAINS", population: 2, color: '#7b6888' }
];
  

  constructor(
    private state: FoodStateService,
    private formBuilder: FormBuilder
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
  }

  ngOnInit() {
      this.initSvg();
      this.drawPie();
      this.mealForm = this.formBuilder.group({
        name: 'Breakfast #124',
        type: 'Breakfast',
        foodItems: this.formBuilder.array([])
      });
  }
  
  createComponent(component:FoodComponent): FormGroup {
    return this.formBuilder.group( { 
      foodItem: '',
      type: component.description,
      quantity: '1',
      uom: 'each'
    });
  }
  
  addComponent(c: FoodComponent): void {
    this.foodItems = this.mealForm.get('foodItems') as FormArray;
    this.foodItems.push( this.createComponent(c) );    
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
