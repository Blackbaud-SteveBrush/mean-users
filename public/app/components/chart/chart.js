(function (angular) {
    'use strict';

    function ccChart() {
        return {
            restrict: 'E',
            scope: true,
            bindToController: {
                model: '=',
                title: '=',
                totals: '='
            },
            controller: ['bbModal', function (bbModal) {
                var vm;
                vm = this;

                vm.openModal = function () {
                    bbModal.open({
                        resolve: {
                            data: {
                                model: vm.model,
                                title: vm.title
                            }
                        },
                        controller: ['data', function (data) {
                            this.title = data.title;
                            this.model = data.model;
                        }],
                        controllerAs: 'modalCtrl',
                        templateUrl: '../public/app/components/modals/chart-modal.html'
                    });
                };
            }],
            controllerAs: 'chartCtrl',
            templateUrl: '../public/app/components/chart/chart.html'
        };
    }

    angular.module('capabilities-catalog')
        .directive('ccChart', ccChart);
}(window.angular));
