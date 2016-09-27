(function (angular) {
    'use strict';

    function ccCapabilityList() {
        return {
            restrict: 'E',
            controller: 'CapabilityListController as listCtrl',
            templateUrl: '../public/app/components/capability-list/capability-list.html',
            scope: {
                items: '=',
                hideHeadings: '='
            }
        };
    }

    function ccCapabilityTable() {
        return {
            restrict: 'E',
            scope: true,
            controller: 'CapabilityListController as listCtrl',
            templateUrl: '../public/app/components/capability-table/capability-table.html'
        };
    }

    function CapabilityListController($state, SessionService) {
        var vm;
        vm = this;
        vm.isAuthorized = SessionService.isAuthorized;
        vm.isAuthenticated = SessionService.isAuthenticated;

        vm.isDraggable = SessionService.isAuthorized('EDIT_CAPABILITY:FULL');

        vm.goto = function (state, params, e) {
            e.preventDefault();
            e.stopPropagation();
            $state.go(state, params);
        };

    }

    CapabilityListController.$inject = [
        '$state',
        'SessionService'
    ];


    angular.module('capabilities-catalog')
        .controller('CapabilityListController', CapabilityListController)
        .directive('ccCapabilityList', ccCapabilityList)
        .directive('ccCapabilityTable', ccCapabilityTable);

}(window.angular));
