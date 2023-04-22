import { TestBed } from '@angular/core/testing';

import { LoginGuard } from './login.guard';
import { AuthService } from '../services/auth/auth.service';

describe('LoginGuard', () => {
  let guard: LoginGuard;

  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    guard = TestBed.inject(LoginGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
