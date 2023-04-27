import { TestBed } from '@angular/core/testing';

import { AllowLoginGuard } from './allow-login.guard';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

describe('LoginGuard', () => {
  let guard: AllowLoginGuard;

  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const dummyActivatedRoute = {} as ActivatedRouteSnapshot;
  const dummyRouterState = {} as RouterStateSnapshot;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn'
    ]);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    guard = TestBed.inject(AllowLoginGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  describe('canActivate', () => {
    it('should activate if the user is not logged in', () => {
      authService.isLoggedIn.and.returnValue(false);
      const result = guard.canActivate(dummyActivatedRoute, dummyRouterState);
      expect(result).toBeTrue();
    });

    it('should redirect to the home page if the user is logged in', () => {
      authService.isLoggedIn.and.returnValue(true);
      const result = guard.canActivate(dummyActivatedRoute, dummyRouterState);
      expect(result).toEqual(router.parseUrl(''));
    });
  });
});
