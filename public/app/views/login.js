(function (angular) {
    'use strict';

    function LoginController($state, AuthService, MessageService) {
        var vm;

        vm = this;
        vm.formData = {};

        function onSuccess() {
            $state.go('home');
        }

        vm.submit = function () {
            AuthService
                .login(vm.formData.emailAddress, vm.formData.password)
                .then(onSuccess)
                .catch(MessageService.handleError);
        };

        vm.loginWithBlackbaud = function () {
            AuthService
                .loginWithToken()
                .then(onSuccess)
                .catch(function () {
                    AuthService.redirect();
                });
        };
    }

    LoginController.$inject = [
        '$state',
        'AuthService',
        'MessageService'
    ];

    angular.module('capabilities-catalog')
        .controller('LoginController', LoginController);

}(window.angular));
