import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, of, throwError } from 'rxjs';

import { SignupComponent } from './signup.component';
import { EmailService } from 'src/app/services/email/email.service';
import { EmailCheckService } from 'src/app/services/email/email-check.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

import { NewUser } from 'src/app/interfaces/user/new-user';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  let emailService: jasmine.SpyObj<EmailService>;
  let emailCheckService: jasmine.SpyObj<EmailCheckService>;
  let authService: jasmine.SpyObj<AuthService>;
  let alerts: jasmine.SpyObj<AlertsService>;

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
    const alertsSpy = jasmine.createSpyObj('AlertsService', [
      'addAlert', 'clear'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, FormsModule, ReactiveFormsModule],
      declarations: [ SignupComponent ],
      providers: [
        { provide: EmailService, useValue: emailServiceSpy },
        { provide: EmailCheckService, useValue: emailCheckServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AlertsService, useValue: alertsSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;

    emailService = TestBed.inject(EmailService) as jasmine.SpyObj<EmailService>;
    emailCheckService = TestBed.inject(EmailCheckService) as jasmine.SpyObj<EmailCheckService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;

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
        const testEmail = 'not a valid email';
        emailCheckService.checkEmail.and.returnValue(of({valid: true}));

        const emailInput = fixture.nativeElement.querySelector('#email');
        emailInput.value = testEmail;
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('form').textContent)

        .toContain('Please check your email address.');
      });

      it('should display an error message when the email is invalid according to email check service', () => {
        const testEmail = 'invalid@testaddress.notarealdomain';
        emailCheckService.checkEmail.and.returnValue(of({valid: false}));

        const emailInput = fixture.nativeElement.querySelector('#email');
        emailInput.value = testEmail;
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('form').textContent)
        .toContain('The email address does not appear to be a deliverable address.');
      });

      it('should display a "did you mean" message when the email check service returns a suggestion', () => {
        const testEmail = 'typo@exampel.com'
        const correctEmail = 'bob@example.com';
        emailCheckService.checkEmail.and.returnValue(
          of({valid: true, did_you_mean: correctEmail})
        );
        emailCheckService.hasDidYouMean.and.returnValue(true);
        emailCheckService.getDidYouMean.and.returnValue(correctEmail);
        emailCheckService.useDidYouMean.and.returnValue(correctEmail);

        const emailInput = fixture.nativeElement.querySelector('#email');
        emailInput.value = testEmail;
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(emailCheckService.setDidYouMean).toHaveBeenCalledOnceWith(correctEmail);

        expect(fixture.nativeElement.querySelector('form').textContent)
        .toContain("Did you mean:");
        expect(fixture.nativeElement.querySelector('form').textContent)
        .toContain(correctEmail);
        expect(emailInput.value).toEqual(testEmail);

        expect(emailCheckService.useDidYouMean).not.toHaveBeenCalled();

        const suggestionLink = fixture.nativeElement.querySelector('.contact-did-you-mean');
        expect(suggestionLink).not.toBeNull();
        suggestionLink.click();
        fixture.detectChanges();

        expect(emailInput.value).toEqual(correctEmail);
        expect(emailCheckService.useDidYouMean).toHaveBeenCalled();
      });

      it('should clear the "did you mean" message when the email is changed', () => {
        const testEmail = 'typo@exampel.com'
        const correctEmail = 'bob@example.com';
        const newEmail = 'another@example.com';
        emailCheckService.checkEmail.and.returnValue(
          of({valid: true, did_you_mean: correctEmail})
        );
        emailCheckService.hasDidYouMean.and.returnValue(true);
        emailCheckService.getDidYouMean.and.returnValue(correctEmail);

        const emailInput = fixture.nativeElement.querySelector('#email');
        emailInput.value = testEmail;
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('form').textContent)
        .toContain("Did you mean:");

        emailCheckService.checkEmail.and.returnValue(
          of({valid: true})
        );
        emailCheckService.hasDidYouMean.and.returnValue(false);

        emailInput.value = newEmail;
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(emailCheckService.setDidYouMean).toHaveBeenCalledWith();
        expect(fixture.nativeElement.querySelector('form').textContent).not.toContain("Did you mean:");
      });

      it('should show no new validation if a check is in progress', fakeAsync(() => {
        const testEmail = 'typo@exampel.com'
        const correctEmail = 'bob@example.com';
        const newEmail = 'another@example.com';

        let finishRequest: ()=>void = ()=>{};

        emailCheckService.checkEmail.and.returnValue(
          new Observable(subscriber => {finishRequest = () => {
            subscriber.next({valid: true, did_you_mean: correctEmail});
            subscriber.complete();
          }})
        );

        const emailInput = fixture.nativeElement.querySelector('#email');
        emailInput.value = testEmail;
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        emailInput.value = newEmail;
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(emailCheckService.checkEmail).toHaveBeenCalledTimes(1);
        if (finishRequest) {finishRequest()};
      }));

      it('should handle rate limiting on the email check service', fakeAsync(() => {
        const testEmail = 'bob@example.com';
        emailCheckService.checkEmail.and.returnValue(
          throwError(() => {return {status: 429}})
        );

        const emailInput = fixture.nativeElement.querySelector('#email');
        emailInput.value = testEmail;
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('form').textContent)
        .not.toContain("Did you mean:");
        expect(fixture.nativeElement.querySelector('form').textContent)
        .not.toContain("The email address does not appear to be a deliverable address");
      }));
    });
  });

  describe('submitting the form', () => {

    let testUser: NewUser;

    beforeEach(() => {
      emailCheckService.checkEmail.and.returnValue(of({valid: true}));

      const localSignupButton = fixture.nativeElement.querySelector('#manual-signup-button');
      localSignupButton.click();
      fixture.detectChanges();

      testUser = {
        name: 'Test Person',
        email: 'test@example.com',
        password: 'password'
      };

      const nameInput = fixture.nativeElement.querySelector('#name');
      nameInput.value = testUser.name;
      nameInput.dispatchEvent(new Event('input'));
      const emailInput = fixture.nativeElement.querySelector('#email');
      emailInput.value = testUser.email;
      emailInput.dispatchEvent(new Event('input'));
      emailInput.dispatchEvent(new Event('blur'));
      const passwordInput = fixture.nativeElement.querySelector('#password');
      passwordInput.value = testUser.password;
      passwordInput.dispatchEvent(new Event('input'));
      const confirmPasswordInput = fixture.nativeElement.querySelector('#confirmPassword');
      confirmPasswordInput.value = testUser.password;
      confirmPasswordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
    });

    it('should submit the form when the sign up button is clicked', (done) => {
      authService.register.and.callFake((user: NewUser) => {
        expect(user).toEqual(testUser);
        done();
      });

      const submitButton = fixture.nativeElement.querySelector('#submit-button');
      submitButton.click();
    });

    it('should handle a server timeout', (done) => {
      authService.register.and.callFake((user: NewUser, errorCb: (err: any)=>void) => {
        errorCb({status: 504});
        expect(alerts.addAlert).toHaveBeenCalledOnceWith(
          "danger", "Could not connect to the server. Please try again later."
        );
        done();
      });

      const submitButton = fixture.nativeElement.querySelector('#submit-button');
      submitButton.click();
    });

    it('should handle a failed validation', (done) => {
      authService.register.and.callFake((user: NewUser, errorCb: (err: any)=>void) => {
        errorCb({status: 422, error: {message: 'duplicate email'}});
        expect(alerts.addAlert).toHaveBeenCalledOnceWith(
          "danger", "duplicate email"
        );
        done();
      });

      const submitButton = fixture.nativeElement.querySelector('#submit-button');
      submitButton.click();
    });

    it('should handle any other error', (done) => {
      authService.register.and.callFake((user: NewUser, errorCb: (err: any)=>void) => {
        errorCb({status: 500, error: {message: 'server error'}});
        expect(alerts.addAlert).toHaveBeenCalledOnceWith(
          "danger", "An unknown error occurred. Please try again later."
        );
        done();
      });

      const submitButton = fixture.nativeElement.querySelector('#submit-button');
      submitButton.click();
    });
  });
});
