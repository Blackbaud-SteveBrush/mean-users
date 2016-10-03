(function (angular) {
    'use strict';

    function UserService($http, CrudFactory) {
        var service;

        service = CrudFactory.instantiate({
            endpointResourceName: 'users',
            authorization: {
                delete: {
                    permission: 'DELETE_USER'
                },
                getAll: {
                    permission: 'GET_USERS'
                },
                post: {
                    permission: 'CREATE_USER'
                },
                put: {
                    permission: 'UPDATE_USER'
                }
            }
        });

        service.sendResetPasswordRequest = function (id) {
            return $http.post('/api/users/' + id + '/reset-password').then(function (res) {
                return res.data;
            });
        };

        return service;
    }

    UserService.$inject = [
        '$http',
        'CrudFactory'
    ];

    angular.module('capabilities-catalog')
        .service('UserService', UserService);

}(window.angular));
