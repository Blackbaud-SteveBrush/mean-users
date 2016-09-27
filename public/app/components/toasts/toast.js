(function () {
    'use strict';

    function ToastMessageController($state, data) {
        var vm;

        vm = this;
        vm.linkText = data.linkText || false;
        vm.icon = data.icon || false;
        vm.requestLogin = data.requestLogin || false;

        switch (typeof data.link) {
            case 'function':
                vm.action = data.link;
            break;
            case 'string':
                vm.action = function () {
                    $state.go(data.link);
                };
            break;
            default:
                vm.action = function () {};
            break;
        }

        if (data.message) {
            vm.messageText = data.message;
        } else {
            vm.messageText = "There was a problem. Please try again.";
        }
    }

    ToastMessageController.$inject = [
        '$state',
        'data'
    ];

    angular.module('capabilities-catalog')
        .controller('ToastMessageController', ToastMessageController);
}());
