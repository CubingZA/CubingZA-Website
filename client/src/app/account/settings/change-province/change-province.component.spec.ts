import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of, throwError } from 'rxjs';

import { ChangeProvinceComponent } from './change-province.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User, UserService } from 'src/app/services/user/user.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';
import { ProvinceService } from 'src/app/services/province/province.service';



describe('ChangeProvinceComponent', () => {
  let component: ChangeProvinceComponent;
  let fixture: ComponentFixture<ChangeProvinceComponent>;

  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let provinceService: jasmine.SpyObj<ProvinceService>;
  let alerts: jasmine.SpyObj<AlertsService>;

  const dummyUser: User = {
    _id: "1",
    name: "Test Person",
    email: "test@example.com",
    role: "user",
    provider: ["local"],
    homeProvince: "GT",
    notificationSettings: {
      "GT": true,
      "MP": false,
      "LM": false,
      "NW": false,
      "FS": false,
      "KZ": false,
      "EC": false,
      "WC": false,
      "NC": false
    }
  };

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'updateHomeProvince'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'updateCurrentUser', 'isWCAUser'
    ]);
    authServiceSpy.updateCurrentUser.and.returnValue(of(dummyUser));

    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getAvailableProvincesWithNoneAndOther', 'getAvailableProvinces', 'getProvinceName'
    ]);
    provinceServiceSpy.getProvinceName.and.callFake((code: any) => {
      switch (code) {
        case "GT":
          return "Gauteng";
        case "WC":
          return "Western Cape";
        default:
          return "No province";
      }
    });
    provinceServiceSpy.getAvailableProvincesWithNoneAndOther.and.returnValue([
      "No province", "Gauteng", "Western Cape", "Other"
    ]);
    provinceServiceSpy.getAvailableProvinces.and.returnValue([
      "Gauteng", "Western Cape"
    ]);
    const alertsSpy = jasmine.createSpyObj('AlertsService', [
      'addAlert', 'clear'
    ]);

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule],
      declarations: [ChangeProvinceComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProvinceService, useValue: provinceServiceSpy },
        { provide: AlertsService, useValue: alertsSpy }
      ]
    });
    fixture = TestBed.createComponent(ChangeProvinceComponent);
    component = fixture.componentInstance;

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;

    fixture.detectChanges();
  });

  describe('when the user is not a WCA user', () => {

    beforeEach(() => {
      authService.isWCAUser.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should show a message to connect a WCA account', () => {
      const message = fixture.nativeElement;
      expect(message.textContent).toContain('Connect your WCA account');
    });

    it('should not show a dropdown to change the province', () => {
      const dropdown = fixture.nativeElement.querySelector('select');
      expect(dropdown).toBeFalsy();
    });
  });

  describe('when the user is a WCA user', () => {

    beforeEach(() => {
      authService.isWCAUser.and.returnValue(true);
      fixture.detectChanges();
    });

    it('should show a dropdown to change the province', () => {
      const dropdown = fixture.nativeElement.querySelector('select');
      expect(dropdown).toBeTruthy();
    });

    it('should not show a message to connect a WCA account', () => {
      const message = fixture.nativeElement;
      expect(message.textContent).not.toContain('Connect your WCA account');
    });

    it('should initially set the dropdown to the user\'s home province', fakeAsync(() => {
      expect(component.selectedProvince).toBe("Gauteng");
    }));

    describe('when the user selects a province', () => {

      beforeEach(() => {
        userService.updateHomeProvince.and.returnValue(of({}));
        const dropdown = fixture.nativeElement.querySelector('select');
        dropdown.value = dropdown.options[2].value;
        dropdown.dispatchEvent(new Event('change'));
        fixture.detectChanges();
      });

      it('should clear any existing alerts', () => {
        expect(alerts.clear).toHaveBeenCalled();
      });

      it('should update the user\'s home province', async () => {
        expect(userService.updateHomeProvince).toHaveBeenCalledWith("Western Cape");
      });

      it('should display a success message', () => {
        expect(alerts.addAlert).toHaveBeenCalledWith("success", "Province updated to Western Cape.");
      });
    });

    describe('when the user selects a province and the API returns an error', () => {

      beforeEach(() => {
        userService.updateHomeProvince.and.returnValue(throwError(() => "API error"));
        const dropdown = fixture.nativeElement.querySelector('select');
        dropdown.value = dropdown.options[2].value;
        dropdown.dispatchEvent(new Event('change'));
        fixture.detectChanges();
      });

      it('should display an error message', () => {
        expect(alerts.addAlert).toHaveBeenCalledWith("danger", "Error updating province");
      });
    });
  });
});
