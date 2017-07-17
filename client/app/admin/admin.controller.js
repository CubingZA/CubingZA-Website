'use strict';

export default class AdminController {
  /*@ngInject*/
  constructor(User, Modal, notificationsService) {
    
    this.provinceNames = notificationsService.provinceNames;
    
    // Use the User $resource to fetch all users
    this.users = User.query();

    this.delete = Modal.confirm.delete(user => {
      console.log('Delete');
      user.$remove();
      this.users.splice(this.users.indexOf(user), 1);
    });      
  }
  
  getProvinceString(user) {
    let selected = [];
    for (let p in user.notificationSettings) {
      if (user.notificationSettings[p]) {
        selected.push(this.provinceNames[p]);
      }
    }
    return selected.sort().join(', ');
  } 
  
  hasProvinces(user) {
    let selected = [];
    for (let p in user.notificationSettings) {
      if (user.notificationSettings[p]) {
        return true;
      }
    }
    return false;
  } 
}
