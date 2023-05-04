import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProvinceSelection } from '../province/province.service';
import { AuthService } from '../auth/auth.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private alerts: AlertsService
  ) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/users/me');
  }

  verify(id: string, token: string) {
    let request = this.http.post("/api/users/verify", {
      id: id,
      verificationToken: token
    });
    return request;
  }

  sendVerification() {
    return this.http.post("/api/users/me/verifications/send", {});
  }

  changePassword(oldPassword: string, newPassword: string) {
    this.getCurrentUser()
    .subscribe({
      next: user => {
        const id: string = user._id;
        this.http.put(`/api/users/${id}/password`, {
          oldPassword: oldPassword,
          newPassword: newPassword,
        }).subscribe({
          next: (res) => {
            this.alerts.addAlert("success", "Password changed successfully");
          },
          error: (err) => {
            this.alerts.addAlert("danger", "Error changing password. Perhaps your old password was incorrect?");
          }
        });
      },
      error: err => {
        this.alerts.addAlert("danger", err.message);
      }
    });
  }

  deleteUser(id: string) {
    let request = this.http.delete(`/api/users/${id}`);
    return request;
  }

}

export type NewUser = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  provider: string;
  notificationSettings: ProvinceSelection;
  eventLog?: any[];
}
