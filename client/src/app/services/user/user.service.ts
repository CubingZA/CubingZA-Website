import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProvinceSelection } from '../province/province.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
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
    })
    return request;
  }

  sendVerification() {
    return this.http.post("/api/users/me/verifications/send", {});
  }

  changePassword(oldPassword: string, newPassword: string, alerts: Alerts) {
    this.getCurrentUser()
    .subscribe({
      next: user => {
        console.log("Got user");        
        const id: string = user._id;      
        this.http.put(`/api/users/${id}/password`, {
          oldPassword: oldPassword,
          newPassword: newPassword,
        }).subscribe({
          next: (res) => {
            alerts.messages.push("Password changed successfully");
          },
          error: (err) => {
            alerts.errors.push("Error changing password. Perhaps your old password was incorrect?");
          }
        });
      },
      error: err => {
        console.log("Error getting user");
        alerts.errors.push(err.error.message);
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
  eventLog: any[];
}

export type Alerts = {
  errors: string[];
  messages: string[];
}