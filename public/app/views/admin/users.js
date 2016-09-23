(function (angular) {
  'use strict';

  function UsersController(UserService) {
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
            });
    }

    UsersController.$inject = [
        'UserService'
    ];

    angular.module('mean-users')
        .controller('UsersController', UsersController);
}(window.angular));
