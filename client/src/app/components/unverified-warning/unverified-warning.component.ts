import { Component } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-unverified-warning',
  templateUrl: './unverified-warning.component.html',
  styleUrls: ['./unverified-warning.component.less']
})
export class UnverifiedWarningComponent {

  faEnvelope = faEnvelope;

  emailSent: boolean = false;
  emailSending: boolean = false;
  errors: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  getEmail(): string | undefined {
    const user = this.authService.getCurrentUser()
    if (user) {
      return user.email;
    }
    return undefined;
  }
  
  isUnverified(): boolean {
    return !this.authService.hasVerifiedEmail();
  }

  sendVerification() {
    this.errors = [];
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
        this.errors.push(err.error.message);
      }
    });
  }
}
