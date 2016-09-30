(function (angular) {
    'use strict';

    function UserFormController($q, $scope, $state, AuthService, MessageService, RoleService, UserService) {
        var vm;

        vm = this;
        vm.isAuthorized = AuthService.isAuthorized;

        function handleResponse(data) {
            if (vm.formData._id) {
                MessageService.handleSuccess({
                    messageText: 'User successfully updated.',
                    link: 'admin.users',
                    linkText: 'View all'
                });
            } else {
                MessageService.handleSuccess({
                    messageText: 'User successfully created.',
                    link: 'admin.users',
                    linkText: 'View all'
                });
            }
            vm.formData = data;
        }

        vm.delete = function () {
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

        vm.requestReset = function () {
            vm.waiting = true;
            UserService
                .requestReset(vm.formData)
                .then(handleResponse)
                .catch(MessageService.handleError);
        };

        vm.isSelected = function (role) {
            if (!vm.formData || vm.formData._role === role._id) {
                return true;
            }
            return (role.isDefault === true);
        };

        vm.submit = function () {
            if (vm.formData._id) {
                UserService
                    .updateById($state.params.id, vm.formData)
                    .then(handleResponse)
                    .catch(MessageService.handleError);
            } else {
                UserService
                    .create(vm.formData)
                    .then(handleResponse)
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
