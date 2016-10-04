(function (angular) {
    'use strict';

    function LogoutController($state, AuthService) {
        AuthService.logout().then(function () {
            $state.go('login', {}, {
                reload: true
            });
        });
    }

    LogoutController.$inject = [
        '$state',
        'AuthService'
    ];

    angular.module('capabilities-catalog')
        .controller('LogoutController', LogoutController);

}(window.angular));
