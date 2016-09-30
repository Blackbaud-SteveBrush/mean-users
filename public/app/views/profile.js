(function (angular) {
  'use strict';

  function ProfileController(AuthService) {
      var vm;
      vm = this;
      vm.user = AuthService.getUser();
  }

  ProfileController.$inject = [
      'AuthService'
  ];

  angular.module('capabilities-catalog')
    .controller('ProfileController', ProfileController);

}(window.angular));
