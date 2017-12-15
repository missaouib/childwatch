import {AppState} from '../../../app.state';
import {MealProductionRecord, MealAttendanceRecord, MealProductionFoodItem} from '../../model/meal-production-record';
import {MealType} from '../../model/meal-type';
import {MealProductionRecordService} from '../../services/meal-production-record.service';
import {OnInit, Component} from '@angular/core';
import {Store} from '@ngrx/store';

@Component({
  selector: 'cw-meal-production-record',
  templateUrl: './meal-production-record.component.html',
  styleUrls: ['./meal-production-record.component.css']
})
export class MealProductionRecordComponent implements OnInit {

  records: MealProductionRecord[] = [];
  activeTab: string = 'BREAKFAST';
  MealType: MealType = new MealType();
  mealDate: Date = new Date();

  constructor(
    private store: Store<AppState>,
    private mprSvc: MealProductionRecordService) {}

  ngOnInit() {
    this.mprSvc.queryByDate(this.mealDate).subscribe();
    this.store.select(s => this.records = s.food.mealProductionRecords).subscribe(records => this.records = records);
  }

  activateTab(tab: string) {
    this.activeTab = tab;
  }

  hasRecordsFor(): string[] {
    return this.MealType.ALL.filter(type => this.records.map(r => r.type).find(rt => rt === type));
  }

  attendanceChanged(attendanceRecord: MealAttendanceRecord) {
    console.log('Attendance changed');
  }

  foodItemUnitChanged(productionFoodItem: MealProductionFoodItem) {
    console.log('FoodItemUnitChanged');
  }

  foodItemPreparedChanged(productionFoodItem: MealProductionFoodItem) {
    console.log('FoodItemPreparedChanged');
  }
}
