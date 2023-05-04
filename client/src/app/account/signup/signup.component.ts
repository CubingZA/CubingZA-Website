import { Component, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of, catchError, map } from 'rxjs';
import { faUserPlus, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

import { AuthService, Token } from 'src/app/services/auth/auth.service';
import { EmailCheckService } from 'src/app/services/email/email-check.service';
import { PasswordMatchValidator } from '../password.validator';
import { NewUser } from 'src/app/services/user/user.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent {

  faUserPlus = faUserPlus;
  faRightToBracket = faRightToBracket;

  showManualSignup: boolean = false;

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.emailCheckValidator.validate.bind(this.emailCheckValidator)],
      updateOn: 'blur'
    }),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, [PasswordMatchValidator()]);

  mailgunError: boolean = false;
  submitted: boolean = false;

  constructor(
    private emailCheckService: EmailCheckService,
    private emailCheckValidator: EmailCheckValidator,
    private authService: AuthService,
    private alerts: AlertsService
  ) { }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get email(): FormControl { return this.form.get('email') as FormControl; }
  get password(): FormControl { return this.form.get('password') as FormControl; }
  get confirmPassword(): FormControl { return this.form.get('confirmPassword') as FormControl; }

  setShowManualSignup() {
    this.showManualSignup = true;
  }

  hasDidYouMean() {
    return this.emailCheckService.hasDidYouMean();
  }

  useDidYouMean(event: Event) {
    event.preventDefault();
    this.email.setValue(this.emailCheckService.useDidYouMean());
  }

  getDidYouMean() {
    return this.emailCheckService.getDidYouMean();
  }

  register() {
    this.alerts.clear();
    let user: NewUser = {
      name: this.name.value,
      email: this.email.value,
      password: this.password.value
    };
    this.authService.register(user, (error) => {
      switch (error.status) {
        case 504:
          this.alerts.addAlert("danger", "Could not connect to the server. Please try again later.");
          break;
        case 422:
          this.alerts.addAlert("danger", error.error.message);
          break;
        default:
          this.alerts.addAlert("danger", "An unknown error occurred. Please try again later.");
          break;
      }
    });
  }

  wcaLogin() {
    this.alerts.clear();
    this.authService.startWcaLogin();
  }
}

@Injectable({ providedIn: 'root' })
class EmailCheckValidator implements AsyncValidator {

  private inProgress = false;

  constructor(private emailCheckService: EmailCheckService) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {

    if (this.inProgress) {
      return of(null);
    }

    this.inProgress = true;

    let validate = this.emailCheckService.checkEmail(control.value)
    .pipe(
      map(response => {
        this.inProgress = false;
        if (response.did_you_mean) {
          this.emailCheckService.setDidYouMean(response.did_you_mean);
        }
        else {
          this.emailCheckService.setDidYouMean();
        }
        return response.valid ? null : { check_failed: true };
      }),
      catchError(error => {
        if (error.status === 429) {
          // We hit the rate limit
          // assume another request is in progress and allow that to complete
          this.inProgress = false;
        }
        return of(null);
      })
    );

    return validate;
  }
}
