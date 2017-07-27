import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Participant, Family } from '../../family.interfaces';
import { FamilyInfoService } from '../../family-info.service';

@Component({
  selector: 'cw-family-details',
  templateUrl: './family-details.component.html',
})
export class FamilyDetailsComponent {

  selectedFamily: Observable<Family>;
  familyMembers: Observable<Participant[]>;
  previewMembers: Observable<Participant[]>;
  constructor(private fis: FamilyInfoService) {
    this.selectedFamily = fis.selectedEntity as Observable<Family>;
    this.familyMembers = fis.selectedFamilyMembers as Observable<Participant[]>;
    this.previewMembers = fis.previewMembers as Observable<Participant[]>;
  }
  selectedMembers(members: Participant[]) {
    this.fis.viewingMembers(members);
  }
}
