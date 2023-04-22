import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { ProvinceService } from './province.service';

describe('ProvincesService', () => {
  let service: ProvinceService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProvinceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('getAvailableProvinces', () => {
    it('should return the correct provinces', () => {
      const expectedProvinces = [
        'Gauteng',
        'Mpumalanga',
        'Limpopo',
        'North West',
        'Free State',
        'KwaZulu Natal',
        'Eastern Cape',
        'Western Cape',
        'Northern Cape'
      ];
      expect(service.getAvailableProvinces()).toEqual(expectedProvinces);
    });
  });

  describe('unselectAll', () => {

    it('should set unsavedChanges to true', () => {
      service.unselectAll();
      expect(service.unsavedChanges).toBeTrue();
    });

    it('should set all provinces to false', () => {
      service.currentSelection = {
        GT: true,
        MP: true,
        LM: true,
        NW: true,
        FS: true,
        KZ: true,
        EC: true,
        WC: true,
        NC: true
      };

      service.unselectAll();
      const expectedSelection = {
        GT: false,
        MP: false,
        LM: false,
        NW: false,
        FS: false,
        KZ: false,
        EC: false,
        WC: false,
        NC: false
      };
      expect(service.currentSelection).toEqual(expectedSelection);
    });
  });

  describe('getProvinceSelection', () => {
    it('should return the current selection', () => {
      const expectedSelection = {
        GT: false,
        MP: false,
        LM: false,
        NW: false,
        FS: false,
        KZ: false,
        EC: false,
        WC: false,
        NC: false
      };
      expect(service.getProvinceSelection()).toEqual(expectedSelection);
    });

    it('should return the current selection after a province is selected', () => {
      service.currentSelection = {
        GT: true,
        MP: false,
        LM: false,
        NW: false,
        FS: false,
        KZ: false,
        EC: false,
        WC: false,
        NC: false
      };
      expect(service.getProvinceSelection()).toEqual(service.currentSelection);
    });
  });

  describe('getSelectedProvinces', () => {
    it('should return an empty array if no provinces are selected', () => {
      service.currentSelection = {
        GT: false,
        MP: false,
        LM: false,
        NW: false,
        FS: false,
        KZ: false,
        EC: false,
        WC: false,
        NC: false
      };
      expect(service.getSelectedProvinces()).toEqual([]);
    });

    it('should return an array of selected provinces', () => {
      service.currentSelection = {
        GT: true,
        MP: false,
        LM: false,
        NW: false,
        FS: false,
        KZ: false,
        EC: false,
        WC: false,
        NC: false
      };
      expect(service.getSelectedProvinces()).toEqual(['GT']);
    });

    it('should return an array of selected provinces even if multiple are selected', () => {
      service.currentSelection = {
        GT: true,
        MP: false,
        LM: false,
        NW: false,
        FS: false,
        KZ: true,
        EC: false,
        WC: false,
        NC: false
      };
      expect(service.getSelectedProvinces()).toEqual(['GT', 'KZ']);
    });
  });

  describe('getProvinceName', () => {
    it('should return the correct province name', () => {
      expect(service.getProvinceName('GT')).toEqual('Gauteng');
      expect(service.getProvinceName('MP')).toEqual('Mpumalanga');
      expect(service.getProvinceName('LM')).toEqual('Limpopo');
      expect(service.getProvinceName('NW')).toEqual('North West');
      expect(service.getProvinceName('FS')).toEqual('Free State');
      expect(service.getProvinceName('KZ')).toEqual('KwaZulu Natal');
      expect(service.getProvinceName('EC')).toEqual('Eastern Cape');
      expect(service.getProvinceName('WC')).toEqual('Western Cape');
      expect(service.getProvinceName('NC')).toEqual('Northern Cape');
    });
  });

  describe('toggleProvince', () => {
    it('should set unsavedChanges to true', () => {
      expect(service.unsavedChanges).toBeFalse();
      service.toggleProvince('GT');
      expect(service.unsavedChanges).toBeTrue();
    });

    it('should set the province to true if it is false', () => {
      service.currentSelection['GT'] = false;
      service.toggleProvince('GT');
      expect(service.currentSelection['GT']).toBeTrue();
    });

    it('should set the province to false if it is true', () => {
      service.currentSelection['GT'] = true;
      service.toggleProvince('GT');
      expect(service.currentSelection['GT']).toBeFalse();
    });
  });

  describe('when intialising', () => {
    it('should request the current selection', () => {
      const expectedSelection = {
        GT: false,
        MP: false,
        LM: false,
        NW: false,
        FS: false,
        KZ: false,
        EC: false,
        WC: false,
        NC: false
      };
      const req = httpMock.expectOne('/api/users/me/notifications');
      expect(req.request.method).toEqual('GET');
      req.flush(expectedSelection);
    });
  });

  describe('API calls', () => {

    beforeEach(() => {
      let req = httpMock.expectOne('/api/users/me/notifications');
      expect(req.request.method).toEqual('GET');
      req.flush(service.getBlankSelection());
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpMock.verify();
    });

    describe('fetchProvinceSelection', () => {
      it('should return the current selection', () => {
        const expectedSelection = {
          GT: false,
          MP: true,
          LM: false,
          NW: false,
          FS: true,
          KZ: false,
          EC: false,
          WC: true,
          NC: false
        };
        service.fetchProvinceSelection();

        const req = httpMock.expectOne('/api/users/me/notifications');
        expect(req.request.method).toEqual('GET');
        req.flush(expectedSelection);

        expect(service.currentSelection).toEqual(expectedSelection);
      });
    });

    describe('resetProvinceSelection', () => {
      it('should reset the current selection', () => {
        service.currentSelection = {
          GT: true,
          MP: true,
          LM: true,
          NW: true,
          FS: true,
          KZ: true,
          EC: true,
          WC: true,
          NC: true
        };

        service.resetProvinceSelection();

        const req = httpMock.expectOne('/api/users/me/notifications');
        expect(req.request.method).toEqual('GET');
        req.flush(service.getBlankSelection());

        expect(service.currentSelection).toEqual(service.getBlankSelection());
      });
    });

    describe('saveProvinceSelection', () => {

      it('should save the current selection', () => {
        service.currentSelection = {
          GT: true,
          MP: true,
          LM: true,
          NW: true,
          FS: true,
          KZ: true,
          EC: true,
          WC: true,
          NC: true
        };
        service.unsavedChanges = true;

        service.saveProvinceSelection().subscribe();

        const req = httpMock.expectOne('/api/users/me/notifications');
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(service.currentSelection);
        req.flush(service.currentSelection);

        expect(service.unsavedChanges).toBeFalse();
      });

      it('should throw an error if the call returns an error', async () => {
        service.currentSelection = {
          GT: true,
          MP: true,
          LM: true,
          NW: true,
          FS: true,
          KZ: true,
          EC: true,
          WC: true,
          NC: true
        };
        service.unsavedChanges = true;

        service.saveProvinceSelection()
        .subscribe({
          next: () => fail('expected an error, not data'),
          error: error => expect(error.message).toEqual('Error saving notifications')
        });

        const req = httpMock.expectOne('/api/users/me/notifications');
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(service.currentSelection);
        req.flush('error', { status: 500, statusText: 'Internal Server Error' });

        expect(service.unsavedChanges).toBeTrue();
      });
    });

  });

});
