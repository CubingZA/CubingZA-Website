import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-wcalogin',
  templateUrl: './wcalogin.component.html',
  styleUrls: ['./wcalogin.component.less']
})
export class WcaLoginComponent {
  constructor(private cookieService: CookieService, private authService: AuthService) {
    const token: string = this.cookieService.get('wcaToken');
    if (token) {
      this.cookieService.delete('wcaToken');
    }
    this.authService.finishLoginProcess(token);
  }
}
