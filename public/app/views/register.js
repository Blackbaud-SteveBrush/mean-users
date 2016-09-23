(function (angular) {
  'use strict';

  function RegisterController($state, AuthService) {
    var vm;

    vm = this;
    vm.formData = {};

    vm.submit = function () {
      vm.disabled = true;
      AuthService
        .register(vm.formData)
        .then(function () {
          $state.go('login');
          vm.disabled = false;
        })
        .catch(function () {
          alert("Error!");
          vm.formData = {};
          vm.disabled = false;
        });
    };
  }

  RegisterController.$inject = [
    '$state',
    'AuthService'
  ];

  angular.module('mean-users')
    .controller('RegisterController', RegisterController);
}(window.angular));
