import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

import { Entity } from '../../family.interfaces';

@Component({
  selector: 'cw-family-details-view',
  templateUrl: './family-details.view.component.html',
})
export class FamilyDetailsViewComponent {

  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];

  @Input() selectedFamily: Entity;
  @Input() set familyMembers(values: Entity[]) {
    this.tableRows = _.cloneDeep(values);
  };
  @Input() set previewMembers(value: Entity[]) {
    // clear the previous set of selections
    this.selectedTableRows = [];
    value.forEach(member => {
      // look up entry in local copy of state and copy it to the selectedTableRows list
      this.selectedTableRows.push(this.tableRows.find(row => row.id === member.id));
    })
  };
  @Output() selectedMembers = new EventEmitter<Entity[]>();

  // Grid mutates data, the following are local copies that are safe for mutation
  // and persistant local state
  tableRows: Entity[];
  selectedTableRows: Entity[];

  constructor() { }

  // ngx-datatable is the source of the event
  memberSelected(selectedMembers: { selected: Entity[] }) {
    this.selectedMembers.emit(selectedMembers.selected);
  }
}
