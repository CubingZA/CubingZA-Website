'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './contact.routes';

export class ContactComponent {
  /*@ngInject*/
  constructor($resource) {
    'ngInject';
    
    this.emailValidator = $resource("https://api.mailgun.net/v3/address/validate");
    this.emailSender = $resource("/api/contact/send", {}, {send: {method: 'POST'}});
      
    this.alerts = [];
    
    this.resetFormValues();
  }
  
  resetFormValues() {
    this.name = '';
    this.subject = '';
    this.email = '';
    this.message = '';    
    this.sending = false;
  }
  
  contactSend(form) {        

    this.sending = true;
    this.submitted = false;
    this.mailgunError = false;
    
    console.log(form);

    if (form.email.$valid) {
      form.email.$valid = false;
      let data = {
        address: this.email,
        api_key: 'pubkey-2a46820e96f5c254b40e74675620e124'
      }
      var validationResult = this.emailValidator.get(data, () => {

        this.submitted = true;
        this.sending = false;
        
        if (validationResult.is_valid) {
          form.email.$valid = true;
          form.email.$invalid = false;

          let message = {
            name: this.name,
            email: this.email,
            subject: this.subject,
            message: this.message || ''
          }

          let response = this.emailSender.send(message)
          .$promise
          .then(response => {
            if (response.success) {
              this.addAlert('success', '<strong>Success - </strong> Message sent succesfully')
              this.resetFormValues();
              form.$setPristine();
              this.submitted = false;
            }
            else {
              this.addAlert('danger', '<strong>Error - </strong> Message sending failed. Please try again later')
            }
          })
          .catch(() => {
              this.addAlert('danger', '<strong>Error - </strong> Message sending failed. Please try again later')
          });
        }
        else if (validationResult.did_you_mean) {          
          form.email.$valid = false;
          form.email.$invalid = true;
          form.email.didYouMean = validationResult.did_you_mean;
        }
        else {
          this.mailgunError = true;
          form.email.$valid = false;
          form.email.$invalid = true;
        }
      });
    }
  }
  
  useDidYouMean(form) {
    this.email = form.email.didYouMean;
    form.email.didYouMean = null;
  }
  
  addAlert(type, message) {
    this.alerts.push({
      type: type, 
      msg: message
    });
  };

  closeAlert(index) {
    this.alerts.splice(index, 1);
  };
    
}

export default angular.module('cubingzaApp.contact', [uiRouter])
  .config(routes)
  .component('contact', {
    template: require('./contact.html'),
    controller: ContactComponent,
    controllerAs: 'contactCtrl'
  })
  .name;
