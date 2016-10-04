(function (angular) {
    'use strict';

    function MainController($scope, $timeout, AuthService) {
        var vm;

        vm = this;
        vm.isLoggedIn = AuthService.isLoggedIn;
        vm.isAuthorized = AuthService.isAuthorized;

        $scope.$on('$stateChangeSuccess', function () {
            vm.isReady = true;
            $timeout(function () {
                vm.user = AuthService.getUser();
            });
        });
    }

    MainController.$inject = [
        '$scope',
        '$timeout',
        'AuthService'
    ];

    angular.module('capabilities-catalog')
        .controller('MainController', MainController);

}(window.angular));
