import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cw-meal-pattern-help',
  templateUrl: './meal-pattern-help.component.html',
  styles: []
})
export class MealPatternHelpComponent implements OnInit {

  @Input() mealType: string;
  @Input() ageGroup: string; 
  
  constructor() { }

  ngOnInit() {
  }

}
