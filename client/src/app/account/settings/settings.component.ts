import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService, User, Alerts } from 'src/app/services/user/user.service';
import { PasswordMatchValidator } from '../password.validator';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent {

  alerts: Alerts = {
    errors: [],
    messages: [],
  }

  passwordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, [PasswordMatchValidator()]);

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  get oldPassword(): FormControl { return this.passwordForm.get('oldPassword') as FormControl; }
  get password(): FormControl { return this.passwordForm.get('password') as FormControl; }
  get confirmPassword(): FormControl { return this.passwordForm.get('confirmPassword') as FormControl; }

  getWCAProfileURL(): string {
    const wcaURL = "https://www.worldcubeassociation.org";
    return `${wcaURL}/profile/edit`;
  }

  isLocalUser(): boolean {
    return this.authService.isLocalUser();
  }

  changePassword() {
    this.alerts.errors = [];
    this.alerts.messages = [];
    this.userService.changePassword(this.oldPassword.value, this.password.value, this.alerts);
  } 

}
