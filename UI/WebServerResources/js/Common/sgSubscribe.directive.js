/* -*- Mode: javascript; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

(function() {
  /* jshint validthis: true */
  'use strict';

  /*
   * sgSubscribe - Common subscription widget
   * @restrict class or attribute
   * @param {string} sgSubscribe - the folder type
   * @param {function} sgSubscribeOnSelect - the function to call when subscribing to a folder.
   *        One variable is available: folderData.
   * @ngInject
   * @example:

     <md-button sg-subscribe="contact" sg-subscribe-on-select="subscribeToFolder">Subscribe ..</md-button>
  */
  sgSubscribe.$inject = ['User'];
  function sgSubscribe(User) {
    return {
      restrict: 'A',
      scope: {
        folderType: '@sgSubscribe',
        onFolderSelect: '&sgSubscribeOnSelect'
      },
      replace: false,
      bindToController: true,
      controller: sgSubscribeDialogController,
      controllerAs: 'vm',
      link: link
    };
  }

  function link(scope, element, attrs, controller) {
    var inputEl = element.find('input');
    element.on('click', controller.showDialog);
  }

  /**
   * @ngInject
   */
  sgSubscribeDialogController.$inject = ['$mdDialog'];
  function sgSubscribeDialogController($mdDialog) {
    var vm = this;
    vm.showDialog = function() {
      $mdDialog.show({
        templateUrl: '../Contacts/UIxContactsUserFolders',
        clickOutsideToClose: true,
        locals: {
          folderType: vm.folderType,
          onFolderSelect: vm.onFolderSelect
        },
        controller: sgSubscribeController,
        controllerAs: 'vm'
      });
    };
  }

  /**
   * @ngInject
   */
  sgSubscribeController.$inject = ['folderType', 'onFolderSelect', 'User'];
  function sgSubscribeController(folderType, onFolderSelect, User) {
    var vm = this;
    vm.selectedUser = null;

    vm.searchTextOptions = {
      updateOn: 'default blur',
      debounce: {
        default: 300,
        blur: 0
      }
    };

    vm.onChange = function() {
      User.$filter(vm.searchText).then(function(matches) {
        vm.users = matches;
      });
    };

    vm.selectUser = function(i) {
      // Fetch folders of specific type for selected user
      vm.users[i].$folders(folderType).then(function() {
        vm.selectedUser = vm.users[i];
      });
    };

    // Callback upon subscription to a folder
    vm.selectFolder = function(folder) {
      onFolderSelect({folderData: folder});
    };
  }

  angular
    .module('SOGo.Common')
    .directive('sgSubscribe', sgSubscribe);
})();