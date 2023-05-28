import { TestBed } from '@angular/core/testing';

import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsService);
  });

  describe('getEventName', () => {
    it('should return the name of the event', () => {
      expect(service.getEventName('333')).toEqual('3x3x3 Cube');
    });

    it('should return the name of another event', () => {
      expect(service.getEventName('pyram')).toEqual('Pyraminx');
    });

    it('should return an empty string for an unknown event', () => {
      expect(service.getEventName('unknown')).toEqual('');
    });
  });
});
