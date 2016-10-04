(function (angular) {
    'use strict';

    function RoleService(CrudFactory) {
        return CrudFactory.instantiate({
            endpointResourceName: 'roles',
            authorization: {
                delete: {
                    permission: 'DELETE_ROLE'
                },
                post: {
                    permission: 'CREATE_ROLE'
                },
                put: {
                    permission: 'EDIT_ROLE'
                }
            }
        });
    }

    RoleService.$inject = [
        'CrudFactory'
    ];

    angular.module('capabilities-catalog')
        .service('RoleService', RoleService);

}(window.angular));
