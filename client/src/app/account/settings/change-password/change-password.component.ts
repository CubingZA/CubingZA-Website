import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { PasswordMatchValidator } from '../../password.validator';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent {

  faKey = faKey;

  passwordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, [PasswordMatchValidator()]);

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alerts: AlertsService
  ) { }

  get oldPassword(): FormControl { return this.passwordForm.get('oldPassword') as FormControl; }
  get password(): FormControl { return this.passwordForm.get('password') as FormControl; }
  get confirmPassword(): FormControl { return this.passwordForm.get('confirmPassword') as FormControl; }

  isLocalUser(): boolean {
    return this.authService.isLocalUser();
  }

  isWCAUser(): boolean {
    return this.authService.isWCAUser();
  }

  changePassword() {
    this.alerts.clear()
    this.userService.changePassword(this.oldPassword.value, this.password.value);
  }
}
