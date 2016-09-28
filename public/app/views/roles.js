(function (angular) {
    'use strict';

    function RolesController(MessageService, PermissionService, RoleService) {
        var vm;

        vm = this;
        vm.formData = {};

        PermissionService.getAll().then(function (data) {
            vm.permissions = data.value;
            RoleService.getAll().then(function (data) {
                vm.roles = data.value;
            });
        });

        vm.createRole = function () {
            RoleService.create(vm.formData).then(function (data) {
                vm.roles.unshift(data);
                vm.formData = {};
            }).catch(MessageService.handleError);
        };

        vm.delete = function (index) {
            RoleService.deleteById(vm.roles[index]._id).then(function () {
                vm.roles.splice(index, 1);
            }).catch(MessageService.handleError);
        };

        vm.updateDefaultRole = function (index) {
            vm.roles.forEach(function (role, i) {
                role.isDefault = (i === index);
                vm.updateRole(role);
            });
        };

        vm.updateRole = function (role) {
            delete role.showEditor;
            RoleService.updateById(role._id, role).then(function (data) {
                role = data;
            }).catch(MessageService.handleError);
        };

        vm.toggleSelection = function (role, permissionId) {
            var index = role._permissions.indexOf(permissionId);
            if (index > -1) {
                role._permissions.splice(index, 1);
            } else {
                role._permissions.push(permissionId);
            }
        };
    }

    RolesController.$inject = [
        'MessageService',
        'PermissionService',
        'RoleService'
    ];
    angular.module('capabilities-catalog')
        .controller('RolesController', RolesController);

}(window.angular));
