import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService, LoginDetails } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {

  faUserPlus = faUserPlus;
  faRightToBracket = faRightToBracket;

  form = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  })
  errors: string[] = [];

  constructor(private authService: AuthService) {  }

  get email(): FormControl { return this.form.get('email') as FormControl; }
  get password(): FormControl { return this.form.get('password') as FormControl; }

  login() {
    this.errors = [];
    if (this.email?.valid && this.password?.valid) {
      this.authService.login({
        email: this.email.value ? this.email.value : "",
        password: this.password.value ? this.password.value : ""
      })
      .subscribe({
        error: (error) => {
          switch (error.status) {
            case 401:
              this.errors.push("Invalid email or password");
              break;
            case 504:
              this.errors.push("Error: Could not connect to server");
              break;
            default:
              this.errors.push("Error: Could not log in");
          }
        }
      });
    }
  }

  wcaLogin() {
    this.errors = [];
    this.authService.startWcaLogin();
  }
}
