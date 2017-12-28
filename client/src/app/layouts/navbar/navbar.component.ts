import {User} from '../../config/config.state';
import {Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'cw-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  _sidebarOpen = true;

  @Input() user: User;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {
  }

  _toggleSidebar() {
    this._sidebarOpen = !this._sidebarOpen;
    this.toggleSidebar.emit(this._sidebarOpen);
  }


}
