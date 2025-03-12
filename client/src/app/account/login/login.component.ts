import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AlertsService } from 'src/app/components/alerts/alerts.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    standalone: false
})
export class LoginComponent {

  faUserPlus = faUserPlus;
  faRightToBracket = faRightToBracket;

  form = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  })

  constructor(
    private authService: AuthService,
    private alerts: AlertsService
  ) {  }

  get email(): FormControl { return this.form.get('email') as FormControl; }
  get password(): FormControl { return this.form.get('password') as FormControl; }

  login() {
    this.alerts.clear();
    if (this.email?.valid && this.password?.valid) {
      this.authService.login({
        email: this.email.value ? this.email.value : "",
        password: this.password.value ? this.password.value : ""
      })
      .subscribe({
        error: (error) => {
          switch (error.status) {
            case 401:
              this.alerts.addAlert("danger", "Invalid email or password");
              break;
            case 504:
              this.alerts.addAlert("danger", "Error: Could not connect to server");
              break;
            default:
              this.alerts.addAlert("danger", "Error: Could not log in");
          }
        }
      });
    }
  }

  wcaLogin() {
    this.alerts.clear();
    this.authService.startWcaLogin();
  }
}
