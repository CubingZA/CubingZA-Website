import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.less']
})
export class VerifyComponent {

  checking: boolean = true;
  verified: boolean = false;
  emailSent: boolean = false;

  id: string = "";
  token: string = "";

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.token) { this.verify();}
    });
    this.route.fragment.subscribe(fragment => {
      this.token = fragment ? fragment : "";
      if (this.id) { this.verify();}
    });
  }

  verify() {
    console.log("ID: ", this.id);
    console.log("Token: ", this.token);
    this.checking = true;
    this.userService.verify(this.id, this.token).subscribe({
      next: (res) => {
        console.log("Verification successful");
        this.checking = false;
        this.verified = true;
      },
      error: (err) => {
        console.log("Verification failed");
        this.checking = false;
        this.verified = false;
      }
    });

  }

  sendVerification() {
    this.emailSent = true;
    console.log("Sending verification email to user");
    this.userService.sendVerification()
    .subscribe({
      next: (res) => {
        console.log("Verification email sent");
      },
      error: (err) => {
        this.emailSent = false;
        console.log("Verification email failed");
      }
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}
