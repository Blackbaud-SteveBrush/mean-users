(function (angular) {
    'use strict';

    function LoginModalController($rootScope, $scope, $timeout, MessageService) {
        var vm;

        vm = this;

        vm.login = function () {
            $timeout(function () {
                angular.element(document.querySelector('#form-login')).triggerHandler('submit');
            }, 100);
        };

        vm.onSuccess = function () {
            $scope.$dismiss('success');
            $rootScope.$broadcast('modalLoginSuccess');
            MessageService.closeAll();
            MessageService.success("Log in successful!");
        };
    }

    LoginModalController.$inject = [
        '$rootScope',
        '$scope',
        '$timeout',
        'MessageService'
    ];


    angular.module('capabilities-catalog')
        .controller('LoginModalController', LoginModalController);

}(window.angular));
