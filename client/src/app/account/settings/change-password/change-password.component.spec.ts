import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ChangePasswordComponent } from './change-password.component';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UnverifiedWarningComponent } from 'src/app/components/unverified-warning/unverified-warning.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'changePassword'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLocalUser', 'hasVerifiedEmail', 'isWCAUser'
    ]);

    TestBed.configureTestingModule({
      imports: [FontAwesomeModule, FormsModule, ReactiveFormsModule],
      declarations: [
        ChangePasswordComponent
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    fixture = TestBed.createComponent(ChangePasswordComponent);
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

    it('should not have a form', () => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeFalsy();
    });

    it('should not have a WCA login notice', () => {
      const wcaLoginNotice = fixture.nativeElement.querySelector('#wca-login-notice');
      expect(wcaLoginNotice).toBeFalsy();
    });
  });


  describe('rendering for a WCA user', () => {

    beforeEach(() => {
      authService.isWCAUser.and.returnValue(true);
      authService.isLocalUser.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should not have a form', () => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeFalsy();
    });

    it('should have a WCA login notice', () => {
      const wcaLoginNotice = fixture.nativeElement.querySelector('.wca-login-notice');
      expect(wcaLoginNotice).toBeTruthy();
    });
  });

  describe('rendering for a local user', () => {

    beforeEach(() => {
      authService.isWCAUser.and.returnValue(false);
      authService.isLocalUser.and.returnValue(true);
      fixture.detectChanges();
    });

    it('should not have a WCA login notice', () => {
      const wcaLoginNotice = fixture.nativeElement.querySelector('.wca-login-notice');
      expect(wcaLoginNotice).toBeFalsy();
    });

    it('should have a form with old password, new password, and confirm password fields', () => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeTruthy();

      const oldPassword = fixture.nativeElement.querySelector('#oldPassword');
      expect(oldPassword).toBeTruthy();

      const newPassword = fixture.nativeElement.querySelector('#password');
      expect(newPassword).toBeTruthy();

      const confirmPassword = fixture.nativeElement.querySelector('#confirmPassword');
      expect(confirmPassword).toBeTruthy();
    });
  });

  describe('submitting the form', () => {

    beforeEach(() => {
      authService.isWCAUser.and.returnValue(false);
      authService.isLocalUser.and.returnValue(true);
      fixture.detectChanges();
    });

    it('should call UserService.updateUser with the new password', () => {
      const oldPassword = 'oldPassword';
      const newPassword = 'newPassword';
      const confirmPassword = 'newPassword';

      const form = fixture.nativeElement.querySelector('form');
      const oldPasswordInput = fixture.nativeElement.querySelector('#oldPassword');
      const newPasswordInput = fixture.nativeElement.querySelector('#password');
      const confirmPasswordInput = fixture.nativeElement.querySelector('#confirmPassword');

      oldPasswordInput.value = oldPassword;
      oldPasswordInput.dispatchEvent(new Event('input'));
      newPasswordInput.value = newPassword;
      newPasswordInput.dispatchEvent(new Event('input'));
      confirmPasswordInput.value = confirmPassword;
      confirmPasswordInput.dispatchEvent(new Event('input'));

      form.dispatchEvent(new Event('submit'));

      expect(userService.changePassword).toHaveBeenCalledWith(oldPassword, newPassword);
    });
  });
});
