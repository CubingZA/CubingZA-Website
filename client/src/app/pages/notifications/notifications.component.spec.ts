import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { NotificationsComponent } from './notifications.component';
import { ProvinceService } from 'src/app/services/province/province.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UnverifiedWarningComponent } from 'src/app/components/unverified-warning/unverified-warning.component';
import { ProvinceListComponent } from 'src/app/components/province-list/province-list.component';
import { ProvinceMapComponent } from 'src/app/components/province-map/province-map.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { throwError } from 'rxjs';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

const mockProvinceSelection = {
  GT: true,
  MP: false,
  LM: false,
  NW: false,
  FS: false,
  KZ: false,
  EC: false,
  WC: true,
  NC: false
};

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  let provinceService: jasmine.SpyObj<ProvinceService>;
  let authService: jasmine.SpyObj<AuthService>;
  let alerts: jasmine.SpyObj<AlertsService>;

  beforeEach(async () => {
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getProvinceSelection', 'resetProvinceSelection',
      'getSelectedProvinces' , 'saveProvinceSelection',
      'hasUnsavedChanges', 'unselectAll'
    ]);
    provinceServiceSpy.getProvinceSelection.and.returnValue(mockProvinceSelection);
    provinceServiceSpy.getSelectedProvinces.and.returnValue(['GT', 'WC']);

    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'hasVerifiedEmail'
    ]);
    authServiceSpy.hasVerifiedEmail.and.returnValue(true);
    const alertsSpy = jasmine.createSpyObj('AlertsService', [
      'addAlert', 'clear'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule],
      declarations: [
        NotificationsComponent,
        MockComponent(UnverifiedWarningComponent),
        MockComponent(ProvinceListComponent),
        MockComponent(ProvinceMapComponent)
      ],
      providers: [
        { provide: ProvinceService, useValue: provinceServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AlertsService, useValue: alertsSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;

    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;

    fixture.detectChanges();
  });

  describe('rendering', () => {

    describe('hiding for unverified users', () => {

      it('should include an unverified warning component', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('app-unverified-warning')).toBeTruthy();
      });

      it('should hide the component if the user has not verified their email', () => {
        authService.hasVerifiedEmail.and.returnValue(false);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.textContent).not.toContain('Select provinces on the map below');
      });
    });

    describe('showing for verified users', () => {

      it('should show the component if the user has verified their email', () => {
        authService.hasVerifiedEmail.and.returnValue(true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.textContent).toContain('Select provinces on the map below');
      });

      it('should include a province list component', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('app-province-list')).toBeTruthy();
      });

      it('should include a province map component', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('app-province-map')).toBeTruthy();
      });
    });
  });

  describe('the clear button', () => {

    it('should not show the clear button if there are no provinces selected', () => {
      provinceService.getSelectedProvinces.and.returnValue([]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('#notifications-clear-button')).toBeNull();
    });

    it('should show the clear button if there are provinces selected', () => {
      provinceService.getSelectedProvinces.and.returnValue(['GT', 'WC']);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('#notifications-clear-button')).toBeTruthy();
    });

    it('should call the province service to clear the selection when clicked', () => {
      provinceService.getSelectedProvinces.and.returnValue(['GT', 'WC']);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      compiled.querySelector('#notifications-clear-button').click();
      expect(provinceService.unselectAll).toHaveBeenCalled();
    });
  });

  describe('the save/disable notifications button', () => {

    describe('showing and hiding', () => {

      it('should not show the Disable Notifications button if there are no provinces selected', () => {
        provinceService.getSelectedProvinces.and.returnValue([]);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('#notifications-save-button')).toBeNull();
        expect(compiled.querySelector('#notifications-disable-button')).toBeTruthy();
      });

      it('should disable the Save Notifications button if there are no unsaved changes', () => {
        provinceService.hasUnsavedChanges.and.returnValue(false);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('#notifications-save-button').disabled).toBeTrue();
      });

      it('should disable the Disable Notifications button if there are no unsaved changes', () => {
        provinceService.getSelectedProvinces.and.returnValue([]);
        provinceService.hasUnsavedChanges.and.returnValue(false);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('#notifications-disable-button').disabled).toBeTrue();
      });

      it('should enable the Save Notifications button if there are unsaved changes', () => {
        provinceService.hasUnsavedChanges.and.returnValue(true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('#notifications-save-button').disabled).toBeFalse();
      });

      it('should enable the Disable Notifications button if there are unsaved changes', () => {
        provinceService.getSelectedProvinces.and.returnValue([]);
        provinceService.hasUnsavedChanges.and.returnValue(true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('#notifications-disable-button').disabled).toBeFalse();
      });
    });

    describe('when the Save Notifications button is clicked', () => {

      beforeEach(() => {
        provinceService.hasUnsavedChanges.and.returnValue(true);
        fixture.detectChanges();
      });

      it('should save the province selection', () => {
        const compiled = fixture.nativeElement;
        compiled.querySelector('#notifications-save-button').click();
        expect(provinceService.saveProvinceSelection).toHaveBeenCalled();
      });

      it('should handle errors', () => {
        provinceService.saveProvinceSelection.and.returnValue(throwError(()=> new Error('test error')));
        const compiled = fixture.nativeElement;
        compiled.querySelector('#notifications-save-button').click();
        fixture.detectChanges();

        expect(alerts.clear).toHaveBeenCalled();
        expect(alerts.addAlert).toHaveBeenCalledWith('danger', 'Error saving province selection');
      });
    });

    describe('when the Disable Notifications button is clicked', () => {

      beforeEach(() => {
        provinceService.getSelectedProvinces.and.returnValue([]);
        provinceService.hasUnsavedChanges.and.returnValue(true);
        fixture.detectChanges();
      });

      it('should save the province selection', () => {
        const compiled = fixture.nativeElement;
        compiled.querySelector('#notifications-disable-button').click();
        expect(provinceService.saveProvinceSelection).toHaveBeenCalled();
      });

      it('should handle errors', () => {
        provinceService.saveProvinceSelection.and.returnValue(throwError(()=> new Error('test error')));
        const compiled = fixture.nativeElement;
        compiled.querySelector('#notifications-disable-button').click();
        fixture.detectChanges();

        expect(alerts.clear).toHaveBeenCalled();
        expect(alerts.addAlert).toHaveBeenCalledWith('danger', 'Error saving province selection');
      });
    });
  });

  describe('the reset changes button', () => {

    it('should not show the button if there are no unsaved changes', () => {
      provinceService.hasUnsavedChanges.and.returnValue(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('#notifications-reset-button')).toBeNull();
    });

    it('should show the button if there are unsaved changes', () => {
      provinceService.hasUnsavedChanges.and.returnValue(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('#notifications-reset-button')).toBeTruthy();
    });

    it('should call the province service to reset the changes when clicked', () => {
      provinceService.hasUnsavedChanges.and.returnValue(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      compiled.querySelector('#notifications-reset-button').click();
      expect(provinceService.resetProvinceSelection).toHaveBeenCalled();
    });
  });
});
