import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cw-meal-production-record',
  templateUrl: './meal-production-record.component.html',
  styleUrls: ['./meal-production-record.component.css']
})
export class MealProductionRecordComponent implements OnInit {

  mprDate: Date = new Date();

  constructor() {}

  ngOnInit() {
  }

}
