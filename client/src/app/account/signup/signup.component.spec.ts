import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of } from 'rxjs';

import { SignupComponent } from './signup.component';
import { EmailService } from 'src/app/services/email/email.service';
import { EmailCheckService } from 'src/app/services/email/email-check.service';
import { AuthService } from 'src/app/services/auth/auth.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  let emailService: jasmine.SpyObj<EmailService>;
  let emailCheckService: jasmine.SpyObj<EmailCheckService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const emailServiceSpy = jasmine.createSpyObj('EmailService', [
      'sendVerificationEmail'
    ]);
    const emailCheckServiceSpy = jasmine.createSpyObj('EmailCheckService', [
      'checkEmail', 'hasDidYouMean', 'getDidYouMean', 'useDidYouMean', 'setDidYouMean'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'register', 'startWcaLogin'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, FormsModule, ReactiveFormsModule],
      declarations: [ SignupComponent ],
      providers: [
        { provide: EmailService, useValue: emailServiceSpy },
        { provide: EmailCheckService, useValue: emailCheckServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;

    emailService = TestBed.inject(EmailService) as jasmine.SpyObj<EmailService>;
    emailCheckService = TestBed.inject(EmailCheckService) as jasmine.SpyObj<EmailCheckService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  describe('rendering', () => {
    it('should have a WCA login button', () => {
      const wcaLoginButton = fixture.nativeElement.querySelector('#wca-login-button');
      expect(wcaLoginButton).toBeTruthy();
    });

    it('should have a local signup button', () => {
      const localSignupButton = fixture.nativeElement.querySelector('#manual-signup-button');
      expect(localSignupButton).toBeTruthy();
    });

    it('should not display the signup form', () => {
      const signupForm = fixture.nativeElement.querySelector('form');
      expect(signupForm).toBeFalsy();
    });

    it('should display the signup form after clicking the local signup button', () => {
      const localSignupButton = fixture.nativeElement.querySelector('#manual-signup-button');
      localSignupButton.click();
      fixture.detectChanges();

      const signupForm = fixture.nativeElement.querySelector('form');
      expect(signupForm).toBeTruthy();
    });
  });

  describe('clicking the WCA login button', () => {
    it('should start the WCA login process', () => {
      const wcaLoginButton = fixture.nativeElement.querySelector('#wca-login-button');
      wcaLoginButton.click();

      expect(authService.startWcaLogin).toHaveBeenCalled();
    });
  });

  describe('local signup', () => {

    beforeEach(() => {
      emailCheckService.checkEmail.and.returnValue(of({valid: true}));

      const localSignupButton = fixture.nativeElement.querySelector('#manual-signup-button');
      localSignupButton.click();
      fixture.detectChanges();
    });

    it('should have a form with inputs for name, email, password, and password confirmation', () => {
      const nameInput = fixture.nativeElement.querySelector('#name');
      const emailInput = fixture.nativeElement.querySelector('#email');
      const passwordInput = fixture.nativeElement.querySelector('#password');
      const passwordConfirmationInput = fixture.nativeElement.querySelector('#confirmPassword');

      expect(nameInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(passwordConfirmationInput).toBeTruthy();
    });

    describe('the submit button', () => {
      it('should be disabled by default', () => {
        const submitButton = fixture.nativeElement.querySelector('#submit-button');
        expect(submitButton.disabled).toBeTrue();
      });

      describe('the email input', () => {
        it('should check the email when the input is blurred', () => {
          const testEmail = 'test@example.com';

          const emailInput = fixture.nativeElement.querySelector('#email');
          emailInput.value = testEmail;
          emailInput.dispatchEvent(new Event('input'));
          emailInput.dispatchEvent(new Event('blur'));

          expect(emailCheckService.checkEmail).toHaveBeenCalledWith(testEmail);
        });
      });

      it('should be enabled when the form is valid', fakeAsync(() => {
        const nameInput = fixture.nativeElement.querySelector('#name');
        const emailInput = fixture.nativeElement.querySelector('#email');
        const passwordInput = fixture.nativeElement.querySelector('#password');
        const passwordConfirmationInput = fixture.nativeElement.querySelector('#confirmPassword');

        nameInput.value = 'Test Name';
        nameInput.dispatchEvent(new Event('input'));
        emailInput.value = 'test@example.com';
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur'));
        passwordInput.value = 'password';
        passwordInput.dispatchEvent(new Event('input'));
        passwordConfirmationInput.value = 'password';
        passwordConfirmationInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        tick();

        const submitButton = fixture.nativeElement.querySelector('#submit-button');
        expect(submitButton.disabled).toBeFalse();
      }));
    });

    describe('email validation', () => {
      it('should display an error message when the email is invalid according to email input validation', () => {
        emailCheckService.checkEmail.and.returnValue(of({valid: true}));
        const testEmail = 'not a valid email';

        const emailInput = fixture.nativeElement.querySelector('#email');
        emailInput.value = testEmail;
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('form').textContent).toContain('Please check your email address.');
      });

      it('should display an error message when the email is invalid according to email check service', () => {
        emailCheckService.checkEmail.and.returnValue(of({valid: false}));
        const testEmail = 'invalid@testaddress.notarealdomain';

        const emailInput = fixture.nativeElement.querySelector('#email');
        emailInput.value = testEmail;
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('form').textContent).toContain('The email address does not appear to be a deliverable address.');
      });
    });
  });
});
