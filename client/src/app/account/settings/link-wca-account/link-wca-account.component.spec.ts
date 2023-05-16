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
      'isLocalUser', 'hasVerifiedEmail', 'isWCAUser'
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
