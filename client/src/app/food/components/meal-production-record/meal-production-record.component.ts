import {AppState} from '../../../app.state';
import {User} from "../../../user/config.state";
import {MealProductionRecord, MealAttendanceRecord, MealProductionFoodItem} from '../../model/meal-production-record';
import {MealType} from '../../model/meal-type';
import {MealProductionRecordService} from '../../services/meal-production-record.service';
import {OnInit, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import * as FoodActions from '../../store/food.actions';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cw-meal-production-record',
  templateUrl: './meal-production-record.component.html',
  styleUrls: ['./meal-production-record.component.css']
})
export class MealProductionRecordComponent implements OnInit {

  _mealDate = new Date();
  records: MealProductionRecord[] = [];
  activeTab: string;
  activeMpr: MealProductionRecord = undefined;
  MealType: MealType = new MealType();
  set mealDate(md: Date) {
    this._mealDate = md;
    this.mprSvc.queryByDate(this.mealDate).subscribe();
  };
  get mealDate() {
    return this._mealDate;
  }

  refresh: Subject<any> = new Subject();
  user: User;


  constructor(
    private store: Store<AppState>,
    private mprSvc: MealProductionRecordService) {
    this.store.select(s => s.config.user).subscribe(user => this.user = user);
    this.store.select(s => s.food.mealProductionRecords).subscribe(records => {this.records = records; if (records.length > 0) this.tabChanged(records[0].type);});
    this.store.select(s => s.food.activeMPR).subscribe(activeMPR => this.activeMpr = activeMPR);
  }

  ngOnInit() {
    this.mealDate = new Date();
    if (this.records.length > 0) {
      console.log('Setting active tab to ' + this.records[0].type);
      this.tabChanged(this.records[0].type);
    }
  }

  hasRecordsFor(): string[] {
    return this.MealType.ALL.filter(type => this.records.map(r => r.type).find(rt => rt === type));
  }

  mprFor(type: string): MealProductionRecord {
    return this.records.find(r => r.type == type);
  }


  attendanceChanged(attendanceRecord: MealAttendanceRecord) {
    console.log('Attendance changed');
    this.mprSvc.updateAttendance(attendanceRecord)
      .subscribe(() => this.mprSvc.fetchFoodItemsForMPR(attendanceRecord.mpr)
        .subscribe(() => this.refresh.next()));
  }

  foodItemChanged(productionFoodItem: MealProductionFoodItem) {
    console.log('FoodItemChanged');
  }

  tabChanged(type: string) {
    this.activeTab = type;
    this.store.dispatch(new FoodActions.ActivateMealProductionRecordAction(this.mprFor(type)));
  }

  setMprLock(isLocked: boolean) {
    this.mprSvc.lockMPR(this.mprFor(this.activeTab), isLocked).subscribe();
  }

}
