import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnverifiedWarningComponent } from './unverified-warning.component';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, throwError } from 'rxjs';
import { AlertsService } from '../alerts/alerts.service';

describe('UnverifiedWarningComponent', () => {
  let component: UnverifiedWarningComponent;
  let fixture: ComponentFixture<UnverifiedWarningComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let alerts: jasmine.SpyObj<AlertsService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser', 'hasVerifiedEmail'
    ]);
    authServiceSpy.getCurrentUser.and.returnValue({ email: "test@example.com" });
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'sendVerification'
    ]);
    const alertsSpy = jasmine.createSpyObj('AlertsService', [
      'clear', 'addAlert'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule],
      declarations: [ UnverifiedWarningComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: AlertsService, useValue: alertsSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnverifiedWarningComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;

    fixture.detectChanges();
  });

  describe('when the user is verified', () => {
    beforeEach(() => {
      authService.hasVerifiedEmail.and.returnValue(true);
      fixture.detectChanges();
    });

    it('should not show any messages', () => {
      expect(fixture.nativeElement.textContent).toEqual("");
      expect(alerts.addAlert).not.toHaveBeenCalled();
    });
  });

  describe('when the user is not verified', () => {
    beforeEach(() => {
      authService.hasVerifiedEmail.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should show a warning', () => {
      expect(fixture.nativeElement.textContent).toContain("Your account is not verified");
    });

    it('should show a button to resend the verification email', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.textContent).toContain("Resend verification email");
    });

    it('should not show messages about the email being sent', () => {
      expect(fixture.nativeElement.textContent)
      .not.toContain("Sending email");
      expect(fixture.nativeElement.textContent)
      .not.toContain("verification email has been sent");
    });

    describe('when the user clicks the button', () => {

      let finishSending: () => void = ()=>{};

      beforeEach(() => {
        userService.sendVerification.and.returnValue(
          new Observable((subscriber) => {
            finishSending = () => {
              subscriber.next({});
              subscriber.complete();
            };
          })
        )

        const button = fixture.nativeElement.querySelector('button');
        button.click();
        fixture.detectChanges();
      });

      it('should send the verification email', () => {
        expect(userService.sendVerification).toHaveBeenCalled();
      });

      it('should show a message that the email is being sent', () => {
        expect(userService.sendVerification).toHaveBeenCalled();
        expect(fixture.nativeElement.textContent)
        .toContain("Sending email");
        expect(fixture.nativeElement.textContent)
        .not.toContain("verification email has been sent");
      });

      it('should change the message after the email send finishes', () => {
        finishSending();
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent)
        .not.toContain("Sending email");
        expect(fixture.nativeElement.textContent)
        .toContain("verification email has been sent");
      });

    });

    describe('when the user clicks the button and the email fails to send', () => {

      beforeEach(() => {
        userService.sendVerification.and.returnValue(
          throwError(() => {
            return { error: { message: "test error" } }
          })
        );

        const button = fixture.nativeElement.querySelector('button');
        button.click();
        fixture.detectChanges();
      });

      it('should show an error message', () => {
        expect(alerts.addAlert).toHaveBeenCalledWith(
          "danger", "test error"
        );
      });

      it('should not show a message that the email is being sent', () => {
        expect(fixture.nativeElement.textContent)
        .not.toContain("Sending email");
        expect(fixture.nativeElement.textContent)
        .not.toContain("verification email has been sent");
      });
    });
  });
});
