import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { SettingsComponent } from './settings.component';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UnverifiedWarningComponent } from 'src/app/components/unverified-warning/unverified-warning.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['updateUser']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLocalUser', 'hasVerifiedEmail'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule],
      declarations: [
        SettingsComponent,
        MockComponent(UnverifiedWarningComponent)
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
