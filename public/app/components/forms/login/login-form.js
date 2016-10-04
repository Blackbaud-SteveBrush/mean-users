(function (angular) {
    'use strict';

    function ccLoginForm() {
        return {
            restrict: 'E',
            scope: true,
            bindToController: {
                onSuccess: '='
            },
            controller: 'LoginFormController as formCtrl',
            templateUrl: '../public/app/components/forms/login/login-form.html'
        };
    }

    function LoginFormController(AuthService, MessageService) {
        var vm;

        vm = this;

        vm.submit = function () {
            AuthService
                .login(vm.formData.emailAddress, vm.formData.password)
                .then(function () {
                    if (vm.onSuccess) {
                        vm.onSuccess.call();
                    }
                })
                .catch(MessageService.handleError);
        };

        vm.loginWithBlackbaud = function () {
            AuthService
                .loginWithToken()
                .then(function () {
                    if (vm.onSuccess) {
                        vm.onSuccess.call();
                    }
                })
                .catch(MessageService.handleError);
        };
    }

    LoginFormController.$inject = [
        'AuthService',
        'MessageService'
    ];

    angular.module('capabilities-catalog')
        .controller('LoginFormController', LoginFormController)
        .directive('ccLoginForm', ccLoginForm);

}(window.angular));
