(function (angular) {
    'use strict';

    function PermissionsController(MessageService, PermissionService) {
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
                MessageService.handleSuccess('Permission successfully created.');
            }).catch(MessageService.handleError);
        };

        vm.delete = function (index) {
            PermissionService.deleteById(vm.permissions[index]._id).then(function () {
                vm.permissions.splice(index, 1);
                MessageService.handleSuccess('Permission successfully deleted.');
            }).catch(MessageService.handleError);
        };

        vm.update = function (permission) {
            delete permission.showEditor;
            PermissionService.updateById(permission._id, permission).then(function (data) {
                permission = data;
                MessageService.handleSuccess('Permission successfully updated.');
            }).catch(MessageService.handleError);
        };
    }

    PermissionsController.$inject = [
        'MessageService',
        'PermissionService'
    ];

    angular.module('capabilities-catalog')
        .controller('PermissionsController', PermissionsController);
}(window.angular));
