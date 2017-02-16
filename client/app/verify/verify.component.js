'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './verify.routes';

export class VerifyComponent {
  /*@ngInject*/
  constructor($stateParams, $resource, Auth, User) {
    'ngInject';
    
    this.sendVerification = User.sendVerification;
    
    this.checking = true;
    this.verified = false;
    
    var id = $stateParams.id;
    var verificationToken = $stateParams.code;
        
    var response = $resource('/api/users/verify').save({}, {id: id, verificationToken: verificationToken}).$promise
      .then(() => {
        this.checking = false;
        this.verified = true;
        Auth.refreshCurrentUser();
      })
      .catch(() => {
        // Error verifying
        console.log('Success')
        this.checking = false;
      });
  }
  
}

export default angular.module('projectApp.verify', [uiRouter])
  .config(routes)
  .component('verify', {
    template: require('./verify.html'),
    controller: VerifyComponent,
    controllerAs: 'verifyCtrl'
  })
  .name;
