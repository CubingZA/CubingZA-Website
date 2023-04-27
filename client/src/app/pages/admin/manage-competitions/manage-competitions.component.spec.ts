import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCompetitionsComponent } from './manage-competitions.component';
import { Competition, CompetitionService } from 'src/app/services/competition/competition.service';
import { of, throwError } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { CompEditBoxComponent } from 'src/app/components/comp-edit-box/comp-edit-box.component';
import { ProvinceService } from 'src/app/services/province/province.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertsService } from 'src/app/components/alerts/alerts.service';
import { ModalService } from 'src/app/components/modal/modal.service';

let mockCompetitions: Competition[] = [
  {
    _id: "1",
    name: "Test Competition 1",
    registrationName: "TestRegName1",
    venue: "Test Venue",
    address: "Test Address",
    city: "Test City",
    province: "Gauteng",
    notificationsSent: false,
    startDate: new Date(2023, 1, 1),
    endDate: new Date(2023, 1, 2)
  },
  {
    _id: "2",
    name: "Another Competition 2",
    registrationName: "AnotherRegName2",
    venue: "Another Venue",
    address: "Another Address",
    city: "Another City",
    province: "Western Cape",
    notificationsSent: true,
    startDate: new Date(2123, 3, 3),
    endDate: new Date(2123, 3, 3)
  }
];

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

describe('ManageCompetitionsComponent', () => {
  let component: ManageCompetitionsComponent;
  let fixture: ComponentFixture<ManageCompetitionsComponent>;

  let competitionService: jasmine.SpyObj<CompetitionService>;
  let provinceService: jasmine.SpyObj<ProvinceService>;
  let alerts: jasmine.SpyObj<AlertsService>;
  let modalService: jasmine.SpyObj<ModalService>;

  const mockDate = new Date(2023, 1, 1);

  beforeEach(async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(mockDate);

    const competitionServiceSpy = jasmine.createSpyObj('CompetitionService', [
      'getAllCompetitions', 'getBlankCompetition', 'addCompetition', 'updateCompetition', 'deleteCompetition', 'sendNotifications'
    ]);
    competitionServiceSpy.getAllCompetitions.and.returnValue(of(mockCompetitions));
    competitionServiceSpy.getBlankCompetition.and.returnValue(blankCompetition);
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getAvailableProvinces'
    ]);
    const alertsServiceSpy = jasmine.createSpyObj('AlertsService', [
      'addAlert', 'clear'
    ]);
    const modalServiceSpy = jasmine.createSpyObj('ModalService', [
      'open', 'close', 'add', 'remove'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, FormsModule, ReactiveFormsModule],
      declarations: [ ManageCompetitionsComponent, ModalComponent, CompEditBoxComponent ],
      providers: [
        { provide: CompetitionService, useValue: competitionServiceSpy },
        { provide: ProvinceService, useValue: provinceServiceSpy },
        { provide: AlertsService, useValue: alertsServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCompetitionsComponent);
    component = fixture.componentInstance;

    competitionService = TestBed.inject(CompetitionService) as jasmine.SpyObj<CompetitionService>;
    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;
    modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should add the edit, confirm delete, and confirm send modals to the modal service', () => {
    expect(modalService.add).toHaveBeenCalledTimes(3);
    const addedModalIds = modalService.add.calls.allArgs().map(args => args[0].id);

    expect(addedModalIds).toContain('comp-edit-modal');
    expect(addedModalIds).toContain('comp-delete-confirm-modal');
    expect(addedModalIds).toContain('comp-send-notifications-modal');
  });

  describe('fetching competitions', () => {

    it('should fetch competitions on init', () => {
      expect(competitionService.getAllCompetitions).toHaveBeenCalled();
    });

    it('should handle an error when fetching competitions', () => {
      competitionService.getAllCompetitions.and.returnValue(throwError(()=>"Test Error"));
      component.ngOnInit();

      expect(alerts.addAlert).toHaveBeenCalledWith("danger", "Failed to fetch competitions");
    });
  });

  describe('filtering competitions', () => {
    it('should filter competitions by name', () => {
      let filterInput = fixture.nativeElement.querySelector('#compsearch');
      filterInput.value = "Competition 1";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredCompetitions();

      expect(result).toEqual([mockCompetitions[0]]);
    });

    it('should filter competitions by venue', () => {
      let filterInput = fixture.nativeElement.querySelector('#compsearch');
      filterInput.value = "Another Ven";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredCompetitions();

      expect(result).toEqual([mockCompetitions[1]]);
    });

    it('should filter competitions by city', () => {
      let filterInput = fixture.nativeElement.querySelector('#compsearch');
      filterInput.value = "Test City";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredCompetitions();

      expect(result).toEqual([mockCompetitions[0]]);
    });

    it('should filter competitions by province', () => {
      let filterInput = fixture.nativeElement.querySelector('#compsearch');
      filterInput.value = "Cape";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredCompetitions();

      expect(result).toEqual([mockCompetitions[1]]);
    });

    it('should filter competitions by registration name', () => {
      let filterInput = fixture.nativeElement.querySelector('#compsearch');
      filterInput.value = "AnotherRegName2";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredCompetitions();

      expect(result).toEqual([mockCompetitions[1]]);
    });

    it('should return an empty array if no competitions match the filter', () => {
      let filterInput = fixture.nativeElement.querySelector('#compsearch');
      filterInput.value = "Nothing matches this";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredCompetitions();

      expect(result).toEqual([]);
    });

    it('should return all competitions sorted newest to oldest if the filter is empty', () => {
      let filterInput = fixture.nativeElement.querySelector('#compsearch');
      filterInput.value = "";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredCompetitions();

      expect(result).toEqual([mockCompetitions[1], mockCompetitions[0]]);
    });

    it('should return a list of competitions sorted newest to oldest if multiple matches are found', () => {
      let filterInput = fixture.nativeElement.querySelector('#compsearch');
      filterInput.value = "Competition";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredCompetitions();

      expect(result).toEqual([mockCompetitions[1], mockCompetitions[0]]);
    });
  });

  describe('adding a competition', () => {

    describe('clicking the add competition button', () => {
      let addCompSpy: jasmine.Spy;

      beforeEach(() => {
        addCompSpy = spyOn(component, 'startAddCompetition').and.callThrough();

        let addCompButton = fixture.nativeElement.querySelector('#comp-add-button');
        addCompButton.click();
        fixture.detectChanges();
      });

      it('should call startAddCompetition', () => {
        expect(addCompSpy).toHaveBeenCalled();
      });

      it('should not have a competition selected', () => {
        expect(component.selectedCompetition).toEqual(blankCompetition);
      });

      it('should open the modal', () => {
        expect(modalService.open).toHaveBeenCalledWith('comp-edit-modal');
      });

      it('should set the modal title', () => {
        expect(component.editModalTitle).toEqual("Add Competition");
      });
    });

    describe('cancelling the modal', () => {
      beforeEach(() => {
        component.startAddCompetition();
        fixture.detectChanges();
      });

      it('should close the modal', () => {
        component.closeEditModal();
        expect(modalService.close).toHaveBeenCalledWith('comp-edit-modal');
      });

      it('should not save the competition', () => {
        component.closeEditModal();
        expect(competitionService.addCompetition).not.toHaveBeenCalled();
      });
    });
  });

  describe('editing a competition', () => {

    describe('clicking the edit button', () => {
      let editCompSpy: jasmine.Spy;

      beforeEach(() => {
        editCompSpy = spyOn(component, 'startEditCompetition').and.callThrough();

        let editCompButton = fixture.nativeElement.querySelector('.comp-edit-control');
        editCompButton.click();
        fixture.detectChanges();
      });

      it('should call startEditCompetition', () => {
        expect(editCompSpy).toHaveBeenCalled();
      });

      it('should set the selected competition', () => {
        expect(component.selectedCompetition).toEqual(mockCompetitions[1]);
      });

      it('should open the modal', () => {
        expect(modalService.open).toHaveBeenCalledWith('comp-edit-modal');
      });

      it('should set the modal title', () => {
        expect(component.editModalTitle).toEqual("Edit Competition");
      });
    });

    describe('cancelling the modal', () => {
      beforeEach(() => {
        component.startEditCompetition(mockCompetitions[1]);
        fixture.detectChanges();
      });

      it('should close the modal', () => {
        component.closeEditModal();
        expect(modalService.close).toHaveBeenCalledWith('comp-edit-modal');
      });

      it('should not save the competition', () => {
        component.closeEditModal();
        expect(competitionService.updateCompetition).not.toHaveBeenCalled();
      });
    });
  });

  describe('saving the competition', () => {
    beforeEach(() => {
      component.startAddCompetition();
      fixture.detectChanges();
    });

    it('should add a new competition if there is no ID', () => {
      component.selectedCompetition = blankCompetition;
      competitionService.addCompetition.and.returnValue(of(blankCompetition));

      component.saveCompetition(component.selectedCompetition);
      expect(competitionService.addCompetition).toHaveBeenCalledWith(blankCompetition);
    });

    it('should update an existing competition if there is an ID', () => {
      component.selectedCompetition = mockCompetitions[0];
      competitionService.updateCompetition.and.returnValue(of(mockCompetitions[0]));

      component.saveCompetition(component.selectedCompetition);
      expect(competitionService.updateCompetition).toHaveBeenCalledWith(mockCompetitions[0]);
    });

    it('should handle errors', () => {
      component.selectedCompetition = blankCompetition;
      competitionService.addCompetition.and.returnValue(throwError(() => new Error()));

      component.saveCompetition(component.selectedCompetition);
      expect(alerts.clear).toHaveBeenCalled();
      expect(alerts.addAlert).toHaveBeenCalledWith("danger", "Error while saving competition");
    });
  });

  describe('deleting a competition', () => {

    describe('clicking the delete button', () => {
      let deleteCompSpy: jasmine.Spy;

      beforeEach(() => {
        deleteCompSpy = spyOn(component, 'startDeleteCompetition').and.callThrough();

        let deleteCompButton = fixture.nativeElement.querySelector('.comp-delete-control');
        deleteCompButton.click();
        fixture.detectChanges();
      });

      it('should call startDeleteCompetition', () => {
        expect(deleteCompSpy).toHaveBeenCalled();
      });

      it('should set the selected competition', () => {
        expect(component.selectedCompetition).toEqual(mockCompetitions[1]);
      });

      it('should open the modal', () => {
        expect(modalService.open).toHaveBeenCalledWith('comp-delete-confirm-modal');
      });

      it('should not delete the competition yet', () => {
        expect(competitionService.deleteCompetition).not.toHaveBeenCalled();
      });
    });

    describe('cancelling the modal', () => {

      beforeEach(() => {
        component.startDeleteCompetition(mockCompetitions[1]);
        fixture.detectChanges();
      });

      it('should close the modal', () => {
        component.closeConfirmDeleteModal();
        expect(modalService.close).toHaveBeenCalledWith('comp-delete-confirm-modal');
      });

      it('should not delete the competition', () => {
        component.closeConfirmDeleteModal();
        expect(competitionService.deleteCompetition).not.toHaveBeenCalled();
      });
    });

    describe('confirming the delete', () => {

      beforeEach(() => {
        component.startDeleteCompetition(mockCompetitions[1]);
        fixture.detectChanges();
      });

      it('should delete the competition', () => {
        competitionService.deleteCompetition.and.returnValue(of({}));
        component.deleteSelectedCompetition();
        expect(competitionService.deleteCompetition).toHaveBeenCalledWith(mockCompetitions[1]._id);
      });

      it('should handle errors', () => {
        competitionService.deleteCompetition.and.returnValue(throwError(() => 'Error'));
        component.deleteSelectedCompetition();
        expect(alerts.clear).toHaveBeenCalled();
        expect(alerts.addAlert).toHaveBeenCalledWith('danger', 'Error while deleting competition');
      });
    });
  });

  describe('sending notifications', () => {

    describe('clicking the send notifications button', () => {

      beforeEach(() => {
        let sendNotificationsButton = fixture.nativeElement.querySelector('.comp-send-notifications-control');
        sendNotificationsButton.click();
        fixture.detectChanges();
      });

      it('should open the modal', () => {
        expect(modalService.open).toHaveBeenCalledWith('comp-send-notifications-modal');
      });

      it('should not send notifications yet', () => {
        expect(competitionService.sendNotifications).not.toHaveBeenCalled();
      });
    });

    describe('cancelling the modal', () => {

      beforeEach(() => {
        component.startSendNotifications(mockCompetitions[1]);
        fixture.detectChanges();
      });

      it('should close the modal', () => {
        component.closeSendNotificationsModal();
        expect(modalService.close).toHaveBeenCalledWith('comp-send-notifications-modal');
      });

      it('should not send notifications', () => {
        component.closeSendNotificationsModal();
        expect(competitionService.sendNotifications).not.toHaveBeenCalled();
      });
    });

    describe('confirming the send notifications', () => {

      beforeEach(() => {
        component.startSendNotifications(mockCompetitions[1]);
        fixture.detectChanges();
      });

      it('should send notifications', () => {
        competitionService.sendNotifications.and.returnValue(of({}));
        component.sendNotifications();
        expect(competitionService.sendNotifications).toHaveBeenCalledWith(mockCompetitions[1]);
      });

      it('should handle errors', () => {
        competitionService.sendNotifications.and.returnValue(throwError(() => 'Error'));
        component.sendNotifications();
        expect(alerts.clear).toHaveBeenCalled();

        expect(alerts.addAlert).toHaveBeenCalledWith("danger", "Error while sending notifications");
      });
    });
  });
});
