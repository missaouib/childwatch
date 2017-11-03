import {Component, OnInit, ViewEncapsulation, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'cw-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  _sidebarOpen = true;

  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {
  }

  _toggleSidebar() {
    this._sidebarOpen = !this._sidebarOpen;
    this.toggleSidebar.emit(this._sidebarOpen);
  }


}