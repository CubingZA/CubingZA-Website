import { TestBed } from '@angular/core/testing';

import { AlertsService } from './alerts.service';

describe('AlertsService', () => {
  let service: AlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertsService);
  });

  describe('addAlert', () => {
    it('should add an alert', () => {
      service.addAlert('success', 'test');
      expect(service.alerts.length).toBe(1);
    });

    it('should add an alert with a random id', () => {
      service.addAlert('success', 'test');
      expect(service.alerts[0]._id).not.toBeUndefined();
    });

    it('should add an alert with the correct type', () => {
      service.addAlert('success', 'test');
      expect(service.alerts[0].type).toBe('success');
    });

    it('should add an alert with the correct message', () => {
      service.addAlert('success', 'test');
      expect(service.alerts[0].message).toBe('test');
    });
  });

  describe('getAlerts', () => {
    it('should return the alerts', () => {
      service.addAlert('success', 'test');
      expect(service.getAlerts()).toEqual(service.alerts);
    });
  });

  describe('removeAlert', () => {
    it('should remove an alert', () => {
      service.addAlert('success', 'test');
      service.removeAlert(service.alerts[0]);
      expect(service.alerts.length).toBe(0);
    });

    it('should remove only the alert with the correct id', () => {
      service.addAlert('success', 'test');
      service.addAlert('success', 'test');

      const removeId = service.alerts[0]._id;

      service.removeAlert(service.alerts[0]);
      expect(service.alerts.length).toBe(1);
      expect(service.alerts[0]._id).not.toBe(removeId);
    });
  });

  describe('clear', () => {
    it('should clear all alerts', () => {
      service.addAlert('success', 'test');
      service.addAlert('success', 'test');
      service.clear();
      expect(service.alerts.length).toBe(0);
    });
  });
});
