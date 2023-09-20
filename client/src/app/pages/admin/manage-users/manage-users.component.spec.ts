import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManageUsersComponent } from './manage-users.component';
import { UserService } from 'src/app/services/user/user.service';
import { ProvinceService } from 'src/app/services/province/province.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { ModalService } from 'src/app/components/modal/modal.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

import { User } from 'src/app/interfaces/user/user';

const mockUserData: User[] = [
  {
    "_id": "0",
    "name": "Test Person",
    "email": "test@example.com",
    "role": "user",
    "provider": ["local"],
    "notificationSettings": {
      "GT": true,
      "MP": false,
      "LM": false,
      "NW": false,
      "FS": false,
      "KZ": false,
      "EC": false,
      "WC": false,
      "NC": false
    }
  },

  {
    "_id": "1",
    "name": "Another one",
    "email": "oauth@example.com",
    "role": "user",
    "provider": ["wca"],
    "notificationSettings": {
      "GT": false,
      "MP": false,
      "LM": false,
      "NW": false,
      "FS": false,
      "KZ": false,
      "EC": false,
      "WC": false,
      "NC": false
    }
  },
  {
    "_id": "2",
    "name": "Unverified Person",
    "email": "unver@example.com",
    "role": "unverified",
    "provider": ["local"],
    "notificationSettings": {
      "GT": false,
      "MP": true,
      "LM": true,
      "NW": false,
      "FS": false,
      "KZ": false,
      "EC": false,
      "WC": false,
      "NC": false
    }
  },
  {
    "_id": "3",
    "name": "Someone Guy",
    "email": "somethingelse@example.com",
    "role": "admin",
    "provider": ["local"],
    "notificationSettings": {
      "GT": true,
      "MP": true,
      "LM": false,
      "NW": false,
      "FS": false,
      "KZ": false,
      "EC": false,
      "WC": false,
      "NC": false
    }
  }
];

describe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;

  let userService: jasmine.SpyObj<UserService>;
  let provinceService: jasmine.SpyObj<ProvinceService>;
  let modalService: jasmine.SpyObj<ModalService>;
  let alerts: jasmine.SpyObj<AlertsService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getAllUsers', 'deleteUser'
    ]);
    userServiceSpy.getAllUsers.and.returnValue(of(mockUserData));

    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getProvinceName'
    ]);
    provinceServiceSpy.getProvinceName.and.callFake((provinceCode: string) => {
      switch (provinceCode) {
        case "GT":
          return "Gauteng";
        case "MP":
          return "Mpumalanga";
        case "LM":
          return "Limpopo";
        default:
          return "Other Province";
      }
    });

    const modalServiceSpy = jasmine.createSpyObj('ModalService', [
      'add', 'open', 'close', 'remove'
    ]);
    const alertsSpy = jasmine.createSpyObj('AlertsService', [
      'addAlert', 'clear'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, FormsModule, ReactiveFormsModule],
      declarations: [ ManageUsersComponent, ModalComponent ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ProvinceService, useValue: provinceServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: AlertsService, useValue: alertsSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;
    modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;

    fixture.detectChanges();
  });

  it('should add the delete confirmation modal to the modal service', () => {
    expect(modalService.add).toHaveBeenCalledTimes(1);
    const addedModalIds = modalService.add.calls.allArgs().map(args => args[0].id);

    expect(addedModalIds).toContain('confirm-delete-modal');
  });

  describe('fetching users', () => {

    it('should fetch all users on init', () => {
      expect(userService.getAllUsers).toHaveBeenCalled();
    });

    it('should handle an error when fetching users', () => {
      userService.getAllUsers.and.returnValue(throwError(()=>"Test Error"));
      component.ngOnInit();

      expect(alerts.addAlert).toHaveBeenCalledWith("danger", "Failed to fetch users");
    });
  });

  describe('get province string', () => {

    it('should return the provinces when given a user', () => {
      let result = component.getProvinceString(mockUserData[0]);
      expect(result).toEqual("Gauteng");

      result = component.getProvinceString(mockUserData[1]);
      expect(result).toEqual("");

      result = component.getProvinceString(mockUserData[2]);
      expect(result).toEqual("Limpopo, Mpumalanga");
    });
  });

  describe('filtering users', () => {

    it('should filter users by name', () => {
      let filterInput = fixture.nativeElement.querySelector('#usersearch');
      filterInput.value = "nother on";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredUsers();

      expect(result).toEqual([mockUserData[1]]);
    });

    it('should filter users by email', () => {
      let filterInput = fixture.nativeElement.querySelector('#usersearch');
      filterInput.value = "test@example.com";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredUsers();

      expect(result).toEqual([mockUserData[0]]);
    });

    it('should filter users by role', () => {
      let filterInput = fixture.nativeElement.querySelector('#usersearch');
      filterInput.value = "admin";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredUsers();

      expect(result).toEqual([mockUserData[3]]);
    });

    it('should filter users by provider', () => {
      let filterInput = fixture.nativeElement.querySelector('#usersearch');
      filterInput.value = "wca";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredUsers();

      expect(result).toEqual([mockUserData[1]]);
    });

    it('should return an empty list when no users match the filter', () => {
      let filterInput = fixture.nativeElement.querySelector('#usersearch');
      filterInput.value = "nothing should match";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredUsers();

      expect(result).toEqual([]);
    });

    it('should return a sorted array when there are multiple matches', () => {
      let filterInput = fixture.nativeElement.querySelector('#usersearch');
      filterInput.value = "local";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredUsers();

      expect(result).toEqual([mockUserData[3], mockUserData[0], mockUserData[2]]);
    });

    it('should return all users when the filter is empty', () => {
      let filterInput = fixture.nativeElement.querySelector('#usersearch');
      filterInput.value = "";
      filterInput.dispatchEvent(new Event('input'));

      let result = component.getFilteredUsers();

      expect(result).toEqual([mockUserData[1], mockUserData[3], mockUserData[0], mockUserData[2]]);
    });
  });

  describe('deleting a user', () => {

    describe('clicking the delete button', () => {

      beforeEach(() => {
        const deleteButton = fixture.nativeElement.querySelector('.delete-user-control');
        deleteButton.click();
        fixture.detectChanges();
      });

      it('should set the user to delete', () => {
        expect(component.userToDelete).toEqual(mockUserData[1]);
      });

      it('should open the confirm delete modal', () => {
        expect(modalService.open).toHaveBeenCalledWith('confirm-delete-modal');
      });

      it('should not delete the user yet', () => {
        expect(userService.deleteUser).not.toHaveBeenCalled();
      });
    });

    describe('canceling the modal', () => {

      beforeEach(() => {
        component.openConfirmDeleteModal(mockUserData[1]);
        fixture.detectChanges();
        component.closeConfirmDeleteModal();
      });

      it('should close the modal', () => {
        expect(modalService.close).toHaveBeenCalledWith('confirm-delete-modal');
      });

      it('should clear the user to delete', () => {
        expect(component.userToDelete).toBeNull();
      });

      it('should not delete the user', () => {
        expect(userService.deleteUser).not.toHaveBeenCalled();
      });
    });

    describe('confirming the delete', () => {

      beforeEach(() => {
        component.openConfirmDeleteModal(mockUserData[1]);
        fixture.detectChanges();
      });

      it('should delete the user', () => {
        userService.deleteUser.and.returnValue(of({}));
        component.confirmDeleteUser();
        expect(userService.deleteUser).toHaveBeenCalledWith(mockUserData[1]._id);
      });

      it('should handle an error when deleting the user', () => {
        userService.deleteUser.and.returnValue(throwError(()=>"Test Error"));
        component.openConfirmDeleteModal(mockUserData[1]);
        fixture.detectChanges();
        component.confirmDeleteUser();

        expect(alerts.addAlert).toHaveBeenCalledWith("danger", "Error deleting user");
      });
    });
  });
});
