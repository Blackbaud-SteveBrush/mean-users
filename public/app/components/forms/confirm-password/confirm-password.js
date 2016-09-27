(function (angular) {
    'use strict';

    function ccConfirmPassphrase() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                originalValue: "=ccConfirmPassphrase"
            },
            link: function (scope, $element, attrs, ngModel) {

                ngModel.$validators.ccConfirmPassphrase = function (modelValue) {
                    return modelValue === scope.originalValue;
                };

                scope.$watch('originalValue', function () {
                    ngModel.$validate();
                });

                scope.$watch(ngModel, function () {
                    ngModel.$validate();
                });
            }
        };
    }

    ccConfirmPassphrase.$inject = [
        '$window'
    ];

    angular.module('capabilities-catalog')
        .directive('ccConfirmPassphrase', ccConfirmPassphrase);

}(window.angular));
