(function (angular) {
    'use strict';

    function SessionService(localStorageService) {
        var service;

        service = this;

        service.get = function (key) {
            return localStorageService.get(key);
        };

        service.set = function (key, val) {
            localStorageService.set(key, val);
        };

        service.clearAll = function () {
            localStorageService.clearAll();
        };
    }

    SessionService.$inject = [
        'localStorageService'
    ];

    angular.module('capabilities-catalog')
        .service('SessionService', SessionService);

}(window.angular));
