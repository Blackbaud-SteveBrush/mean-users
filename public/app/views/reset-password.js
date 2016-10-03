(function (angular) {
    'use strict';

    function ResetPasswordController($state, MessageService, UserService) {
        var vm;

        vm = this;
        vm.formData = {};

        if ($state.params.token) {
            console.log("TOKEN!", $state.params.token);
        }

        vm.submit = function () {
            UserService
                .sendResetPasswordRequest(vm.formData.emailAddress)
                .then(function () {
                    MessageService.success('Password reset request successfully sent.');
                })
                .catch(MessageService.handleError);
        };
    }

    ResetPasswordController.$inject = [
        'MessageService',
        'UserService'
    ];

    angular.module('capabilities-catalog')
        .controller('ResetPasswordController', ResetPasswordController);

}(window.angular));
