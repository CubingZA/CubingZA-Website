import { Component } from '@angular/core';
import { Alert, AlertsService } from './alerts.service';

@Component({
    selector: 'app-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.less'],
    standalone: false
})
export class AlertsComponent {

  constructor(private alerts: AlertsService) { }

  hasAlerts() {
    return this.alerts.alerts.length > 0;
  }

  getAlerts() {
    return this.alerts.getAlerts();
  }

  removeAlert(alert: Alert) {
    this.alerts.removeAlert(alert);
  }
}
