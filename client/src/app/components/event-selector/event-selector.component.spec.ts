import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSelectorComponent } from './event-selector.component';

describe('EventSelectorComponent', () => {
  let component: EventSelectorComponent;
  let fixture: ComponentFixture<EventSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventSelectorComponent]
    });
    fixture = TestBed.createComponent(EventSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('rendering', () => {
    it('should have an all button', () => {
      expect(fixture.nativeElement.textContent).toContain('All');
    });

    it('should have a button for each event', () => {
      const buttons = fixture.nativeElement.querySelectorAll('a');
      expect(buttons.length).toEqual(18);
    });
  });

  describe('clicking', () => {
    it('should emit an event when the "All" button is clicked', () => {
      spyOn(component.eventChange, 'emit');
      const button = fixture.nativeElement.querySelector('#event-selector-all');
      button.click();
      expect(component.eventChange.emit).toHaveBeenCalledWith('');
    });

    it('should emit an event when a button is clicked', () => {
      spyOn(component.eventChange, 'emit');
      const button = fixture.nativeElement.querySelector('#event-selector-333');
      button.click();
      expect(component.eventChange.emit).toHaveBeenCalledWith('333');
    });

    it('should emit a different event when a different button is clicked', () => {
      spyOn(component.eventChange, 'emit');
      const button = fixture.nativeElement.querySelector('#event-selector-444');
      button.click();
      expect(component.eventChange.emit).toHaveBeenCalledWith('444');
    });

  });
});
