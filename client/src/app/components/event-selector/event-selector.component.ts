import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompEvent, EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-event-selector',
  templateUrl: './event-selector.component.html',
  styleUrls: ['./event-selector.component.less']
})
export class EventSelectorComponent {

  @Input() eventId: string = '';

  @Output() eventChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private eventService: EventsService
  ) { }

  selectEvent(eventId: string): void {
    this.eventChange.emit(eventId);
  }

  getEvents(): CompEvent[] {
    return this.eventService.getEvents();
  }

  isActive(eventId?: string): boolean {
    if (this.eventId === '') {
      return true;
    }
    return this.eventId === eventId;
  }
}
