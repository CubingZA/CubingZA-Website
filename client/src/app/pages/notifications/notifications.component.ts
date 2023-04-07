import { Component } from '@angular/core';
import { ProvinceService, ProvinceSelection } from '../../services/province/province.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent {

  constructor(
    private provinceService: ProvinceService,
    private authService: AuthService
  ) {
    this.provinceService.resetProvinceSelection();
  }

  hasVerifiedEmail() {
    return this.authService.hasVerifiedEmail();
  }

  getSelection() {
    return this.provinceService.getProvinceSelection();
  }

  saveSelection() {
    this.provinceService.saveProvinceSelection();
  }

  resetSelection() {
    this.provinceService.resetProvinceSelection();
  }

  getSelectionString() {
    return JSON.stringify(this.getSelection());
  }

  isUnsaved() {
    return this.provinceService.unsavedChanges;
  }

  hasSelection() {
    return this.provinceService.getSelectedProvinces().length > 0;
  }
}
