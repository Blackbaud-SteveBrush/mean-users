(function (angular) {
    'use strict';

    function ResetPasswordController($state, AuthService, MessageService, UserService) {
        var vm;

        vm = this;
        vm.formData = {};

        vm.token = $state.params.token;
        vm.isWaiting = true;

        UserService.getAllByRole('administrator').then(function (data) {
            vm.administrators = data.value;
            vm.isWaiting = false;
        });

        vm.mailTo = function (emailAddress) {
            location.href = 'mailto:' + emailAddress + '?subject=Service Catalog > Editor Account Request';
        };

        vm.submitRequest = function () {
            vm.isWaiting = true;
            UserService
                .sendResetPasswordRequest(vm.formData.emailAddress)
                .then(function () {
                    $state.go('login');
                    MessageService.success('Password reset request successfully sent.');
                })
                .catch(function (error) {
                    MessageService.handleError(error);
                    vm.isWaiting = false;
                });
        };

        vm.submitReset = function () {
            vm.isWaiting = true;
            UserService
                .resetPassword($state.params.token, vm.formData.password, vm.formData.retypePassword)
                .then(function () {
                    $state.go('login');
                    MessageService.success('Password reset successfully.');
                })
                .catch(function (error) {
                    MessageService.handleError(error);
                    vm.isWaiting = false;
                });
        };
    }

    ResetPasswordController.$inject = [
        '$state',
        'AuthService',
        'MessageService',
        'UserService'
    ];

    angular.module('capabilities-catalog')
        .controller('ResetPasswordController', ResetPasswordController);

}(window.angular));
