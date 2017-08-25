import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'cw-menu-calendar-header',
  template: `
        
    <br>
  `
})
export class MenuCalendarHeaderComponent  {

@Input() view: string;

  @Input() viewDate: Date;

  @Input() locale = 'en';

  @Output() viewChange: EventEmitter<string> = new EventEmitter();

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();

}
