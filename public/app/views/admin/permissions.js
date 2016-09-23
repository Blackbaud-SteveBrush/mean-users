(function (angular) {
  'use strict';

  function PermissionsController(PermissionService) {
    var vm;

    vm = this;
    vm.formData = {};

    PermissionService.getAll().then(function (data) {
      vm.permissions = data.value;
    });

    vm.submit = function () {
      PermissionService.create(vm.formData).then(function (data) {
        vm.permissions.unshift(data);
        vm.formData = {};
      });
    };

    vm.delete = function (index) {
      PermissionService.deleteById(vm.permissions[index]._id).then(function () {
        vm.permissions.splice(index, 1);
      });
    };

    vm.update = function (permission) {
      delete permission.showEditor;
      PermissionService.updateById(permission._id, permission).then(function (data) {
        permission = data;
      });
    };
  }

  PermissionsController.$inject = ['PermissionService'];
  angular.module('mean-users')
    .controller('PermissionsController', PermissionsController);
}(window.angular));
