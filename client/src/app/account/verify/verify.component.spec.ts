import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyComponent } from './verify.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

describe('VerifyComponent', () => {
  let component: VerifyComponent;
  let fixture: ComponentFixture<VerifyComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'updateCurrentUser'
    ]);
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'verify',
      'sendVerification'
    ]);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ VerifyComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
