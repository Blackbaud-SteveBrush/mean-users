(function (angular) {
    'use strict';

    function PermissionService(CrudFactory) {
        var service;
        service = CrudFactory.instantiate({
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
        service.getAll().then(function (data) {
            console.log("PERMISSIONS:", data.value);
        });
        return service;
    }

    PermissionService.$inject = [
        'CrudFactory'
    ];

    angular.module('capabilities-catalog')
        .service('PermissionService', PermissionService);

}(window.angular));
