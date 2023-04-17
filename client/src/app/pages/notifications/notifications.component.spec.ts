import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { NotificationsComponent } from './notifications.component';
import { ProvinceService } from 'src/app/services/province/province.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UnverifiedWarningComponent } from 'src/app/components/unverified-warning/unverified-warning.component';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  let provinceService: jasmine.SpyObj<ProvinceService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getProvinceSelection', 'resetProvinceSelection'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'hasVerifiedEmail'
    ]);

    await TestBed.configureTestingModule({
      declarations: [
        NotificationsComponent,
        MockComponent(UnverifiedWarningComponent)
      ],
      providers: [
        { provide: ProvinceService, useValue: provinceServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;

    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
