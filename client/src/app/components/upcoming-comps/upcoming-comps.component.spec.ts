import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingCompsComponent } from './upcoming-comps.component';
import { CompetitionService } from 'src/app/services/competition/competition.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const mockCompetitions = [
  {
    id: 1,
    name: 'Test Competition 1',
    registrationName: 'TestRegistrationName1',
    venue: 'Test Venue 1',
    address: 'Test Address 1',
    city: 'Test City 1',
    province: 'Gauteng',
    notificationsSent: false,
    startDate: new Date(2123, 1, 1),
    endDate: new Date(2123, 1, 2),
  },
  {
    id: 2,
    name: 'Test Competition 2',
    registrationName: 'TestRegistrationName2',
    venue: 'Test Venue 2',
    address: 'Test Address 2',
    city: 'Test City 2',
    province: 'Gauteng',
    notificationsSent: false,
    startDate: new Date(2123, 3, 4),
    endDate: new Date(2123, 3, 4)
  }
];

describe('UpcomingCompsComponent', () => {
  let component: UpcomingCompsComponent;
  let fixture: ComponentFixture<UpcomingCompsComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let compService: jasmine.SpyObj<CompetitionService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn'
    ]);
    const compServiceSpy = jasmine.createSpyObj('CompetitionService', [
      'getUpcomingCompetitions'
    ]);
    compServiceSpy.getUpcomingCompetitions.and.returnValue(
      of(mockCompetitions)
    );

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule],
      declarations: [ UpcomingCompsComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CompetitionService, useValue: compServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingCompsComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    compService = TestBed.inject(CompetitionService) as jasmine.SpyObj<CompetitionService>;

    fixture.detectChanges();
  });

  it('should create and show a list of competitions', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.comp-list-card').length).toEqual(2);
  });

  it('should show a message if there are no upcoming competitions', () => {
    compService.getUpcomingCompetitions.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.upcoming-comps-box').textContent)
    .toContain('No upcoming competitions');
    expect(fixture.nativeElement.querySelectorAll('.comp-list-card').length).toEqual(0);
  });

  it('should handle an server timeout when fetching competitions', () => {
    compService.getUpcomingCompetitions.and.returnValue(throwError(()=>{return {status: 504}}));
    component.ngOnInit();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p').textContent)
    .toContain('Could not fetch upcoming competitions. The server is not responding.');
    expect(fixture.nativeElement.querySelectorAll('.comp-list-card').length).toEqual(0);

  });

  it('should handle other errors when fetching competitions', () => {
    compService.getUpcomingCompetitions.and.returnValue(throwError(()=>{return {status: 500}}));
    component.ngOnInit();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p').textContent)
    .toContain('Could not fetch upcoming competitions. Please try again later.');
    expect(fixture.nativeElement.querySelectorAll('.comp-list-card').length).toEqual(0);
  });
});
