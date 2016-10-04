(function (angular) {
    'use strict';

    function UserService($http, $q, CrudFactory) {
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
                    permission: 'EDIT_USER'
                }
            }
        });

        service.sendResetPasswordRequest = function (emailAddress) {
            return $http.post('/api/users/reset-password-request', {
                emailAddress: emailAddress
            }).then(function (res) {
                return res.data;
            });
        };

        service.resetPassword = function (token, password, retypePassword) {
            if (password !== retypePassword) {
                return $q.reject("The passwords you entered do not match!");
            }
            return $http.post('/api/users/reset-password/' + token, {
                password: password
            }).then(function (res) {
                return res.data;
            });
        };

        service.getAllByRole = function (roleName) {
            return $http.get('/api/users/role/' + roleName).then(function (res) {
                return res.data;
            });
        };

        return service;
    }

    UserService.$inject = [
        '$http',
        '$q',
        'CrudFactory'
    ];

    angular.module('capabilities-catalog')
        .service('UserService', UserService);

}(window.angular));
