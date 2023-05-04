import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyComponent } from './verify.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

describe('VerifyComponent', () => {
  let component: VerifyComponent;
  let fixture: ComponentFixture<VerifyComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let route: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'updateCurrentUser', 'isLoggedIn'
    ]);
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'verify', 'sendVerification'
    ]);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], [
      'params', 'fragment'
    ]);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ VerifyComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    fixture.detectChanges();
  });

  describe('with an id and token provided', () => {

    const validId = '123';
    const validToken = '456';

    beforeEach(() => {
      route.params = of({ id: validId });
      route.fragment = of(validToken);
      userService.verify.and.returnValue(of({}));
    });

    it('should verify the user', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(userService.verify).toHaveBeenCalledWith(validId, validToken);
      expect(authService.updateCurrentUser).toHaveBeenCalled();
    });

    it('should handle successful verification', () => {
      const container = fixture.nativeElement.querySelector('.verification-container');

      expect(container.textContent).toContain("Verifying your email address. Please wait.");
      expect(container.textContent).not.toContain("Your email address could not be verified.");
      expect(container.textContent).not.toContain("Thank you. Your email address has been verified.");

      component.ngOnInit();
      fixture.detectChanges();

      expect(container.textContent).toContain("Thank you. Your email address has been verified.");
      expect(container.textContent).not.toContain("Verifying your email address. Please wait.");
      expect(container.textContent).not.toContain("Your email address could not be verified.");
    });

    describe('when there is a verification error', () => {

      describe('if not logged in', () => {
        it('should handle failed verification, with no button', () => {
          authService.isLoggedIn.and.returnValue(false);
          userService.verify.and.returnValue(throwError(()=>{
            return { error: { message: "Verification failed" }};
          }));

          component.ngOnInit();
          fixture.detectChanges();

          expect(userService.verify).toHaveBeenCalled();
          expect(authService.updateCurrentUser).not.toHaveBeenCalled();

          const container = fixture.nativeElement.querySelector('.verification-container');
          expect(container.textContent).toContain("Your email address could not be verified.");
          expect(container.textContent).not.toContain("Thank you. Your email address has been verified.");
          expect(container.textContent).not.toContain("Verifying your email address. Please wait.");

          const button = fixture.nativeElement.querySelector('button');
          expect(button).toBeNull();
        });
      });

      describe('if logged in', () => {
        it('should handle failed verification, showing a button to resend a verification', () => {
          authService.isLoggedIn.and.returnValue(true);
          userService.verify.and.returnValue(throwError(()=>{
            return { error: { message: "Verification failed" }};
          }));

          component.ngOnInit();
          fixture.detectChanges();

          expect(userService.verify).toHaveBeenCalled();
          expect(authService.updateCurrentUser).not.toHaveBeenCalled();

          const container = fixture.nativeElement.querySelector('.verification-container');
          expect(container.textContent).toContain("Your email address could not be verified.");
          expect(container.textContent).not.toContain("Thank you. Your email address has been verified.");
          expect(container.textContent).not.toContain("Verifying your email address. Please wait.");

          const button = fixture.nativeElement.querySelector('button');
          expect(button).toBeTruthy();
        });
      });

      describe('parameter resolution race condition', () => {

        let getMockObservable: (response: any) => Observable<any>;
        let resolve: () => void = ()=>{};

        beforeEach(() => {
          getMockObservable = (response: any) => new Observable((subscriber) => {
            resolve = () => {
              subscriber.next(response)
              subscriber.complete();
            };
          });
        });

        it('should verify if token resolves before id', () => {
          route.params = getMockObservable({ id: validId });

          component.ngOnInit();

          expect(userService.verify).not.toHaveBeenCalled();
          resolve();
          expect(userService.verify).toHaveBeenCalled();
        });

        it('should verify if id resolves before token', () => {
          route.fragment = getMockObservable(validToken);

          component.ngOnInit();

          expect(userService.verify).not.toHaveBeenCalled();
          resolve();
          expect(userService.verify).toHaveBeenCalled();
        });
      });
    });

    describe('clicking the send verification button', () => {
      beforeEach(() => {
        authService.isLoggedIn.and.returnValue(true);
        userService.verify.and.returnValue(throwError(()=>{
          return { error: { message: "Verification failed" }};
        }));

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should send a verification email', () => {
        userService.sendVerification.and.returnValue(of({}));

        const button = fixture.nativeElement.querySelector('button');
        button.click();
        fixture.detectChanges();

        expect(component.emailSent).toBeTrue();
        expect(fixture.nativeElement.textContent).toContain(
          "Verification email has been resent."
        );
      });

      it('should handle an error', () => {
        userService.sendVerification.and.returnValue(throwError(()=>{
          return { error: { message: "Sending failed" }};
        }));

        const button = fixture.nativeElement.querySelector('button');
        button.click();
        fixture.detectChanges();

        expect(userService.sendVerification).toHaveBeenCalled();
        expect(component.emailSent).toBeFalse();
        expect(fixture.nativeElement.textContent).not.toContain(
          "Verification email has been resent."
        );
      });
    });
  });
});
