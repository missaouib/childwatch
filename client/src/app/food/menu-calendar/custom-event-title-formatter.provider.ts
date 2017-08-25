import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor() {
    super();
  }
  
  month( event: CalendarEvent ){
    return `${event.meta.description}`;  
  }
  
}