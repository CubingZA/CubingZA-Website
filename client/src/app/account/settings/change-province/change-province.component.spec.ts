import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProvinceComponent } from './change-province.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';
import { MockComponent } from 'ng-mocks';
import { ProvinceService } from 'src/app/services/province/province.service';
import { of } from 'rxjs';

describe('ChangeProvinceComponent', () => {
  let component: ChangeProvinceComponent;
  let fixture: ComponentFixture<ChangeProvinceComponent>;

  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let provinceService: jasmine.SpyObj<ProvinceService>;
  let alerts: jasmine.SpyObj<AlertsService>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'updateHomeProvince'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'updateCurrentUser', 'isWCAUser'
    ]);
    authServiceSpy.updateCurrentUser.and.returnValue(of({}));
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getAvailableProvincesWithNoneAndOther', 'getAvailableProvinces'
    ]);
    const alertsSpy = jasmine.createSpyObj('AlertsService', [
      'addAlert', 'clear'
    ]);

    TestBed.configureTestingModule({
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
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
