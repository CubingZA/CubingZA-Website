import { Component } from '@angular/core';
import { faTrash, faBan } from '@fortawesome/free-solid-svg-icons';

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

  confirmDeletingUser: User | null = null;

  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private provinceService: ProvinceService

  ) {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getAllUsers()
    .subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getProvinceString(user: User): string {
    const keys = Object.keys(user.notificationSettings).filter(
      (key) => user.notificationSettings[key as keyof ProvinceSelection]
    );
    const names = keys.map((key) => this.provinceService.getProvinceName(key as keyof ProvinceSelection));
    return names.join(", ");
  }

  getFilteredUsers() {
    const searchFilter = this.searchFilter.toLowerCase();
    let users = this.users.filter((user) => {
      if (this.getProvinceString(user).toLowerCase().includes(searchFilter) ||
          user.role.toLowerCase().includes(searchFilter) ||
          user.provider.toLowerCase().includes(searchFilter) ||
          user.name.toLowerCase().includes(searchFilter) ||
          user.email.toLowerCase().includes(searchFilter)) {
        return true;
      }
      else {
        return false;
      }
    });
    users.sort((a,b) => {
      // Need to handle the case of a missing name
      if (!a.name || !b.name) { return 0; }
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    });
    return users;
  }

  hasProvinces(user: User): boolean {
    return Object.keys(user.notificationSettings).some(
      (key) => user.notificationSettings[key as keyof ProvinceSelection]
    );
  }


  closeConfirmDeleteModal() {
    this.confirmDeletingUser = null;
    this.modalService.close('confirm-delete-modal');
  }

  openConfirmDeleteModal(user: User) {
    this.confirmDeletingUser = user;
    this.modalService.open('confirm-delete-modal');
  }

  deleteUser(user: User | null) {
    if (user) {
      this.userService.deleteUser(user._id)
      .subscribe({
        next: (res) => {
          this.fetchUsers();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    this.closeConfirmDeleteModal();
  }

}
