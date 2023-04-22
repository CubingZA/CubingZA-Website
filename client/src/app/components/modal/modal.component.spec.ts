import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule],
      declarations: [ ModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;

    component.id = 'test';

    fixture.detectChanges();
  });

  describe('controller', () => {

    describe('open', () => {
      it('should open a modal', () => {
        component.open();
        expect(component.isOpen).toBeTrue();
      });
    });

    describe('close', () => {
      it('should close a modal', () => {
        component.open();
        component.close();
        expect(component.isOpen).toBeFalse();
      });
    });
  });

  describe('component', () => {
    it('should render a modal if it is open', () => {
      component.open();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.modal-popup')).toBeTruthy();
    });

    it('should not render a modal if it is closed', () => {
      component.close();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.modal-popup')).toBeFalsy();
    });
  });

  describe('clicking the close button', () => {
    it('should close the modal', () => {
      component.open();
      fixture.detectChanges();

      fixture.nativeElement.querySelector('.modal-close-button button').click();
      fixture.detectChanges();

      expect(component.isOpen).toBeFalse();
    });
  });

  describe('clicking outside the modal', () => {
    it('should close the modal', () => {
      component.open();
      fixture.detectChanges();

      fixture.nativeElement.querySelector('.modal-background-overlay').click();
      fixture.detectChanges();

      expect(component.isOpen).toBeFalse();
    });
  });

});
