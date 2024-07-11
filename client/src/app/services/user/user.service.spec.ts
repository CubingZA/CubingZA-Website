import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { UserService } from './user.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

import { User } from 'src/app/interfaces/user/user';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('getAllUsers', () => {

    it('should return a list of all users', (done) => {
      const dummyUsers: User[] = [
        {
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
        },
        {
          _id: "2",
          name: "Test Person 2",
          email: "another@example.com",
          role: "admin",
          provider: ["wca"],
          notificationSettings: {
            "GT": true,
            "MP": true,
            "LM": true,
            "NW": true,
            "FS": true,
            "KZ": true,
            "EC": true,
            "WC": true,
            "NC": true
          }
        }
      ];

      service.getAllUsers().subscribe(users => {
        expect(users.length).toBe(2);
        expect(users).toEqual(dummyUsers);
        done();
      });

      const req = httpMock.expectOne('/api/users');
      expect(req.request.method).toBe("GET");
      req.flush(dummyUsers);
    });
  });

  describe('getCurrentUser', () => {

    it('should return the current user', (done) => {
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

      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(dummyUser);
        done();
      });

      const req = httpMock.expectOne('/api/users/me');
      expect(req.request.method).toBe("GET");
      req.flush(dummyUser);
    });
  });

  describe('verify', () => {
    it('should verify a user', (done) => {
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

      service.verify("1", "token").subscribe(user => {
        expect(user).toEqual(dummyUser);
        done();
      });

      const req = httpMock.expectOne('/api/users/verify');
      expect(req.request.method).toBe("POST");
      req.flush(dummyUser);
    });
  });

  describe('sendVerification', () => {
    it('should send a verification email', (done) => {
      service.sendVerification().subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('/api/users/me/verifications/send');
      expect(req.request.method).toBe("POST");
      req.flush({});
    });
  });

  describe('changePassword', () => {

    let alerts: AlertsService;

    let getCurrentUserSpy: jasmine.Spy;
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
      getCurrentUserSpy = spyOn(service, 'getCurrentUser')
      .and.returnValue(of(dummyUser));

      alerts = TestBed.inject(AlertsService);
    });

    it('should change the password', () => {
      const oldPassword = "old";
      const newPassword = "new";

      service.changePassword(newPassword, oldPassword);

      const req = httpMock.expectOne('/api/users/1/password');
      expect(req.request.method).toBe("PUT");
      req.flush({});

      expect(alerts.alerts.length).toBe(1);
      expect(alerts.alerts[0].type).toBe("success");
      expect(alerts.alerts[0].message).toBe("Password changed successfully");
    });

    it('should not change the password if the old password is incorrect', () => {
      const oldPassword = "wrong";
      const newPassword = "new";

      service.changePassword(newPassword, oldPassword);

      const req = httpMock.expectOne('/api/users/1/password');
      expect(req.request.method).toBe("PUT");
      req.flush({error: "Incorrect password"}, {status: 403, statusText: "Forbidden"});

      expect(alerts.alerts.length).toBe(1);
      expect(alerts.alerts[0].type).toBe("danger");
      expect(alerts.alerts[0].message).toBe("Error changing password. Perhaps your old password was incorrect?");
    });

    it('should handle errors fetching the user', () => {
      const oldPassword = "old";
      const newPassword = "new";

      getCurrentUserSpy.and.returnValue(
        throwError(() => new Error("Test Error"))
      );

      service.changePassword(newPassword, oldPassword);

      expect(alerts.alerts.length).toBe(1);
      expect(alerts.alerts[0].type).toBe("danger");
      expect(alerts.alerts[0].message).toBe("Test Error");
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', (done) => {
      service.deleteUser("1").subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('/api/users/1');
      expect(req.request.method).toBe("DELETE");
      req.flush({});
    });
  });
});
