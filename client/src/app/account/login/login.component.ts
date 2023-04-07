import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginDetails } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {

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
