(function (angular) {
  'use strict';

  function RolesController(PermissionService, RoleService) {
    var vm;

    vm = this;
    vm.formData = {};
    console.log(PermissionService.getAll);
    PermissionService.getAll().then(function (data) {
        console.log(data);
      vm.permissions = data.value;
      RoleService.getAll().then(function (data) {
        vm.roles = data.value;
      });
    });

    vm.submit = function () {
      RoleService.create(vm.formData).then(function (data) {
        vm.roles.unshift(data);
        vm.formData = {};
      });
    };

    vm.delete = function (index) {
      RoleService.deleteById(vm.roles[index]._id).then(function () {
        vm.roles.splice(index, 1);
      });
    };

    vm.updateRole = function (role) {
      delete role.showEditor;
      RoleService.updateById(role._id, role).then(function (data) {
        role = data;
      });
    };

    vm.updateDefault = function (index) {
        vm.roles.forEach(function (role, i) {
            role.isDefault = (i === index);
            vm.updateRole(role);
        });
    };

    vm.toggleSelection = function (permissionId) {
      vm.roles.forEach(function (role) {
        var index = role.permissions.indexOf(permissionId);
        if (index > -1) {
          role.permissions.splice(index, 1);
        } else {
          role.permissions.push(permissionId);
        }
      });
    };
  }

  RolesController.$inject = [
    'PermissionService',
    'RoleService'
  ];
  angular.module('capabilities-catalog')
    .controller('RolesController', RolesController);
}(window.angular));
