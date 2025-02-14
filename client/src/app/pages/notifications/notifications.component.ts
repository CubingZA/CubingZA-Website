import { Component } from '@angular/core';
import { faXmark, faCloudArrowUp, faArrowsRotate, faBellSlash } from '@fortawesome/free-solid-svg-icons';

import { ProvinceService } from '../../services/province/province.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.less'],
    standalone: false
})
export class NotificationsComponent {

  faXmark = faXmark;
  faCloudArrowUp = faCloudArrowUp;
  faArrowsRotate = faArrowsRotate;
  faBellSlash = faBellSlash;

  constructor(
    private provinceService: ProvinceService,
    private authService: AuthService,
    private alerts: AlertsService
  ) { }

  ngOnInit(): void {
    this.provinceService.resetProvinceSelection();
  }

  hasVerifiedEmail() {
    return this.authService.hasVerifiedEmail();
  }

  clearSelection() {
    this.provinceService.unselectAll();
  }

  saveSelection() {
    this.alerts.clear();
    this.provinceService.saveProvinceSelection().subscribe({
      error: (error) => {
        this.alerts.addAlert('danger', 'Error saving province selection');
      }
    });
  }

  resetSelection() {
    this.provinceService.resetProvinceSelection();
  }

  isUnsaved() {
    return this.provinceService.hasUnsavedChanges();
  }

  hasSelection() {
    return this.provinceService.getSelectedProvinces().length > 0;
  }
}
