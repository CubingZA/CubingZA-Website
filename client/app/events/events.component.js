'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './events.routes';

export class EventsComponent {
  /*@ngInject*/
  constructor($resource, Modal) {
    'ngInject';

    this.CompAPI = $resource('/api/events/:id', {}, {create: {method: 'POST'}, update: {method: 'PUT'}});
    this.NotificationsAPI = $resource('/api/events/:id/notify', {}, {send: {method: 'POST'}});

//    this.today = new Date(2016, 6, 1);
    this.today = new Date();

    this.deleteModal = Modal.confirm.delete(comp => {
      this.CompAPI.deleteOne({id: comp._id});
      this.comps.splice(this.comps.indexOf(comp), 1);
    });

    this.messageModal = Modal.inform.message();

    this.sendModal = Modal.confirm.sendMessage(comp => {
      comp.notificationsSent = true; // Outside of request - makes site appear faster

      this.NotificationsAPI.send({id: comp._id}, {})
      .$promise
      .then(() => {
        this.messageModal('Notifications sent',
                          `Notifications for <b>${comp.name}</b> have been sent.`,
                          'success');
      })
      .catch(() => {
        this.messageModal('Error while sending notifications',
                          `An error occured while trying to send notifications for <b>${comp.name}</b>.`,
                          'danger');
        comp.notificationsSent = false;
        return
      });
    });

    this.editModal = Modal.edit.compedit((comp, newcomp) => {
      if (!newcomp.multiDay) {
        newcomp.endDate = newcomp.startDate;
      }

      if (comp._id) {
        // Existing comp, update details
        this.CompAPI.updateOne({id: comp._id}, newcomp);
      }
      else {
        // Existing comp, create new
        this.CompAPI.create(newcomp)
          .$promise.then(() => {
            this.refreshCompsList();
          });
      }
    });

    this.refreshCompsList();

  }

  refreshCompsList() {
    this.comps = this.CompAPI.query({}, () => {
      this.comps.sort(function (a, b) {if (a.startDate > b.startDate) {return -1;} {return 1;}});
    });
  }

  isOld(datestr) {
    let date = new Date(Date.parse(datestr));
    return date < this.today;
  }

  filterEvents(searchFilter) {
    return this.comps.filter((comp) => {
      if (!searchFilter) {
        return true;
      }

      searchFilter = searchFilter.toLowerCase();
      if (comp.name.toLowerCase().includes(searchFilter) ||
          comp.address.toLowerCase().includes(searchFilter) ||
          comp.venue.toLowerCase().includes(searchFilter) ||
          comp.city.toLowerCase().includes(searchFilter) ||
          comp.province.toLowerCase().includes(searchFilter) ||
          comp.registrationName.toLowerCase().includes(searchFilter)) {
        return true;
      }
      else {
        return false;
      }
    });
  }


  edit (compName, comp) {
    this.editModal('Edit Competition', comp);
  }

  newcomp () {
    var date = (new Date()).toISOString();
    var comp = {
      name: '',
      venue: '',
      province: 'Gauteng',
      address: '',
      city: '',
      registrationName: '',
      multiDay: false,
      startDate: date,
      endDate: date
    };
    this.editModal('New Competition', comp);
  }

  sendNotifications (compName, comp) {
    if (comp.notificationsSent) {
      this.alreadySentModal('Notifications already sent',
                            `Notifications for <b>${comp.name}</b> have already been sent.`,
                            'warning')
    }
    else {
      this.sendModal(comp.name, comp)
    }
  }

  delete(compName, comp) {
    this.deleteModal(compName, comp);
  }
}

export default angular.module('projectApp.events', [uiRouter])
  .config(routes)
  .component('events', {
    template: require('./events.html'),
    controller: EventsComponent,
    controllerAs: 'eventsCtrl'
  })
  .name;
