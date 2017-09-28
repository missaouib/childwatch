import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'basic-layout',
  templateUrl: './basic-layout.component.html',
  styles: []
})
export class BasicLayoutComponent implements OnInit {

  
  constructor(
    private router: Router 
  ) { }

  ngOnInit() {}

  navToCalendar() {
    this.router.navigate( ['/meals'] );
  }
}
