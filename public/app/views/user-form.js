(function (angular) {
    'use strict';

    function UserFormController($q, $scope, $state, AuthService, MessageService, RoleService, UserService) {
        var vm;

        vm = this;
        vm.isAuthorized = AuthService.isAuthorized;
        vm.isAuthenticated = AuthService.isAuthenticated;
        vm.isVisible = vm.isAuthorized('CREATE_USER');

        vm.delete = function () {
            UserService
                .deleteById($state.params.id)
                .then(function () {
                    $state.go('admin.users');
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

        vm.submit = function () {
            vm.scrollToTop = false;
            vm.waiting = true;
            if (vm.formData._id) {
                UserService
                    .updateById($state.params.id, vm.formData)
                    .then(handleResponse)
                    .catch(MessageService.handleError)
                    .then(function () {
                        vm.waiting = false;
                    });
            } else {
                UserService
                    .create(vm.formData)
                    .then(handleResponse)
                    .catch(MessageService.handleError)
                    .then(function () {
                        vm.waiting = false;
                    });
            }
        };

        function handleResponse(data) {
            vm.waiting = false;
            if (vm.formData._id) {
                MessageService.handleSuccess({
                    messageText: data.emailAddress + ' user updated!',
                    link: 'admin.users',
                    linkText: 'View all'
                });
            } else {
                MessageService.handleSuccess({
                    messageText: data.emailAddress + ' user created!',
                    link: 'admin.users',
                    linkText: 'View all'
                });
            }
            vm.formData = data;
            vm.scrollToTop = true;
        }

        /**
        * This runs on page load, populates our role drop down menu, and attempts to grab a
        * user from the server based on the $state.params.id in our address.   If no params exist
        * our service catches it and returns a promised empty {data: {}} for our form data.
        */
        RoleService
            .getAll()
            .then(function (data) {
                vm.roles = data.value;
                return UserService.getById($state.params.id);
            })
            .then(function (data) {
                vm.formData = data;
                vm.isReady = true;
                vm.resetPassphrase = false;
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
