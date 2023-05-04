import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const dummyActivatedRoute = {} as ActivatedRouteSnapshot;
  const dummyRouterState = {} as RouterStateSnapshot;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

  });

  it('should activate if the user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true);
    const result = guard.canActivate(dummyActivatedRoute, dummyRouterState);
    expect(result).toBeTrue();
  });

  it('should redirect to the login page if the user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);
    const result = guard.canActivate(dummyActivatedRoute, dummyRouterState);
    expect(result).toEqual(router.parseUrl('login'));
  });
});
