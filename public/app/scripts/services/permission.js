(function (angular) {
    'use strict';

    function PermissionService(CrudFactory) {
        return CrudFactory.instantiate({
            endpointResourceName: 'permissions',
            authorization: {
                delete: {
                    permission: 'DELETE_PERMISSION'
                },
                post: {
                    permission: 'CREATE_PERMISSION'
                },
                put: {
                    permission: 'UPDATE_PERMISSION'
                }
            }
        });
    }

    PermissionService.$inject = [
        'CrudFactory'
    ];

    angular.module('capabilities-catalog')
        .service('PermissionService', PermissionService);

}(window.angular));
