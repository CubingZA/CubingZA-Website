import { Component } from '@angular/core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { AlertsService } from 'src/app/components/alerts/alerts.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'app-link-wca-account',
    templateUrl: './link-wca-account.component.html',
    styleUrls: ['./link-wca-account.component.less'],
    standalone: false
})
export class LinkWcaAccountComponent {

  faInfoCircle = faInfoCircle;

  constructor(
    private authService: AuthService,
    private alerts: AlertsService
  ) { }

  isWCAUser() {
    return this.authService.isWCAUser();
  }

  getWCAID() {
    const user = this.authService.getCurrentUser();
    return user?.wcaID;
  }

  getCurrentUserName() {
    const user = this.authService.getCurrentUser();
    return user?.name;
  }

  getWCAProfileURL() {
    return `https://www.worldcubeassociation.org/persons/${this.getWCAID()}`
  }

  getWCASettingsURL(): string {
    const wcaURL = "https://www.worldcubeassociation.org";
    return `${wcaURL}/profile/edit`;
  }

  wcaLogin() {
    this.alerts.clear();
    this.authService.connectWcaAccount();
  }


}
