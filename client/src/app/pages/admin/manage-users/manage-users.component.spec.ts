import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUsersComponent } from './manage-users.component';
import { UserService } from 'src/app/services/user/user.service';
import { ProvinceService } from 'src/app/services/province/province.service';
import { of } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const mockUserData = [
  {
    "name": "Test Person",
    "email": "test@example.com",
    "role": "user",
    "provider": "local",
    "password": "Encrypted-password--!",
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
    "name": "Another one",
    "role": "user",
    "provider": "wca",
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
    "name": "Unverified Person",
    "email": "test@example.com",
    "role": "unverified",
    "verificationToken": "test token",
    "notificationSettings": {
      "GT": false,
      "MP": true,
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
    "name": "Admin Guy",
    "email": "admin@example.com",
    "role": "admin",
    "notificationSettings": {
      "GT": true,
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

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getAllUsers'
    ]);
    userServiceSpy.getAllUsers.and.returnValue(of(mockUserData));
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getProvinceName'
    ]);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, FormsModule, ReactiveFormsModule],
      declarations: [ ManageUsersComponent, ModalComponent ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ProvinceService, useValue: provinceServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
