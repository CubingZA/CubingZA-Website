import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingsComponent } from './rankings.component';
import { MockComponent } from 'ng-mocks';
import { RankingTableComponent } from 'src/app/components/ranking-table/ranking-table.component';
import { ProvinceService } from 'src/app/services/province/province.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


describe('RankingsComponent', () => {
  let component: RankingsComponent;
  let fixture: ComponentFixture<RankingsComponent>;

  let provinceService: jasmine.SpyObj<ProvinceService>;

  beforeEach(() => {
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getAvailableProvincesWithCodes'
    ]);

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        RankingsComponent,
        MockComponent(RankingTableComponent)
      ],
      providers: [
        { provide: ProvinceService, useValue: provinceServiceSpy }
      ]
    });
    fixture = TestBed.createComponent(RankingsComponent);
    component = fixture.componentInstance;

    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
