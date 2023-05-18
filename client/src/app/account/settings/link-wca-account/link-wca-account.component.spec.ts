import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkWcaAccountComponent } from './link-wca-account.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('LinkWcaAccountComponent', () => {
  let component: LinkWcaAccountComponent;
  let fixture: ComponentFixture<LinkWcaAccountComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let alerts: jasmine.SpyObj<AlertsService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser', 'isWCAUser', 'connectWcaAccount'
    ]);
    const alertsSpy = jasmine.createSpyObj('AlertsService', [
      'clear'
    ]);

    TestBed.configureTestingModule({
      imports: [FontAwesomeModule],
      declarations: [LinkWcaAccountComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AlertsService, useValue: alertsSpy }
      ]
    });
    fixture = TestBed.createComponent(LinkWcaAccountComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;

    fixture.detectChanges();
  });

  describe('when the user is not a WCA user', () => {

    beforeEach(() => {
      authService.isWCAUser.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should show a button to link a WCA account', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.textContent).toContain('Connect your WCA profile');
    });

    describe('when the button is clicked', () => {

      beforeEach(() => {
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        fixture.detectChanges();
      });

      it('should clear any alerts', () => {
        expect(alerts.clear).toHaveBeenCalled();
      });

      it('should call the connectWcaAccount method on the auth service', () => {
        expect(authService.connectWcaAccount).toHaveBeenCalled();
      });
    });
  });

  describe('when the user is a WCA user', () => {

    beforeEach(() => {
      authService.isWCAUser.and.returnValue(true);
      fixture.detectChanges();
    });

    it('should show "Your account is linked to WCA profile"', () => {
      const element = fixture.nativeElement;
      expect(element.textContent).toContain('Your account is linked to WCA profile');
    });
  });
});
