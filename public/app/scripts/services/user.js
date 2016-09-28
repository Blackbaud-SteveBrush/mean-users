(function (angular) {
    'use strict';

    function UserService(CrudFactory) {
        return CrudFactory.instantiate({
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
    }

    UserService.$inject = [
        'CrudFactory'
    ];

    angular.module('capabilities-catalog')
        .service('UserService', UserService);

}(window.angular));
