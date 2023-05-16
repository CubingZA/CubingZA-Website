import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { SettingsComponent } from './settings.component';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UnverifiedWarningComponent } from 'src/app/components/unverified-warning/unverified-warning.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'changePassword'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLocalUser', 'hasVerifiedEmail', 'isWCAUser'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, FormsModule, ReactiveFormsModule],
      declarations: [
        SettingsComponent,
        MockComponent(UnverifiedWarningComponent),
        MockComponent(ChangePasswordComponent),
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  describe('rendering for an unverified user', () => {

    beforeEach(() => {
      authService.hasVerifiedEmail.and.returnValue(false);
      authService.isWCAUser.and.returnValue(false);
      authService.isLocalUser.and.returnValue(false);
    });

    it('should have an unverified warning', () => {
      const unverifiedWarning = fixture.nativeElement.querySelector('app-unverified-warning');
      expect(unverifiedWarning).toBeTruthy();
    });
  });

});
