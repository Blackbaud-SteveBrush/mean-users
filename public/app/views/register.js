(function (angular) {
    'use strict';

    function RegisterController($state, AuthService, MessageService) {
        var vm;

        vm = this;
        vm.formData = {};

        vm.submit = function () {
            AuthService
                .register(vm.formData)
                .then(function () {
                    $state.go('login');
                })
                .catch(MessageService.handleError);
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
