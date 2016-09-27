(function (angular) {
  'use strict';

  function UsersController(MessageService, UserService) {
        var vm;

        vm = this;

        vm.sortType = 'emailAddress';
        vm.reverseSort = false;

        vm.sortBy = function (propertyName) {
            if (vm.sortType === propertyName) {
                vm.toggleReverse();
            }
            vm.sortType = propertyName;
        };

        vm.toggleReverse = function () {
            if (vm.reverseSort) {
                vm.reverseSort = false;
            } else {
                vm.reverseSort = true;
            }
        };

        UserService
            .getAll()
            .then(function (data) {
                vm.users = data.value;
                vm.isReady = true;
            }).catch(MessageService.handleError);
    }

    UsersController.$inject = [
        'MessageService',
        'UserService'
    ];

    angular.module('capabilities-catalog')
        .controller('UsersController', UsersController);
}(window.angular));
