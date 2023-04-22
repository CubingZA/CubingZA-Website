import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  alerts: Alert[] = [];

  constructor() { }

  addAlert(type: AlertType | string, message: string) {
    this.alerts.push({
      _id: crypto.randomUUID(),
      type: type as AlertType,
      message
    });
  }

  getAlerts() {
    return this.alerts;
  }

  removeAlert(alert: Alert) {
    const id: string = alert._id;
    this.alerts = this.alerts.filter(alert => alert._id !== id);
  }

  clear() {
    this.alerts = [];
  }
}

export type Alert = {
  _id: string;
  type: AlertType;
  message: string;
};

export enum AlertType {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  INFO = 'info'
}
