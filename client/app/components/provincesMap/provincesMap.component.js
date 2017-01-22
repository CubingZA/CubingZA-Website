'use strict';
const angular = require('angular');

export class provincesMapComponent {
  /*@ngInject*/
  constructor($scope, $resource, notificationsService) {
    'ngInject';
        
    this.notifyService = notificationsService;
    
    this.provinceNames = this.notifyService.provinceNames;
    
    this.scope = $scope;
    if (this.notifyService.provinces) {
      this.notifyService.setupMapElements(this.scope);
    } 
    else {
      this.notifyService.initNotifications(this.scope);
    }
  }

  getSelectedProvinces() {    
    return this.notifyService.getSelectedProvinces();
  }
  
  toggleProvince(province) {
    this.notifyService.toggleProvince(province);
  }
  
  resetSelectedProvinces() {
    this.notifyService.initNotifications(this.scope);
  }
  
  saveSelection() {
    this.notifyService.saveNotifications();
  }
  
  unchanged() {
    return this.notifyService.unsavedChanges;
  }
  
}

export default angular.module('cubingzaApp.provincesMap', ['ui.bootstrap', 'projectApp.notificationsService'])
  .component('provincesMap', {
    template: require('./provincesMap.html'),
    bindings: { message: '<' },
    controller: provincesMapComponent
  })
  .name;
