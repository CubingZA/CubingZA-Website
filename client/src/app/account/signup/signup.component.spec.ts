import { ComponentFixture, TestBed } from '@angular/core/testing';

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
      'checkEmail'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'register'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
      providers: [
        { provide: EmailService, useValue: emailService },
        { provide: EmailCheckService, useValue: emailCheckService },
        { provide: AuthService, useValue: authService }
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
