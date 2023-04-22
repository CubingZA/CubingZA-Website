import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceMapComponent } from './province-map.component';
import { ProvinceService } from 'src/app/services/province/province.service';

describe('ProvinceMapComponent', () => {
  let component: ProvinceMapComponent;
  let fixture: ComponentFixture<ProvinceMapComponent>;

  let provinceService: jasmine.SpyObj<ProvinceService>;

  beforeEach(async () => {
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getProvinceSelection', 'toggleProvince'
    ]);
    await TestBed.configureTestingModule({
      declarations: [ ProvinceMapComponent ],
      providers: [
        { provide: ProvinceService, useValue: provinceServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinceMapComponent);
    component = fixture.componentInstance;

    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
