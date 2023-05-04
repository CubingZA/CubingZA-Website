import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompEditBoxComponent } from './comp-edit-box.component';
import { Competition, CompetitionService } from 'src/app/services/competition/competition.service';
import { ProvinceService } from 'src/app/services/province/province.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


describe('CompEditBoxComponent', () => {
  let component: CompEditBoxComponent;
  let fixture: ComponentFixture<CompEditBoxComponent>;

  let competitionService: jasmine.SpyObj<CompetitionService>;
  let provinceService: jasmine.SpyObj<ProvinceService>;

  let closeFn: jasmine.Spy;
  let saveFn: jasmine.Spy;

  const mockDate = new Date('2023-01-02');

  const mockCompetition: Competition = {
    _id: '1',
    name: 'Competition 1',
    registrationName: 'Competition 1',
    venue: 'Venue 1',
    address: 'Address 1',
    city: 'City 1',
    province: 'Province 1',
    startDate: new Date('2021-02-03'),
    endDate: new Date('2021-02-03')
  };

  const mockMultiDayCompetition: Competition = {
    _id: '2',
    name: 'Competition 2',
    registrationName: 'Competition 2',
    venue: 'Venue 2',
    address: 'Address 2',
    city: 'City 2',
    province: 'Province 2',
    startDate: new Date('2021-02-03'),
    endDate: new Date('2021-02-05')
  };

  const blankCompetition: Competition = {
    _id: "",
    name: "",
    registrationName: "",
    address: "",
    venue: "",
    city: "",
    province: "",
    startDate: new Date(),
    endDate: new Date(),
  };

  beforeEach(async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(mockDate);

    const competitionServiceSpy = jasmine.createSpyObj('CompetitionService', [
      'getBlankCompetition'
    ]);
    competitionServiceSpy.getBlankCompetition.and.returnValue(blankCompetition);
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

    closeFn = jasmine.createSpy('closeFn');
    saveFn = jasmine.createSpy('saveFn');
    component.closeFn = closeFn;
    component.saveFn = saveFn;

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('initialisation', () => {
    it('should initialise with a blank competition if no competition is specified', () => {
      expect(component.compName.value).toBe('');
      expect(component.registrationName.value).toBe('');
      expect(component.venue.value).toBe('');
      expect(component.address.value).toBe('');
      expect(component.city.value).toBe('');
      expect(component.province.value).toBe('');
      expect(component.startDate.value).toBe(mockDate.toISOString().substring(0, 10));
      expect(component.endDate.value).toBe(mockDate.toISOString().substring(0, 10));
    });

    it('should initialise with the provided competition', () => {
      component.competition = {...mockCompetition};
      fixture.detectChanges();

      expect(component.compName.value).toBe(mockCompetition.name);
      expect(component.registrationName.value).toBe(mockCompetition.registrationName);
      expect(component.venue.value).toBe(mockCompetition.venue);
      expect(component.address.value).toBe(mockCompetition.address);
      expect(component.city.value).toBe(mockCompetition.city);
      expect(component.province.value).toBe(mockCompetition.province);
      expect(component.startDate.value).toBe(mockCompetition.startDate.toISOString().substring(0, 10));
      expect(component.endDate.value).toBe(mockCompetition.endDate.toISOString().substring(0, 10));
    });
  });

  describe('clicking the close button', () => {
    beforeEach(() => {
      component.competition = {...mockCompetition};
      fixture.detectChanges();

      let closeButton = fixture.nativeElement.querySelector('#comp-edit-close-button');
      closeButton.click();
      fixture.detectChanges();
    });

    it('should close the modal', () => {
      expect(closeFn).toHaveBeenCalled();
    });

    it('should not call the save function', () => {
      expect(saveFn).not.toHaveBeenCalled();
    });

    it('should reset the form', () => {
      expect(component.compName.value).toBeNull();
      expect(component.registrationName.value).toBeNull();
      expect(component.venue.value).toBeNull();
      expect(component.address.value).toBeNull();
      expect(component.city.value).toBeNull();
      expect(component.province.value).toBeNull();
      expect(component.startDate.value).toBeNull();
      expect(component.endDate.value).toBeNull();
    });

    it('should have a blank competition', () => {
      expect(component['_competition']).toEqual(blankCompetition);
    });
  });

  describe('clicking the save button', () => {

    describe('with a valid competition', () => {
      beforeEach(() => {
        component.competition = {...mockCompetition};
        fixture.detectChanges();

        let saveButton = fixture.nativeElement.querySelector('#comp-edit-save-button');
        saveButton.click();
        fixture.detectChanges();
      });

      it('should call the save function with the competition', () => {
        expect(saveFn).toHaveBeenCalledWith(mockCompetition);
      });

      it('should close the modal', () => {
        expect(closeFn).toHaveBeenCalled();
      });
    });

    describe('with an invalid competition', () => {
      it('should have a disabled save button', () => {
        let saveButton = fixture.nativeElement.querySelector('#comp-edit-save-button');
        expect(saveButton.disabled).toBeTrue();
      });
    });
  });

  describe('multi-day competition', () => {

    describe('the multi-day checkbox', () => {
      it('should be unchecked by default and hide the end date field if the start and end dates are the same', () => {
        component.competition = {...mockCompetition};
        fixture.detectChanges();

        expect(component.multiDay.value).toBeFalse();
        expect(fixture.nativeElement.querySelector('#comp-edit-end-date')).toBeNull();
      });

      it('should be checked by default and show the end date field if the start and end dates are different', () => {
        component.competition = {...mockMultiDayCompetition};
        fixture.detectChanges();

        expect(component.multiDay.value).toBeTrue();
        expect(fixture.nativeElement.querySelector('#comp-edit-end-date')).toBeTruthy();
      });

      it('should toggle hiding the end date when checked and unchecked', () => {
        component.competition = {...mockCompetition};
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('#comp-edit-end-date')).toBeNull();

        const multiDayCheckbox = fixture.nativeElement.querySelector('#comp-edit-multi-day');
        multiDayCheckbox.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('#comp-edit-end-date')).toBeTruthy();
        multiDayCheckbox.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('#comp-edit-end-date')).toBeNull();
      });
    });

    describe('saving a multi-day and sngle day competitions', () => {

      it('should set the end date to the start date if the multi-day checkbox is unchecked', () => {
        component.competition = {...mockMultiDayCompetition};
        fixture.detectChanges();

        const multiDayCheckbox = fixture.nativeElement.querySelector('#comp-edit-multi-day');
        multiDayCheckbox.click();
        fixture.detectChanges();

        let saveButton = fixture.nativeElement.querySelector('#comp-edit-save-button');
        saveButton.click();
        fixture.detectChanges();

        let expectedResult = {...mockMultiDayCompetition};
        expectedResult.endDate = expectedResult.startDate;
        expect(saveFn).toHaveBeenCalledWith(expectedResult);
      });

      it('should not change the end date if the multi-day checkbox is unchecked and checked again', () => {
        component.competition = {...mockMultiDayCompetition};
        fixture.detectChanges();

        const multiDayCheckbox = fixture.nativeElement.querySelector('#comp-edit-multi-day');
        multiDayCheckbox.click();
        fixture.detectChanges();
        multiDayCheckbox.click();
        fixture.detectChanges();

        let saveButton = fixture.nativeElement.querySelector('#comp-edit-save-button');
        saveButton.click();
        fixture.detectChanges();

        let expectedResult = {...mockMultiDayCompetition};
        expect(saveFn).toHaveBeenCalledWith(expectedResult);
      });
    });
  });
});
