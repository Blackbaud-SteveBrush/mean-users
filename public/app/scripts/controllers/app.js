(function (angular) {
    'use strict';

    function AppController($scope, $state, $timeout, AuthService) {
        var vm;

        vm = this;
        vm.isLoggedIn = AuthService.isLoggedIn;
        vm.isAuthorized = AuthService.isAuthorized;

        $scope.$on('ccAuthorizationSuccess', function () {
            vm.isReady = true;
            $timeout(function () {
                vm.user = AuthService.getUser();
            });
        });
    }

    AppController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        'AuthService'
    ];

    angular.module('capabilities-catalog')
        .controller('AppController', AppController);

}(window.angular));
