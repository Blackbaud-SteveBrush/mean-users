(function (angular) {
    'use strict';

    function RoleService($http) {
        var service;

        service = this;

        service.getAll = function () {
            return $http.get('/api/roles/').then(function (res) {
                return res.data;
            });
        };

        service.create = function (data) {
            return $http.post('/api/roles/', data).then(function (res) {
                return res.data;
            });
        };

        service.deleteById = function (id) {
            return $http.delete('/api/roles/' + id).then(function (res) {
                return res.data;
            });
        };

        service.updateById = function (id, data) {
            return $http.put('/api/roles/' + id, data).then(function (res) {
                return res.data;
            });
        };
    }

    RoleService.$inject = [
        '$http'
    ];

    angular.module('capabilities-catalog')
        .service('RoleService', RoleService);
}(window.angular));
