(function (angular) {
    'use strict';

    function UserService($http) {
        var service;

        service = this;

        service.create = function (data) {
            return $http.post('/api/users', data).then(function (res) {
                return res.data;
            });
        };

        service.deleteById = function (id) {
            return $http.delete('/api/users/' + id).then(function (res) {
                return res.data;
            });
        };

        service.getAll = function () {
            return $http.get('/api/users').then(function (res) {
                return res.data;
            });
        };

        service.getById = function (id) {
            return $http.get('/api/users/' + id).then(function (res) {
                return res.data;
            });
        };

        service.updateById = function (id, data) {
            return $http.put('/api/users/' + id, data).then(function (res) {
                return res.data;
            });
        };
    }

    UserService.$inject = [
        '$http'
    ];

    angular.module('mean-users')
        .service('UserService', UserService);

}(window.angular));
