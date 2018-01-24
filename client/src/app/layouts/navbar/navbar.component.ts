import {User} from '../../user/config.state';
import {Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'cw-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  @Input() user: User;
  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

  now: Date = new Date();

  constructor() {}

  ngOnInit() {
  }

  _toggleSidebar() {
    this.toggleSidebar.emit();
  }


}
