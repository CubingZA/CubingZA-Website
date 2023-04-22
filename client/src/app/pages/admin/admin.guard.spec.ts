import { TestBed } from '@angular/core/testing';

import { AdminGuard } from './admin.guard';
import { AuthService } from 'src/app/services/auth/auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAdmin'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    guard = TestBed.inject(AdminGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
