import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnverifiedWarningComponent } from './unverified-warning.component';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('UnverifiedWarningComponent', () => {
  let component: UnverifiedWarningComponent;
  let fixture: ComponentFixture<UnverifiedWarningComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser', 'hasVerifiedEmail'
    ]);
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'sendVerification'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule],
      declarations: [ UnverifiedWarningComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnverifiedWarningComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
