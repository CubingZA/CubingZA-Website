import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of, throwError } from 'rxjs';

import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginComponent } from './login.component';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'startWcaLogin', 'login'
    ]);
    authServiceSpy.login.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, FormsModule, ReactiveFormsModule],
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  describe('rendering', () => {
    it('should have a login form with an email and password field', () => {
      const email = fixture.nativeElement.querySelector('#email');
      const password = fixture.nativeElement.querySelector('#password');
      expect(email).toBeTruthy();
      expect(password).toBeTruthy();
    });

    it('should have a WCA login button', () => {
      const wcaLogin = fixture.nativeElement.querySelector('button#wca-login');
      expect(wcaLogin).toBeTruthy();
    });
  });

  describe('clicking the WCA login button', () => {
    it('should start the WCA login process', () => {
      const wcaLogin = fixture.nativeElement.querySelector('button#wca-login');
      wcaLogin.click();
      fixture.detectChanges();

      expect(authService.startWcaLogin).toHaveBeenCalled();
    });
  });

  describe('the log in button', () => {
    it('should be disabled if the form is invalid', () => {
      const loginButton = fixture.nativeElement.querySelector('button#login');
      expect(loginButton.disabled).toBeTrue();
    });
  });

  describe('submitting the login form', () => {
    it('should login the user', () => {
      const email = fixture.nativeElement.querySelector('#email');
      const password = fixture.nativeElement.querySelector('#password');
      const loginForm = fixture.nativeElement.querySelector('form');

      email.value = "test@example.com";
      email.dispatchEvent(new Event('input'));
      password.value = "password";
      password.dispatchEvent(new Event('input'));

      loginForm.dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(authService.login).toHaveBeenCalled();
    });

    it('should handle incorrect credentials', () => {
      const alerts = TestBed.inject(AlertsService);
      authService.login.and.returnValue(throwError(() => {return { status: 401 }}));

      const email = fixture.nativeElement.querySelector('#email');
      const password = fixture.nativeElement.querySelector('#password');
      const loginForm = fixture.nativeElement.querySelector('form');

      email.value = "test@example.com";
      email.dispatchEvent(new Event('input'));
      password.value = "wrong password";
      password.dispatchEvent(new Event('input'));

      loginForm.dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(authService.login).toHaveBeenCalled();
      expect(alerts.alerts.length).toBe(1);
      expect(alerts.alerts[0].type).toBe("danger");
      expect(alerts.alerts[0].message).toBe("Invalid email or password");
    });

    it('should handle a server timeout', () => {
      const alerts = TestBed.inject(AlertsService);
      authService.login.and.returnValue(throwError(() => {return { status: 504 }}));

      const email = fixture.nativeElement.querySelector('#email');
      const password = fixture.nativeElement.querySelector('#password');
      const loginForm = fixture.nativeElement.querySelector('form');

      email.value = "test@example.com";
      email.dispatchEvent(new Event('input'));
      password.value = "password";
      password.dispatchEvent(new Event('input'));

      loginForm.dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(authService.login).toHaveBeenCalled();
      expect(alerts.alerts.length).toBe(1);
      expect(alerts.alerts[0].type).toBe("danger");
      expect(alerts.alerts[0].message).toBe("Error: Could not connect to server");
    });

    it('should handle any other error', () => {
      const alerts = TestBed.inject(AlertsService);
      authService.login.and.returnValue(throwError(() => {return { status: 500 }}));

      const email = fixture.nativeElement.querySelector('#email');
      const password = fixture.nativeElement.querySelector('#password');
      const loginForm = fixture.nativeElement.querySelector('form');

      email.value = "test@example.com";
      email.dispatchEvent(new Event('input'));
      password.value = "password";
      password.dispatchEvent(new Event('input'));

      loginForm.dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(authService.login).toHaveBeenCalled();
      expect(alerts.alerts.length).toBe(1);
      expect(alerts.alerts[0].type).toBe("danger");
      expect(alerts.alerts[0].message).toBe("Error: Could not log in");
    });
  });
});
