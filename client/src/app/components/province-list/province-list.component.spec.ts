import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceListComponent } from './province-list.component';
import { ProvinceService } from 'src/app/services/province/province.service';

describe('ProvinceListComponent', () => {
  let component: ProvinceListComponent;
  let fixture: ComponentFixture<ProvinceListComponent>;

  let provinceService: jasmine.SpyObj<ProvinceService>;

  beforeEach(async () => {
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getProvinceSelection', 'toggleProvince', 'getProvinceName'
    ]);
    await TestBed.configureTestingModule({
      declarations: [ ProvinceListComponent ],
      providers: [
        { provide: ProvinceService, useValue: provinceServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinceListComponent);
    component = fixture.componentInstance;

    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
