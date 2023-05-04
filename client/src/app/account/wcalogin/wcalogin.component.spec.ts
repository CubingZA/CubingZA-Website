import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WcaLoginComponent } from './wcalogin.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';

describe('WcaloginComponent', () => {
  let component: WcaLoginComponent;
  let fixture: ComponentFixture<WcaLoginComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let cookieService: jasmine.SpyObj<CookieService>;

  const testToken = 'testToken';

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'finishLoginProcess'
    ]);
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', [
      'get', 'delete'
    ]);
    cookieServiceSpy.get.and.returnValue(testToken);

    await TestBed.configureTestingModule({
      declarations: [ WcaLoginComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CookieService, useValue: cookieServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WcaLoginComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;

    fixture.detectChanges();
  });

  it('should finish the login process', () => {
    expect(authService.finishLoginProcess).toHaveBeenCalledWith(testToken);
  });

  it('should delete the WCA cookie', () => {
    const cookieName = 'wcaToken'
    expect(cookieService.get).toHaveBeenCalledWith(cookieName);
    expect(cookieService.delete).toHaveBeenCalledWith(cookieName);
  });
});
