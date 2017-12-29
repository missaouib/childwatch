import {User} from '../../../user/config.state';
import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'cw-menuprintdialog',
  templateUrl: './menu-print-dialog.component.html',
  styleUrls: ['./menu-print-dialog.component.css']
})
export class MenuPrintDialogComponent implements OnInit {

  title: string;
  bsValue: Date = new Date();
  user: User;
  showInfant = false;

  constructor(
    public bsModalRef: BsModalRef,
  ) {}

  ngOnInit() {
    this.roundToMonday();
  }

  roundToMonday() {
    let sub = moment(this.bsValue).isoWeekday() - 1;

    if (sub == 6) {sub = -1;}

    const monday = moment(this.bsValue).add(-sub, "days");
    this.bsValue = monday.toDate();
  }

  getDateValue(): String {
    let sub = moment(this.bsValue).isoWeekday() - 1;

    if (sub == 6) {sub = -1;}

    const monday = moment(this.bsValue).add(-sub, "days");
    return monday.format('YYYY-MM-DD');
  }
}
