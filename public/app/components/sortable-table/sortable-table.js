(function (angular) {
    'use strict';

    function ccSortableTable() {
        return {
            restrict: 'E',
            templateUrl: '../public/app/components/sortable-table/sortable-table.html',
            scope: true,
            bindToController: {
                'model': '=',
                'columns': '='
            },
            controller: 'SortableTableController as sortableCtrl'
        };
    }

    function SortableTableController() {
        var vm;

        vm = this;
        vm.ascending = true;

        vm.isActiveColumn = function (column) {
            return (column.model && vm.orderBy === column.model);
        };

        vm.isOrderable = function (column) {
            if (!column.name) {
                return false;
            }
            if (column.isOrderable === false) {
                return false;
            }
            return true;
        };

        vm.parseModelFromString = function (item, key) {
            var data,
                temp;

            temp = [];

            if (!key) {
                return null;
            }

            if (key.indexOf('.') > -1) {
                key.split('.').forEach(function (property) {
                    data = temp[property];
                    if (!data) {
                        temp = item[property];
                    }
                });
                return data;
            }
            return item[key];
        };

        vm.setOrderBy = function (key) {
            if (vm.orderBy === key) {
                vm.toggleDirection();
            }
            vm.orderBy = key;
        };

        vm.toggleDirection = function () {
            vm.ascending = !vm.ascending;
        };
    }

    angular.module('capabilities-catalog')
        .controller('SortableTableController', SortableTableController)
        .directive('ccSortableTable', ccSortableTable);

}(window.angular));
