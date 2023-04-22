import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { ModalComponent } from './modal.component';
import { MockComponent } from 'ng-mocks';
import { ElementRef } from '@angular/core';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  describe('add', () => {
    it('should add a modal', () => {
      const mockElement = new ElementRef(document.createElement('div'));
      const modal = new ModalComponent(service, mockElement);
      modal.id = 'test';

      service.add(modal);
      expect(service['modals'].length).toBe(1);
      expect(service['modals'][0]).toBe(modal);
    });

    it('should throw an error if modal id is not defined', () => {
      const mockElement = new ElementRef(document.createElement('div'));
      const modal = new ModalComponent(service, mockElement);

      expect(() => service.add(modal)).toThrowError('Modal element must define an id');
    });

    it('should throw an error if modal id already exists', () => {
      const mockElement = new ElementRef(document.createElement('div'));
      const modal = new ModalComponent(service, mockElement);
      modal.id = 'test';

      service.add(modal);

      expect(() => service.add(modal)).toThrowError('Modal with id test already exists');
    });
  });

  describe('remove', () => {
    it('should remove a modal', () => {
      const mockElement = new ElementRef(document.createElement('div'));
      const modal = new ModalComponent(service, mockElement);
      modal.id = 'test';

      service.add(modal);
      service.remove(modal);
      expect(service['modals'].length).toBe(0);
    });
  });

  describe('open', () => {
    it('should open a modal', () => {
      const mockElement = new ElementRef(document.createElement('div'));
      const modal = new ModalComponent(service, mockElement);
      modal.id = 'test';

      service.add(modal);
      service.open('test');
      expect(modal.isOpen).toBeTrue();
      expect(document.body.classList.contains('has-open-modal')).toBeTrue();
    });

    it('should throw an error if modal id is not found', () => {
      expect(() => service.open('test')).toThrowError('Modal with id test not found');
    });
  });

  describe('close', () => {
    it('should close a modal', () => {
      const mockElement = new ElementRef(document.createElement('div'));
      const modal = new ModalComponent(service, mockElement);
      modal.id = 'test';

      service.add(modal);
      service.open('test');
      service.close('test');
      expect(modal.isOpen).toBeFalse();
      expect(document.body.classList.contains('has-open-modal')).toBeFalse();
    });

    it('should not throw an error if modal id is not found', () => {
      expect(() => service.close('test')).not.toThrowError();
    });
  });
});
