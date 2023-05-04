import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceListComponent } from './province-list.component';
import { ProvinceService } from 'src/app/services/province/province.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const mockProvinceSelection = {
  GT: true,
  MP: false,
  LM: false,
  NW: false,
  FS: false,
  KZ: false,
  EC: false,
  WC: true,
  NC: false
};
const mockNoSelection = {
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

describe('ProvinceListComponent', () => {
  let component: ProvinceListComponent;
  let fixture: ComponentFixture<ProvinceListComponent>;

  let provinceService: jasmine.SpyObj<ProvinceService>;

  beforeEach(async () => {
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getProvinceSelection', 'toggleProvince', 'getProvinceName'
    ]);
    provinceServiceSpy.getProvinceName.and.callFake((key: keyof typeof mockProvinceSelection) => {
      switch (key) {
        case 'GT': return 'Gauteng';
        case 'WC': return 'Western Cape';
        default: return 'Other Province'; // not used in this test
      }
    });

    await TestBed.configureTestingModule({
      imports: [ FontAwesomeModule ],
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

  it('should have an empty list if no provinces are selected', () => {
    provinceService.getProvinceSelection.and.returnValue(mockNoSelection);
    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll('.province-list-item');
    expect(listItems.length).toEqual(1);
    expect(listItems[0].textContent).toContain('No provinces selected');
  });

  it('should have a list item for each selected province', () => {
    provinceService.getProvinceSelection.and.returnValue(mockProvinceSelection);
    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll('.province-list-item');
    expect(listItems.length).toEqual(2);

    expect(listItems[0].textContent).toContain('Gauteng');
    expect(listItems[1].textContent).toContain('Western Cape');
  });

  it('should toggle the province when the list item is clicked', () => {
    provinceService.getProvinceSelection.and.returnValue(mockProvinceSelection);
    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll('.province-list-item');
    listItems[0].click();
    expect(provinceService.toggleProvince).toHaveBeenCalledTimes(1);
    expect(provinceService.toggleProvince).toHaveBeenCalledWith('GT');

    listItems[1].click();
    expect(provinceService.toggleProvince).toHaveBeenCalledTimes(2);
    expect(provinceService.toggleProvince).toHaveBeenCalledWith('WC');
  });
});
