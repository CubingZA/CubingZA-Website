import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
