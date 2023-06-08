import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService, LoginDetails } from './auth.service';
import { Observable, of, throwError } from 'rxjs';
import { NewUser, User, UserService } from '../user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

function makeMockJWT(data: any) {
  return 'eyJhbHeader.' + window.btoa(JSON.stringify(data)) + '.Signature'
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let cookieMock: jasmine.SpyObj<CookieService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockDate = new Date(2023, 1, 1, 0, 0, 0, 0);
  const futureDate = (mockDate.getTime() + 1000) / 1000;
  const pastDate = (mockDate.getTime() - 1000) / 1000;

  const dummyUser: User = {
    _id: "1",
    name: "Test Person",
    email: "test@example.com",
    role: "user",
    provider: ["local"],
    notificationSettings: {
      "GT": true,
      "MP": false,
      "LM": false,
      "NW": false,
      "FS": false,
      "KZ": false,
      "EC": false,
      "WC": false,
      "NC": false
    }
  };

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(mockDate);

    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getCurrentUser'
    ]);
    cookieMock = jasmine.createSpyObj('CookieService', [
      'check', 'set', 'get', 'delete'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: CookieService, useValue: cookieMock }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jasmine.clock().uninstall();
  });

  describe('constructor', () => {

    it('should update the user when the token cookie is set', () => {
      userServiceSpy.getCurrentUser.and.returnValue(of(dummyUser));
      cookieMock.check.and.returnValue(true);

      const authService = new AuthService(
        TestBed.inject(HttpClient),
        cookieMock,
        TestBed.inject(Router),
        userServiceSpy
      );
      expect(userServiceSpy.getCurrentUser).toHaveBeenCalled();
    });

    it('should not update the user when the token cookie is not set', () => {
      userServiceSpy.getCurrentUser.and.returnValue(of(dummyUser));
      cookieMock.check.and.returnValue(false);

      const authService = new AuthService(
        TestBed.inject(HttpClient),
        cookieMock,
        TestBed.inject(Router),
        userServiceSpy
      );
      expect(userServiceSpy.getCurrentUser).not.toHaveBeenCalled();
    });
  });

  describe('updateCurrentUser', () => {

    it('should update the current user', (done) => {
      let flush: () => void = () => {
        fail("Flush function not set");
      };

      let userObservable = new Observable<User>(subscriber => {
        flush = () => {
          subscriber.next(dummyUser);
          subscriber.complete();
        };
      });

      userServiceSpy.getCurrentUser.and.returnValue(userObservable);

      expect(service["currentUser"]).toBeUndefined();
      expect(service["busyUpdatingUser"]).toBeFalse();

      service.updateCurrentUser(() => {
        expect(service["currentUser"]).toEqual(dummyUser);
        expect(service["busyUpdatingUser"]).toBeFalse();
        done();
      });

      expect(service["busyUpdatingUser"]).toBeTrue();
      flush();
    });

    it('should should handle an error', (done) => {
      userServiceSpy.getCurrentUser.and.returnValue(
        throwError(() => new Error("Test error"))
      );
      const redirectSpy = spyOn(service, 'redirectToLogin');

      expect(service["currentUser"]).toBeUndefined();
      expect(service["busyUpdatingUser"]).toBeFalse();

      let callbackCalled = false;

      expect(() => service.updateCurrentUser(() => {
        callbackCalled = true;
      })).not.toThrow();

      expect(service["currentUser"]).toBeUndefined();
      expect(service["busyUpdatingUser"]).toBeFalse();
      expect(callbackCalled).toBeFalse();
      expect(redirectSpy).toHaveBeenCalled();

      done();
    });
  });

  describe('getCurrentUser', () => {

    it('should return the current user', () => {
      service["currentUser"] = dummyUser;
      service["busyUpdatingUser"] = false;
      expect(service.getCurrentUser()).toEqual(dummyUser);
    });

    it('should return the current user, and not update if busy updating', () => {
      service["currentUser"] = dummyUser;
      service["busyUpdatingUser"] = true;
      const updateSpy = spyOn(service, 'updateCurrentUser');
      expect(service.getCurrentUser()).toEqual(dummyUser);
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('isLocalUser', () => {

    it('should return true for a local user', () => {
      service["currentUser"] = dummyUser;
      expect(service.isLocalUser()).toBeTrue();
    });

    it('should return false for a non-local user', () => {
      service["currentUser"] = {
        ...dummyUser,
        provider: ["wca"]
      };
      expect(service.isLocalUser()).toBeFalse();
    });
  });

  describe('isWCAUser', () => {

    it('should return true for a WCA user', () => {
      service["currentUser"] = {
        ...dummyUser,
        provider: ["wca"]
      };
      expect(service.isWCAUser()).toBeTrue();
    });

    it('should return false for a non-WCA user', () => {
      service["currentUser"] = dummyUser;
      expect(service.isWCAUser()).toBeFalse();
    });
  });

  describe('isLoggedIn', () => {

    it('should return true for a logged in user', () => {
      service["currentUser"] = dummyUser;
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return true if there is no user but a valid JWT, and should update the user', () => {
      service["currentUser"] = undefined;

      const token = makeMockJWT({
        exp: futureDate,
        iat: pastDate
      });

      cookieMock.check.and.returnValue(true);
      cookieMock.get.and.returnValue(token);

      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false if there is no user and an expired JWT', () => {
      service["currentUser"] = undefined;

      const token = makeMockJWT({
        exp: pastDate,
        iat: pastDate
      });

      cookieMock.check.and.returnValue(true);
      cookieMock.get.and.returnValue(token);

      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return false if there is no user and the JWT is not yet valid', () => {
      service["currentUser"] = undefined;

      const token = makeMockJWT({
        exp: futureDate,
        iat: futureDate
      });

      cookieMock.check.and.returnValue(true);
      cookieMock.get.and.returnValue(token);

      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return false if there is no user and no JWT', () => {
      service["currentUser"] = undefined;
      cookieMock.check.and.returnValue(false);
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('hasVerifiedEmail', () => {

    it('should return true for a user with a verified email', () => {
      service["currentUser"] = {
        ...dummyUser,
        role: 'user'
      };
      expect(service.hasVerifiedEmail()).toBeTrue();
    });

    it('should return false for a user without a verified email', () => {
      service["currentUser"] = {
        ...dummyUser,
        role: 'unverified'
      };
      expect(service.hasVerifiedEmail()).toBeFalse();
    });

    it('should return true for an admin', () => {
      service["currentUser"] = {
        ...dummyUser,
        role: 'admin'
      };
      expect(service.hasVerifiedEmail()).toBeTrue();
    });

    it('should return true if the valid JWT specifies a verified role', () => {
      service["currentUser"] = undefined;
      const token = makeMockJWT({
        exp: futureDate,
        iat: pastDate,
        role: 'user'
      });

      cookieMock.check.and.returnValue(true);
      cookieMock.get.and.returnValue(token);

      expect(service.hasVerifiedEmail()).toBeTrue();
    });

    it('should return false if the valid JWT specifies an unverified role', () => {
      service["currentUser"] = undefined;
      const token = makeMockJWT({
        exp: futureDate,
        iat: pastDate,
        role: 'unverified'
      });

      cookieMock.check.and.returnValue(true);
      cookieMock.get.and.returnValue(token);

      expect(service.hasVerifiedEmail()).toBeFalse();
    });

    it('should return false if the valid JWT does not specify a role', () => {
      service["currentUser"] = undefined;
      const token = makeMockJWT({
        exp: futureDate,
        iat: pastDate,
      });

      cookieMock.check.and.returnValue(true);
      cookieMock.get.and.returnValue(token);

      expect(service.hasVerifiedEmail()).toBeFalse();
    });

    it('should return false if the there is no user and no JWT', () => {
      service["currentUser"] = undefined;

      cookieMock.check.and.returnValue(false);
      cookieMock.get.and.returnValue('');

      expect(service.hasVerifiedEmail()).toBeFalse();
    });
  });

  describe('isAdmin', () => {

    it('should return true for an admin', () => {
      service["currentUser"] = {
        ...dummyUser,
        role: 'admin'
      };
      expect(service.isAdmin()).toBeTrue();
    });

    it('should return false for a non-admin', () => {
      service["currentUser"] = {
        ...dummyUser,
        role: 'user'
      };
      expect(service.isAdmin()).toBeFalse();
    });

    it('should return true if the valid JWT specifies an admin role', () => {
      service["currentUser"] = undefined;
      const token = makeMockJWT({
        exp: futureDate,
        iat: pastDate,
        role: 'admin'
      });

      cookieMock.check.and.returnValue(true);
      cookieMock.get.and.returnValue(token);

      expect(service.isAdmin()).toBeTrue();
    });

    it('should return false if the valid JWT specifies a non-admin role', () => {
      service["currentUser"] = undefined;
      const token = makeMockJWT({
        exp: futureDate,
        iat: pastDate,
        role: 'user'
      });

      cookieMock.check.and.returnValue(true);
      cookieMock.get.and.returnValue(token);

      expect(service.isAdmin()).toBeFalse();
    });

    it('should return false if the valid JWT does not specify a role', () => {
      service["currentUser"] = undefined;
      const token = makeMockJWT({
        exp: futureDate,
        iat: pastDate,
      });

      cookieMock.check.and.returnValue(true);
      cookieMock.get.and.returnValue(token);

      expect(service.isAdmin()).toBeFalse();
    });

    it('should return false if the there is no user and no JWT', () => {
      service["currentUser"] = undefined;

      cookieMock.check.and.returnValue(false);
      cookieMock.get.and.returnValue('');

      expect(service.isAdmin()).toBeFalse();
    });
  });

  describe('register', () => {

    it('should register a user', () => {
      const newUser: NewUser = {
        name: 'Test Person',
        email: 'test@example.com',
        password: 'password'
      };

      const finishSpy = spyOn(service, 'finishLoginProcess');
      const token = 'test token';

      const errorCb = jasmine.createSpy('errorCb');

      service.register(newUser, errorCb);

      const req = httpMock.expectOne('/api/users');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(newUser);

      req.flush({ token });

      expect(finishSpy).toHaveBeenCalledWith(token);
      expect(errorCb).not.toHaveBeenCalled();
    });

    it('should call the error callback if the request fails', () => {
      const newUser: NewUser = {
        name: 'Test Person',
        email: 'test@example.com',
        password: 'password'
      };

      const finishSpy = spyOn(service, 'finishLoginProcess');
      const token = 'test token';

      const errorCb = jasmine.createSpy('errorCb');

      service.register(newUser, errorCb);

      const req = httpMock.expectOne('/api/users');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(newUser);

      const error = { status: 400, statusText: 'Bad Request' };
      req.flush('error', error);

      expect(finishSpy).not.toHaveBeenCalled();
      expect(errorCb).toHaveBeenCalled();
    });
  });

  describe('login', () => {

    it('should login a user', (done) => {
      const loginDetails: LoginDetails = {
        email: 'test@example.com',
        password: 'password'
      };
      const token = 'test token';

      const finishSpy = spyOn(service, 'finishLoginProcess');

      service.login(loginDetails).subscribe({
        next: (data) => {
          expect(finishSpy).toHaveBeenCalledWith(token);
          done();
        },
        error: (err) => {
          fail('should not have errored');
          done();
        }
      });

      const req = httpMock.expectOne('/auth/local');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(loginDetails);

      req.flush({ token });
    });

    it('should error on 401 Unauthorized response', (done) => {
      const loginDetails: LoginDetails = {
        email: 'test@example.com',
        password: 'password'
      };
      const token = 'test token';

      const finishSpy = spyOn(service, 'finishLoginProcess');

      service.login(loginDetails).subscribe({
        next: (data) => {
          fail('should not have succeeded');
          done();
        },
        error: (err) => {
          expect(finishSpy).not.toHaveBeenCalled();
          expect(err.status).toEqual(401);
          expect(err.statusText).toEqual('Unauthorized');
          done();
        }
      });

      const req = httpMock.expectOne('/auth/local');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(loginDetails);

      const error = { status: 401, statusText: 'Unauthorized' };
      req.flush('error', error);
    });

    it('should handle a server timeout', (done) => {
      const loginDetails: LoginDetails = {
        email: 'test@example.com',
        password: 'password'
      };
      const token = 'test token';

      const finishSpy = spyOn(service, 'finishLoginProcess');

      service.login(loginDetails).subscribe({
        next: (data) => {
          fail('should not have succeeded');
          done();
        },
        error: (err) => {
          expect(finishSpy).not.toHaveBeenCalled();
          expect(err.status).toEqual(504);
          expect(err.statusText).toEqual('Gateway Timeout');
          done();
        }
      });

      const req = httpMock.expectOne('/auth/local');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(loginDetails);

      const error = { status: 504, statusText: 'Gateway Timeout' };
      req.flush('error', error);
    });

    it('should throw a generic error for anything other than 401 or 504', (done) => {
      const loginDetails: LoginDetails = {
        email: 'test@example.com',
        password: 'password'
      };
      const token = 'test token';

      const finishSpy = spyOn(service, 'finishLoginProcess');

      service.login(loginDetails).subscribe({
        next: (data) => {
          fail('should not have succeeded');
          done();
        },
        error: (err) => {
          expect(finishSpy).not.toHaveBeenCalled();
          expect(err.message).toEqual("Error logging in");
          done();
        }
      });

      const req = httpMock.expectOne('/auth/local');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(loginDetails);

      const error = { status: 500, statusText: 'Internal Server Error' };
      req.flush('error', error);
    });
  });

  describe('finishLoginProcess', () => {

    it('should set the token, update the user, then redirect to the ', fakeAsync(() => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      userServiceSpy.getCurrentUser.and.returnValue(of(dummyUser));

      const redirectUrl = '/test';
      service["redirectUrl"] = redirectUrl;

      service.finishLoginProcess('test token');

      expect(cookieMock.set).toHaveBeenCalledWith('token', 'test token');

      tick();

      expect(navigateSpy).toHaveBeenCalledWith([redirectUrl]);
    }));
  });
});
