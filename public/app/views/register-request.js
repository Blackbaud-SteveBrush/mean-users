(function (angular) {
    'use strict';

    function RegisterRequestController($state, AuthService, MessageService, UserService) {
        var vm;

        vm = this;
        vm.formData = {};
        vm.isWaiting = true;

        UserService.getAllByRole('administrator').then(function (data) {
            vm.administrators = data.value;
            vm.isWaiting = false;
        });

        vm.mailTo = function (emailAddress) {
            location.href = 'mailto:' + emailAddress + '?subject=Service Catalog > Editor Account Request';
        };

        vm.submit = function () {
            vm.isWaiting = true;
            AuthService
                .createRegistrationRequest(vm.formData.emailAddress)
                .then(function () {
                    $state.go('login');
                    MessageService.success("New user registration request successfully sent!");
                })
                .catch(function (error) {
                    vm.isWaiting = false;
                    MessageService.handleError(error);
                });
        };
    }

    RegisterRequestController.$inject = [
        '$state',
        'AuthService',
        'MessageService',
        'UserService'
    ];

    angular.module('capabilities-catalog')
        .controller('RegisterRequestController', RegisterRequestController);

}(window.angular));
