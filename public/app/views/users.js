(function (angular) {
  'use strict';

  function UsersController($state, MessageService, UserService) {
        var vm;

        vm = this;
        vm.sortableTable = {
            columns: [
                {
                    name: 'Email Address',
                    model: 'emailAddress'
                },
                {
                    name: 'Role',
                    model: '_role.name'
                },
                {
                    name: '',
                    button: {
                        action: function (item) {
                            $state.go('admin.user-form', { id: item._id });
                        },
                        label: '<i class="fa fa-pencil"></i>Edit'
                    }
                }
            ]
        };

        UserService
            .getAll()
            .then(function (data) {
                vm.users = data.value;
            }).catch(MessageService.handleError);
    }

    UsersController.$inject = [
        '$state',
        'MessageService',
        'UserService'
    ];

    angular.module('capabilities-catalog')
        .controller('UsersController', UsersController);

}(window.angular));
