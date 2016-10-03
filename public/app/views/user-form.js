(function (angular) {
    'use strict';

    function UserFormController($q, $scope, $state, AuthService, MessageService, RoleService, UserService) {
        var vm;

        vm = this;
        vm.isAuthorized = AuthService.isAuthorized;
        vm.formData = {};

        vm.deleteUser = function () {
            UserService
                .deleteById($state.params.id)
                .then(function () {
                    $state.go('admin.users', {}, {
                        reload: true
                    });
                    MessageService.handleSuccess('User deleted!');
                })
                .catch(MessageService.handleError);
        };

        vm.sendResetPasswordRequest = function () {
            UserService
                .sendResetPasswordRequest(vm.formData.emailAddress)
                .then(function () {
                    MessageService.success('Password successfully reset.');
                })
                .catch(MessageService.handleError);
        };

        vm.isSelected = function (role) {
            if (vm.formData._role === role._id) {
                return true;
            }
            return (role.isDefault === true);
        };

        vm.submit = function () {
            if (vm.formData._id) {
                UserService
                    .updateById($state.params.id, vm.formData)
                    .then(function () {
                        $state.go('admin.users');
                        MessageService.success('User successfully updated.');
                    })
                    .catch(MessageService.handleError);
            } else {
                UserService
                    .create(vm.formData)
                    .then(function () {
                        $state.go('admin.users');
                        MessageService.success('User successfully created.');
                    })
                    .catch(MessageService.handleError);
            }
        };

        RoleService
            .getAll()
            .then(function (data) {
                vm.roles = data.value;
                return UserService.getById($state.params.id);
            })
            .then(function (data) {
                vm.formData = data;

                // Get the default role
                if (!vm.formData._id) {
                    vm.roles.forEach(function (role) {
                        if (role.isDefault) {
                            vm.formData._role = role._id;
                        }
                    });
                }
            })
            .catch(MessageService.handleError);
    }

    UserFormController.$inject = [
        '$q',
        '$scope',
        '$state',
        'AuthService',
        'MessageService',
        'RoleService',
        'UserService'
    ];

    angular.module('capabilities-catalog')
        .controller('UserFormController', UserFormController);

}(window.angular));
