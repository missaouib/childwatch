import { Meal, Menu } from '../food.interfaces';
import { FoodStateService } from '../services/food-state.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'cw-menu-screen',
  templateUrl: './menu-screen.component.html',
  styleUrls: ['./menu-screen.component.css'],
})
export class MenuScreenComponent implements OnInit {
    Meals: Meal[];
    show = true;
    id: number = undefined;
    weekStart: Date = undefined;
    weekEnd: Date = undefined;
    Menus: Menu[];
    days: Date[] = undefined;

  constructor(
    private state: FoodStateService
  ) {
    this.state.meals$.subscribe( ms => this.Meals = ms );
    this.state.menus$.subscribe( m => this.Menus = m );
   }

  ngOnInit() {
    this.days = new Array<Date>();

    for ( let i = 1; i <= 5; i++ ) {
      this.days.push( moment().startOf('week').add( i, 'day').toDate() );
    }
    this.weekStart = this.days[0];
    this.weekEnd = this.days[4];
    this.state.adjustMenuTime( this.weekStart, this.weekEnd );
  }

  changed( id: number, state: boolean ) {
    this.id = (state) ? id : undefined;
    this.show = !state;
    console.log( 'id:' + this.id + '; show=' + this.show );
  }

  adjustTime( addWeek: number ) {
    this.days = this.days.map( (day) => moment(day).add( addWeek, 'week' ).toDate() );

    this.weekStart = this.days[0];
    this.weekEnd = this.days[4];
    this.state.adjustMenuTime( this.weekStart, this.weekEnd );
  }

}
