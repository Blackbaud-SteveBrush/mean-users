(function (angular) {
  'use strict';

  function LoginController($state, $window, AuthService) {
    var vm;

    vm = this;
    vm.formData = {};

    this.submit = function () {
      vm.disabled = true;
      AuthService
        .login(vm.formData.emailAddress, vm.formData.password)
        .then(function () {
          $state.go('home');
          $window.location.reload();
          vm.disabled = false;
        })
        .catch(function (err) {
          alert("ERROR!", err);
          vm.disabled = false;
        });
    };
  }

  LoginController.$inject = ['$state', '$window', 'AuthService'];
  angular.module('mean-users')
    .controller('LoginController', LoginController);
}(window.angular));
