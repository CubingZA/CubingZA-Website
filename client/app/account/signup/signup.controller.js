'use strict';

import angular from 'angular';

export default class SignupController {
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  errors = {};
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state, $resource, User) {
    this.Auth = Auth;
    this.$state = $state;
    
    this.emailValidator = $resource('https://api.mailgun.net/v3/address/validate');
    this.User = User;
  }
  
  wcalogin() {
    this.Auth.startWcaLogin();
  }

  register(form) {
    this.submitted = true;
    this.mailgunError = false;
    
    if (form.$valid) {
      let data = {
        address: this.user.email,
        api_key: 'pubkey-2a46820e96f5c254b40e74675620e124'
      };
      
      var validationResult = this.emailValidator.get(data, () => {
        if (validationResult.is_valid) {
          this.Auth.createUser({
            name: this.user.name,
            email: this.user.email,
            password: this.user.password
          })
          .then(() => {
            // Account created, send verify email
            console.log('Sending verify email');
            
            console.log(this.User.sendVerification({}).$promise
            .then(function() {
              console.log('Verification Email sent');
            })
            .catch(function() {
              console.log('Verification Email Error');
            }));
            
            this.$state.go('main');
          })
          .catch(err => {
            err = err.data;
            this.errors = {};
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, (error, field) => {
              form[field].$setValidity('mongoose', false);
              this.errors[field] = error.message;
            });
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
  
  checkPasswords(form) {
    if (this.user.password != this.user.confirmPassword) {
      form.confirmPassword.$valid = false;
      form.confirmPassword.$invalid = true;
      return true;
    }
    else {
      return false;
    }
  }
  
  useDidYouMean(form) {
    this.user.email = form.email.didYouMean;
    form.email.didYouMean = null;
  }
}
