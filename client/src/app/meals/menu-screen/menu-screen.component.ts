import { Meal, Menu } from '../meal.interfaces';
import { MealStateService } from '../services/meal-state.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'cw-menu-screen',
  templateUrl: './menu-screen.component.html',
  styleUrls: ['./menu-screen.component.css']
})
export class MenuScreenComponent implements OnInit {
    Meals: Meal[];
    show = true;
    id: number = undefined;
    weekStart: Date = undefined;
    weekEnd: Date = undefined;
    Menus: Menu[];

  constructor(private state: MealStateService) {
    this.state.meals$.subscribe( ms => this.Meals = ms );
    this.state.menus$.subscribe( m => this.Menus = m );
   }

  ngOnInit() {
    this.weekStart = moment().startOf('week').add( 1, 'day').toDate();
    this.weekEnd = moment().startOf('week').add( 5, 'day').toDate();
    this.state.adjustMenuTime( this.weekStart, this.weekEnd );
  }

  changed( id: number, state: boolean ) {
    this.id = (state) ? id : undefined;
    this.show = !state;
    console.log( 'id:' + this.id + '; show=' + this.show );
  }

  adjustTime( addWeek: number ) {
    this.weekStart = moment(this.weekStart).add( addWeek, 'week' ).toDate();
    this.weekEnd = moment(this.weekEnd).add( addWeek, 'week' ).toDate();
    this.state.adjustMenuTime( this.weekStart, this.weekEnd );
  }

}
