import { Component } from '@angular/core';
import { faTrash, faBan } from '@fortawesome/free-solid-svg-icons';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

import { ModalService } from 'src/app/components/modal/modal.service';
import { ProvinceSelection, ProvinceService } from 'src/app/services/province/province.service';
import { User, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.less']
})
export class ManageUsersComponent {

  faTrash = faTrash;
  faBan = faBan;

  users: User[] = [];
  searchFilter: string = "";

  userToDelete: User | null = null;

  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private provinceService: ProvinceService,
    private alerts: AlertsService
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.alerts.clear();
    this.userService.getAllUsers()
    .subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.log(err);
        this.alerts.addAlert("danger", "Failed to fetch users");
      }
    });
  }

  getProvinceString(user: User): string {
    const keys = Object.keys(user.notificationSettings).filter(
      (key) => user.notificationSettings[key as keyof ProvinceSelection]
    );
    const names = keys.map((key) => this.provinceService.getProvinceName(key as keyof ProvinceSelection));
    names.sort();
    return names.join(", ");
  }

  getFilteredUsers() {
    const searchFilter = this.searchFilter.toLowerCase();
    let users = this.users.filter((user) => {
      if (this.getProvinceString(user).toLowerCase().includes(searchFilter) ||
          user.role.toLowerCase().includes(searchFilter) ||
          user.provider.join().toLowerCase().includes(searchFilter) ||
          user.name.toLowerCase().includes(searchFilter) ||
          user.email.toLowerCase().includes(searchFilter)) {
        return true;
      }
      else {
        return false;
      }
    });
    users.sort((a,b) => {
      if (!a.name || !b.name) { return 0; }  // Need to handle the case of a missing name
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    });
    return users;
  }

  hasProvinces(user: User): boolean {
    return Object.keys(user.notificationSettings).some(
      (key) => user.notificationSettings[key as keyof ProvinceSelection]
    );
  }

  openConfirmDeleteModal(user: User) {
    this.userToDelete = user;
    this.modalService.open('confirm-delete-modal');
  }

  closeConfirmDeleteModal() {
    this.userToDelete = null;
    this.modalService.close('confirm-delete-modal');
  }

  confirmDeleteUser() {
    this.alerts.clear();
    const user = this.userToDelete;
    if (user) {
      this.userService.deleteUser(user._id)
      .subscribe({
        next: (res) => {
          this.fetchUsers();
        },
        error: (err) => {
          this.alerts.addAlert("danger", "Error deleting user");
        }
      });
    }
    this.closeConfirmDeleteModal();
  }

}
