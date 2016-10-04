(function (angular) {
    'use strict';

    /**
     * Handles the authentication redirect
     * and parses token information from the URL hash.
     */
    function TokenController($window, $state, SessionService) {
        var hash,
            hashArray,
            hashPairs;

        hash = $window.location.href.split('?')[1];
        hashArray = hash.split('&');
        hashPairs = {};

        hashArray.forEach(function (hash) {
            var obj = hash.split('=');
            hashPairs[obj[0]] = decodeURIComponent(obj[1]);
        });

        SessionService.set('token', hashPairs);
        $state.go('home');
    }

    TokenController.$inject = [
        '$window',
        '$state',
        'SessionService'
    ];

    angular.module('capabilities-catalog')
        .controller('TokenController', TokenController);

}(window.angular));
