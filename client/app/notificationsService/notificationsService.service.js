'use strict';
const angular = require('angular');

/*@ngInject*/
export class notificationsService {
  // AngularJS will instantiate a singleton by calling "new" on this function
  
  constructor($resource) {
    'ngInject';
    
    this.Notifications = $resource('/api/users/me/notifications');
    
    this.provinceNames = {
      GT:'Gauteng',
      MP:'Mpumalanga',
      LM:'Limpopo',
      NW:'North West',
      FS:'Free State',
      KZ:'Kwa-Zulu Natal',
      EC:'Eastern Cape',
      WC:'Western Cape',
      NC:'Northern Cape'
    };
    
    this.unsavedChanges = false;
  }
  
  initNotifications(ctrlScope) {      
    this.provinces = this.Notifications.get({}, () => {
      this.setupMapElements(ctrlScope)
      this.unsavedChanges = false;
    });
  }
  
  saveNotifications() {      
    let res = this.Notifications.save(this.provinces, (response) => {
      console.log(response);
      this.unsavedChanges = false;
    });
  }
  
  setupMapElements(ctrlScope) {
    for (let p in this.provinceNames) {
      let provElem = angular.element(document.getElementById(p));
      if (this.provinces[p]) {
        provElem.addClass('active');
      }
      else {
        provElem.removeClass('active');
      }
      provElem.off('click');
      provElem.on('click', () => {
        this.toggleProvince(p);
        ctrlScope.$apply();
      });
    }
  }
  
  toggleProvince(p) {
    let provElem = angular.element(document.getElementById(p));
    provElem.toggleClass('active');
    this.provinces[p] = !this.provinces[p];
    this.unsavedChanges = true;
  }
  
  getSelectedProvinces() {
    let selected = [];
    for (let p in this.provinceNames) {
      if (this.provinces[p]) {
        selected.push(p);
      }
    }
    return selected.sort();
  }  
}

export default angular.module('projectApp.notificationsService', [])
  .service('notificationsService', notificationsService)
  .name;
