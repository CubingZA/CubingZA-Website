'use strict';

export default class AdminController {
  /*@ngInject*/
  constructor(User, Modal) {
    // Use the User $resource to fetch all users
    this.users = User.query();

    this.delete = Modal.confirm.delete(user => {
      console.log('delete');
      user.$remove();
      this.users.splice(this.users.indexOf(user), 1);
    });
  }
}
