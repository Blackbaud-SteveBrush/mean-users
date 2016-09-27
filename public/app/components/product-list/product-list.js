(function (angular) {
    'use strict';

    function ccProductList() {
        return {
            restrict: 'E',
            controller: 'ProductListController as listCtrl',
            templateUrl: '../public/app/components/product-list/product-list.html',
            scope: {
                items: '=',
                hideHeadings: '='
            }
        };
    }

    function ccProductTable() {
        return {
            restrict: 'E',
            scope: true,
            controller: 'ProductListController as listCtrl',
            templateUrl: '../public/app/components/product-table/product-table.html'
        };
    }

    function ProductListController($state, SessionService) {
        var vm;
        vm = this;
        vm.isAuthorized = SessionService.isAuthorized;
        vm.isAuthenticated = SessionService.isAuthenticated;

        vm.goto = function (state, params, e) {
            e.preventDefault();
            e.stopPropagation();
            $state.go(state, params);
        };

    }

    ProductListController.$inject = [
        '$state',
        'SessionService'
    ];

    angular.module('capabilities-catalog')
        .controller('ProductListController', ProductListController)
        .directive('ccProductList', ccProductList)
        .directive('ccProductTable', ccProductTable);

}(window.angular));
