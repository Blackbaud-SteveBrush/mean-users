(function () {
    'use strict';

    function routeCssClassname($rootScope) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, elem) {
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                    if (fromState.name !== toState.name) {
                        elem.removeClass('page-' + fromState.name);
                        elem.addClass('page-' + toState.name);
                    }
                });
            }
        };
    }

    routeCssClassname.$inject = [
        '$rootScope'
    ];

    angular.module('capabilities-catalog')
        .directive('routeCssClassname', routeCssClassname);
}());
