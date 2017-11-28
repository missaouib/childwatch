import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'cw-menuprintdialog',
  templateUrl: './menu-print-dialog.component.html',
  styleUrls: ['./menu-print-dialog.component.css']
})
export class MenuPrintDialogComponent implements OnInit {

  title: string;
  list: any[] = [];
  minDate = new Date(2017, 5, 10);
  maxDate = new Date(2018, 9, 15);
  bsValue: Date = new Date();
  bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];


  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
    this.list.push("an item");
  }

  changed(dpr: any) {
    console.log(dpr);
  }
}
