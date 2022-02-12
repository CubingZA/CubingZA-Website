'use strict';

export default class WcaLoginController {
  /*@ngInject*/
  constructor($cookies, $state, Auth) {
    'ngInject';
    
    var token = $cookies.get('user-token');
    
    // Delete the cookie as it's not needed any more
    $cookies.remove('user-token');
    
    Auth.finishWcaLogin(token)
      .then(() => {
        // Logged in, redirect to home
        $state.go('main');
      })
      .catch(err => {
        // Error in, redirect to login
        console.log(err);
        $state.go('login');
      });
  }
}
