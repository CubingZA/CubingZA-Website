import { Component } from '@angular/core';
import { faInfoCircle, faRightToBracket, faRightFromBracket, faUserPlus, faEnvelope, faUser, faGear, faMapLocationDot, faUsers, faCalendarDays, faScrewdriverWrench, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent {

  faInfoCircle = faInfoCircle;
  faRightToBracket = faRightToBracket;
  faEnvelope = faEnvelope;
  faUser = faUser;
  faGear = faGear;
  faMapLocationDot = faMapLocationDot;
  faRightFromBracket = faRightFromBracket;
  faUsers = faUsers;
  faCalendarDays = faCalendarDays;
  faScrewdriverWrench = faScrewdriverWrench;
  faCaretDown = faCaretDown;
  faUserPlus = faUserPlus;

  collapsed = true;
  constructor(private authService: AuthService) {
  }

  toggleCollapsed(): void {

    this.collapsed = !this.collapsed;
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
  }

  getCurrentUserName() {
    const user = this.authService.getCurrentUser();
    return user ? user.name : '';
  }
}
