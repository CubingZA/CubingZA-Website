import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WcaLoginComponent } from './wcalogin.component';
import { AuthService } from 'src/app/services/auth/auth.service';

describe('WcaloginComponent', () => {
  let component: WcaLoginComponent;
  let fixture: ComponentFixture<WcaLoginComponent>;

  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'finishLoginProcess'
    ]);
    await TestBed.configureTestingModule({
      declarations: [ WcaLoginComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WcaLoginComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
