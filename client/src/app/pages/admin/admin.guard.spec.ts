import { TestBed } from '@angular/core/testing';

import { AdminGuard } from './admin.guard';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  let authService: jasmine.SpyObj<AuthService>;

  const dummyActivatedRoute = {} as ActivatedRouteSnapshot;
  const dummyRouterState = {} as RouterStateSnapshot;

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

  it('should allow matching routes if the user is an admin', () => {
    authService.isAdmin.and.returnValue(true);
    const result = guard.canMatch(dummyActivatedRoute, dummyRouterState);
    expect(result).toBeTrue();
  });

  it('should not allow matching routes if the user is not an admin', () => {
    authService.isAdmin.and.returnValue(false);
    const result = guard.canMatch(dummyActivatedRoute, dummyRouterState);
    expect(result).toBeFalse();
  });

  it('should allow activating if the user is an admin', () => {
    authService.isAdmin.and.returnValue(true);
    const result = guard.canActivate(dummyActivatedRoute, dummyRouterState);
    expect(result).toBeTrue();
  });

  it('should not allow activating if the user is not an admin', () => {
    authService.isAdmin.and.returnValue(false);
    const result = guard.canActivate(dummyActivatedRoute, dummyRouterState);
    expect(result).toBeFalse();
  });
});
