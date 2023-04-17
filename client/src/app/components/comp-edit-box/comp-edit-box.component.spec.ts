import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompEditBoxComponent } from './comp-edit-box.component';
import { CompetitionService } from 'src/app/services/competition/competition.service';
import { ProvinceService } from 'src/app/services/province/province.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('CompEditBoxComponent', () => {
  let component: CompEditBoxComponent;
  let fixture: ComponentFixture<CompEditBoxComponent>;

  let competitionService: jasmine.SpyObj<CompetitionService>;
  let provinceService: jasmine.SpyObj<ProvinceService>;

  beforeEach(async () => {
    const competitionServiceSpy = jasmine.createSpyObj('CompetitionService', [
      'getBlankCompetition'
    ]);
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getAvailableProvinces'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, FormsModule, ReactiveFormsModule],
      declarations: [ CompEditBoxComponent ],
      providers: [
        { provide: CompetitionService, useValue: competitionServiceSpy },
        { provide: ProvinceService, useValue: provinceServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompEditBoxComponent);
    component = fixture.componentInstance;

    competitionService = TestBed.inject(CompetitionService) as jasmine.SpyObj<CompetitionService>;
    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
