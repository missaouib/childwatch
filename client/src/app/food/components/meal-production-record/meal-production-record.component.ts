import {MealProductionRecord, ProductionFoodItem, AttendanceRecordSet} from '../../model/meal-production-record';
import {MealProductionRecordService} from '../../services/meal-production-record.service';
import {OnInit, Component} from '@angular/core';

@Component({
  selector: 'cw-meal-production-record',
  templateUrl: './meal-production-record.component.html',
  styleUrls: ['./meal-production-record.component.css']
})
export class MealProductionRecordComponent implements OnInit {

  mpr: MealProductionRecord;
  activeTab: string = 'breakfast';

  constructor(
    private mprSvc: MealProductionRecordService) {}

  ngOnInit() {
    this.mprSvc.queryByDate(new Date()).subscribe((mpr) => this.mpr = mpr);

  }


  attendanceForTab(tab: string): AttendanceRecordSet {
    switch (tab) {
      case 'Breakfast': return this.mpr.breakfast ? this.mpr.breakfast.attendance : undefined;
      case 'AM Snack': return this.mpr.am_snack ? this.mpr.am_snack.attendance : undefined;
      case 'Lunch': return this.mpr.lunch ? this.mpr.lunch.attendance : undefined;
      case 'PM Snack': return this.mpr.pm_snack ? this.mpr.pm_snack.attendance : undefined;
      case 'Dinner': return this.mpr.dinner ? this.mpr.dinner.attendance : undefined;
      default: return undefined;
    }

  }

  foodItemsForTab(tab: string): ProductionFoodItem[] {
    switch (tab) {
      case 'Breakfast': return this.mpr.breakfast ? this.mpr.breakfast.foodItems : undefined;
      case 'AM Snack': return this.mpr.am_snack ? this.mpr.am_snack.foodItems : undefined;
      case 'Lunch': return this.mpr.lunch ? this.mpr.lunch.foodItems : undefined;
      case 'PM Snack': return this.mpr.pm_snack ? this.mpr.pm_snack.foodItems : undefined;
      case 'Dinner': return this.mpr.dinner ? this.mpr.dinner.foodItems : undefined;
      default: return undefined;
    }
  }

  activateTab(tab: string) {
    this.activeTab = tab;
  }

}
