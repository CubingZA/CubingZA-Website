import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCompetitionsComponent } from './manage-competitions.component';
import { CompetitionService } from 'src/app/services/competition/competition.service';
import { of } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { CompEditBoxComponent } from 'src/app/components/comp-edit-box/comp-edit-box.component';
import { ProvinceService } from 'src/app/services/province/province.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

let mockCompetitions = [
  {
    id: 1,
    name: "Test Competition 1",
    registrationName: "TestRegName1",
    venue: "Test Venue",
    city: "Test City",
    province: "Gauteng",
    notificationsSent: false,
    startDate: new Date(2023, 1, 1),
    endDate: new Date(2023, 1, 2)
  },
  {
    id: 2,
    name: "Another Competition 2",
    registrationName: "AnotherRegName2",
    venue: "Another Venue",
    city: "Another City",
    province: "Western Cape",
    notificationsSent: true,
    startDate: new Date(2023, 3, 3),
    endDate: new Date(2023, 3, 3)
  }
];

describe('ManageCompetitionsComponent', () => {
  let component: ManageCompetitionsComponent;
  let fixture: ComponentFixture<ManageCompetitionsComponent>;

  let competitionService: jasmine.SpyObj<CompetitionService>;
  let provinceService: jasmine.SpyObj<ProvinceService>;

  beforeEach(async () => {

    const competitionServiceSpy = jasmine.createSpyObj('CompetitionService', [
      'getAllCompetitions', 'getBlankCompetition'
    ]);
    competitionServiceSpy.getAllCompetitions.and.returnValue(of(mockCompetitions));
    competitionServiceSpy.getBlankCompetition.and.returnValue({
      _id: "",
      name: "",
      registrationName: "",
      address: "",
      venue: "",
      city: "",
      province: "",
      startDate: new Date(),
      endDate: new Date(),
    });
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getAvailableProvinces'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, FormsModule, ReactiveFormsModule],
      declarations: [ ManageCompetitionsComponent, ModalComponent, CompEditBoxComponent ],
      providers: [
        { provide: CompetitionService, useValue: competitionServiceSpy },
        { provide: ProvinceService, useValue: provinceServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCompetitionsComponent);
    component = fixture.componentInstance;

    competitionService = TestBed.inject(CompetitionService) as jasmine.SpyObj<CompetitionService>;
    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
