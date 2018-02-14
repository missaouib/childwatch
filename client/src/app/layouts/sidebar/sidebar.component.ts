import {User} from '../../user/config.state';
import {UserService} from "../../user/user.service";
import {MenuItem, ChildMenuItem} from "../menu-item";
import {Component, OnInit, Input} from '@angular/core';
import {Subject} from "rxjs/Subject";
import * as MENU_INFO from '../menu.json';

@Component({
  selector: 'cw-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  _user: User = undefined;

  @Input() user: User;


  refresh: Subject<any> = new Subject();

  MENU: MenuItem[] = (<any>MENU_INFO).menu;

  constructor(public userSvc: UserService) {}

  ngOnInit() {}

  hasRequiredRole(required: string[]): boolean {
    if (!required || required.length === 0) {return true;}
    else return required.find(role => this.user.authorities.find(authority => authority === role) !== undefined) !== undefined;
  }

  canShow(route: ChildMenuItem): boolean {
    return this.hasRequiredRole(route.requireRole) && !route.disabled;
  }

  isAdminCW(): boolean {
    return this.user && this.user.authorities.find(authority => authority === 'ADMIN-CW') != undefined;
  }

  backUrl(): string {
    return this.userSvc.backUrl || 'http://online.childwatch.com';
  }
}

