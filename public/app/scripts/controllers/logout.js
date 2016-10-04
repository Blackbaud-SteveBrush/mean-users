(function (angular) {
    'use strict';

    function LogoutController($state, AuthService) {
        AuthService.logout().then(function () {
            $state.go('login');
        });
    }

    LogoutController.$inject = [
        '$state',
        'AuthService'
    ];

    angular.module('capabilities-catalog')
        .controller('LogoutController', LogoutController);

}(window.angular));
