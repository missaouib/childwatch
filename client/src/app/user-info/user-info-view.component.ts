import { Component, Input } from '@angular/core';

import { User } from '../security/interfaces';

@Component({
  selector: 'cw-user-info-view',
  templateUrl: './user-info-view.component.html'
})
export class UserInfoViewComponent {
  @Input()
  public user: User;
}
