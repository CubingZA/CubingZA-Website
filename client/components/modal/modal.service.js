'use strict';

import angular from 'angular';

export function Modal($rootScope, $uibModal, $sce, notificationsService) {
  'ngInject';
  /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the modal
   * @return {Object}            - the instance $uibModal.open() returns
   */

  function openModal(scope = {}, modalClass = 'modal-default') {
    var modalScope = $rootScope.$new();

    angular.extend(modalScope, scope);

    return $uibModal.open({
      template: require('./modal.html'),
      windowClass: modalClass,
      scope: modalScope
    });
  }

  // Public API here
  return {

    inform: {
      message() {
        
        return function() {
          var args = Array.prototype.slice.call(arguments);
          var title = args.shift();
          var message = args.shift();
          var modalClass = args.shift() || 'primary';
          var messageModal;

          messageModal = openModal({
            modal: {
              dismissable: false,
              title: title,
              html: `<p>${message}</p>`,
              buttons: [{
                classes: `btn-${modalClass}`,
                text: 'OK',
                click(e) {
                  messageModal.close(e);
                }
              }]
            }
          }, `modal-${modalClass}`);

          messageModal.result;
        };
      }
    },
    
    /* Confirmation modals */
    confirm: {

      /**
       * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
       * @param  {Function} del - callback, ran when delete is confirmed
       * @return {Function}     - the function to open the modal (ex. myModalFn)
       */
      delete(del = angular.noop) {
        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to del callback
         */
        return function() {
          var args = Array.prototype.slice.call(arguments);
          var name = args.shift();
          var deleteModal;

          deleteModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Delete',
              html: `<p>Are you sure you want to delete <strong>${name}</strong> permanently?</p><p>This action cannot be undone.</p>`,
              buttons: [{
                classes: 'btn-danger',
                text: 'Delete',
                click(e) {
                  deleteModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click(e) {
                  deleteModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          deleteModal.result
            .then(function(event) {
              del.apply(event, args);
            }, function() {
              // Modal was dismissed, so don't do anything.
            });
        };
      },
      
      sendMessage(send = angular.noop) {
        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to del callback
         */
        return function() {
          var args = Array.prototype.slice.call(arguments);
          var name = args.shift();
          var sendModal;

          sendModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Send',
              html: `<p>Are you sure you want to send notifications for <strong>${name}</strong> ?</p>`,
              buttons: [{
                classes: 'btn-warning',
                text: 'Send',
                click(e) {
                  sendModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click(e) {
                  sendModal.dismiss(e);
                }
              }]
            }
          }, 'modal-warning');

          sendModal.result
            .then(function(event) {
              send.apply(event, args);
            }, function() {
              // Modal was dismissed, so don't do anything.
            });
        };
      }
    },
    
    edit: {
      compedit(callback = angular.noop) {
        
        return function() {          
          var args = Array.prototype.slice.call(arguments);
          var title = args.shift();
          var comp = args.shift();
          
          var newcomp = {
            name: comp.name,
            venue: comp.venue,            
            address: comp.address,
            city: comp.city,
            province: comp.province,
            registrationName: comp.registrationName,
            
            startDate: new Date(Date.parse(comp.startDate)),
            endDate: new Date(Date.parse(comp.endDate)),            
          };
          newcomp.multiDay = newcomp.endDate > newcomp.startDate;
          
          var editModal;
          
          editModal = openModal({
            modal: {
              dismissable: true,
              title: title,
              trustedhtml: $sce.trustAsHtml(require('./modaleditcomp.html')),
              buttons: [{
                classes: 'btn-success',
                text: 'OK',
                click(e) {
                  editModal.close(e, newcomp);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click(e) {
                  editModal.dismiss(e);
                }
              }]
            },
            comp: newcomp,
            provinces: Object.keys(notificationsService.provinceNames).map(key => notificationsService.provinceNames[key]).sort()
          }, 'modal-success');
          
          editModal.result
            .then(function(event) {
              // Modal was accepted, do something.
              callback.apply(event, [comp, newcomp, args]);
            }, function() {
              // Modal was dismissed, so don't do anything.
            }); 
        };
      }
    }
  };
}

export default angular.module('cubingzaApp.Modal', [])
  .factory('Modal', Modal)
  .name;


