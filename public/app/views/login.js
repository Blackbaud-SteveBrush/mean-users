(function (angular) {
    'use strict';

    function LoginPageController($state, $window) {
        var vm;
        vm = this;
        vm.redirect = function () {
            var params,
                state;

            state = $state.previous.name;
            params = $state.previous.params;

            if (!state || state === 'login') {
                state = 'home';
                params = {};
            }
            $state.go(state, params, { reload: true, notify: false });
            $window.location.reload(true);
        };
    }

    LoginPageController.$inject = [
        '$state',
        '$window'
    ];

    angular.module('capabilities-catalog')
        .controller('LoginPageController', LoginPageController);

}(window.angular));
