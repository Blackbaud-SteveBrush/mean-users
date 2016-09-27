(function (angular) {
    'use strict';

    function RegisterController($state, AuthService, MessageService) {
        var vm;

        vm = this;
        vm.formData = {};
        vm.submit = function () {
            vm.disabled = true;
            AuthService
                .register(vm.formData)
                .then(function () {
                    $state.go('login');
                    vm.disabled = false;
                })
                .catch(function (error) {
                    MessageService.handleError(error);
                    vm.formData = {};
                    vm.disabled = false;
                });
        };
    }

    RegisterController.$inject = [
        '$state',
        'AuthService',
        'MessageService'
    ];

    angular.module('capabilities-catalog')
        .controller('RegisterController', RegisterController);

}(window.angular));
