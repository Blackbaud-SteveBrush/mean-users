(function (angular) {
    'use strict';

    function CrudFactory($http, $q, AuthService) {
        function Crudable(options) {
            var defaults,
                self,
                settings;

            self = this;
            defaults = {
                authorization: {
                    delete: {
                        permission: null,
                        message: "You do not have permission to delete that resource."
                    },
                    get: {
                        permission: null,
                        message: "You do not have permission to read that resource."
                    },
                    getAll: {
                        permission: null,
                        message: "You do not have permission to read those resources."
                    },
                    post: {
                        permission: null,
                        message: "You do not have permission to create that resource."
                    },
                    put: {
                        permission: null,
                        message: "You do not have permission to update that resource."
                    }
                }
            };

            settings = angular.merge({}, defaults, options);

            self.create = function (data) {
                if (AuthService.isAuthorized(settings.authorization.post.permission)) {
                    return $http.post('/api/' + settings.endpointResourceName, data).then(function (res) {
                        return res.data;
                    });
                }
                return $q.reject(settings.authorization.post.message);
            };

            self.deleteById = function (id) {
                if (AuthService.isAuthorized(settings.authorization.delete.permission)) {
                    return $http.delete('/api/' + settings.endpointResourceName + '/' + id).then(function (res) {
                        return res.data;
                    });
                }
                return $q.reject(settings.authorization.delete.message);
            };

            self.getAll = function () {
                if (AuthService.isAuthorized(settings.authorization.getAll.permission)) {
                    return $http.get('/api/' + settings.endpointResourceName).then(function (res) {
                        return res.data;
                    });
                }
                return $q.reject(settings.authorization.getAll.message);
            };

            self.getById = function (id) {
                if (!id) {
                    return $q.resolve({});
                }
                if (AuthService.isAuthorized(settings.authorization.get.permission)) {
                    return $http.get('/api/' + settings.endpointResourceName + '/' + id).then(function (res) {
                        return res.data;
                    });
                }
                return $q.reject(settings.authorization.get.message);
            };

            self.updateById = function (id, data) {
                if (AuthService.isAuthorized(settings.authorization.put.permission)) {
                    return $http.put('/api/' + settings.endpointResourceName + '/' + id, data).then(function (res) {
                        return res.data;
                    });
                }
                return $q.reject(settings.authorization.put.message);
            };
        }

        this.instantiate = function (options) {
            return new Crudable(options);
        };

        return this;
    }

    CrudFactory.$inject = [
        '$http',
        '$q',
        'AuthService'
    ];

    angular.module('capabilities-catalog')
        .factory('CrudFactory', CrudFactory);

}(window.angular));
