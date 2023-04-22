import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsComponent } from './alerts.component';
import { AlertsService } from './alerts.service';

describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;

  let alerts: AlertsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    alerts = TestBed.inject(AlertsService);
  });

  describe('hasAlerts', () => {
    it('should return true if there are alerts', () => {
      alerts.addAlert("danger", "Test Alert");
      expect(component.hasAlerts()).toBeTrue();
    });

    it('should return false if there are no alerts', () => {
      expect(component.hasAlerts()).toBeFalse();
    });
  });

  describe('getAlerts', () => {
    it('should return the alerts', () => {
      alerts.addAlert("danger", "Test Alert");
      expect(component.getAlerts()).toEqual(alerts.getAlerts());
    });
  });

  describe('removeAlert', () => {
    it('should remove the alert', () => {
      alerts.addAlert("danger", "Test Alert");
      component.removeAlert(alerts.getAlerts()[0]);
      expect(component.getAlerts()).toEqual([]);
    });
  });

  describe('when there are alerts', () => {

    describe('the alert', () => {
      it('should have the correct class', () => {
        alerts.addAlert("danger", "Test Alert");
        fixture.detectChanges();

        const alert = fixture.nativeElement.querySelector('.alert');
        expect(alert.classList).toContain('alert-danger');
      });

      it('should have the correct message', () => {
        alerts.addAlert("danger", "Test Alert");
        fixture.detectChanges();

        const alert = fixture.nativeElement.querySelector('.alert');
        expect(alert.textContent).toContain('Test Alert');
      });
    });

    describe('clicking the close button', () => {
      it('should remove the alert', () => {
        alerts.addAlert("danger", "Test Alert");
        fixture.detectChanges();

        const closeButton = fixture.nativeElement.querySelector('button');
        closeButton.click();
        fixture.detectChanges();

        expect(component.getAlerts()).toEqual([]);
      });
    });
  });
});
