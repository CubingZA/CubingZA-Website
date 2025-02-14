import { Component } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertsService } from '../alerts/alerts.service';

@Component({
    selector: 'app-unverified-warning',
    templateUrl: './unverified-warning.component.html',
    styleUrls: ['./unverified-warning.component.less'],
    standalone: false
})
export class UnverifiedWarningComponent {

  faEnvelope = faEnvelope;

  emailSent: boolean = false;
  emailSending: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alerts: AlertsService
  ) { }

  getEmail(): string | undefined {
    const user = this.authService.getCurrentUser()
    return user?.email;
  }

  isUnverified(): boolean {
    return !this.authService.hasVerifiedEmail();
  }

  sendVerification() {
    this.alerts.clear();
    this.emailSending = true;
    console.log("Sending verification email to user");
    this.userService.sendVerification()
    .subscribe({
      next: (res) => {
        this.emailSending = false;
        this.emailSent = true;
      },
      error: (err) => {
        this.emailSending = false;
        this.emailSent = false;
        this.alerts.addAlert("danger", err.error.message);
      }
    });
  }
}
