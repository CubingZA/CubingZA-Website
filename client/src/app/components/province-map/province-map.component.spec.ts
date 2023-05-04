import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceMapComponent } from './province-map.component';
import { ProvinceService, ProvinceSelection } from 'src/app/services/province/province.service';

const mockProvinceSelection = {
  GT: false,
  MP: false,
  LM: false,
  NW: false,
  FS: false,
  KZ: false,
  EC: false,
  WC: false,
  NC: false
};

describe('ProvinceMapComponent', () => {
  let component: ProvinceMapComponent;
  let fixture: ComponentFixture<ProvinceMapComponent>;

  let provinceService: jasmine.SpyObj<ProvinceService>;

  beforeEach(async () => {
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getProvinceSelection', 'toggleProvince'
    ]);
    provinceServiceSpy.getProvinceSelection.and.returnValue(mockProvinceSelection);

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

  describe('the map', () => {

    const provinces = [
      'GT', 'MP', 'LM', 'NW', 'FS', 'KZ', 'EC', 'WC', 'NC'
    ];
    provinces.forEach(province => {
      describe(`the ${province} element`, () => {

        let element: HTMLElement;

        beforeEach(() => {
          element = fixture.nativeElement.querySelector(`#${province}`);
        });

        it(`should have an element for ${province}`, () => {
          expect(element).toBeTruthy();
        });

        it(`should not be active when not selected`, () => {
          expect(element.classList).not.toContain('active');
        });

        it(`should toggle the province when the ${province} element is clicked`, () => {
          element.dispatchEvent(new Event('click'));
          fixture.detectChanges();
          expect(provinceService.toggleProvince).toHaveBeenCalledWith(province as keyof ProvinceSelection);
        });

        it(`should be active when selected`, () => {
          provinceService.getProvinceSelection.and.returnValue({
            ...mockProvinceSelection,
            [province]: true
          });
          fixture.detectChanges();
          expect(element.classList).toContain('active');
        });
      });
    });
  });
});
