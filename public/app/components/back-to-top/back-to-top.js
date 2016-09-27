(function () {
    'use strict';

    function ccBackToTop($window) {
        return {
            restrict: 'E',
            templateUrl: '../public/app/components/back-to-top/back-to-top.html',
            replace: true,
            scope: {
                duration: '@',
                offset: '@'
            },
            link: function (scope, $element) {
                var duration,
                    offset;
                /*
                * Defaults in case the directive Element isn't given an offset or duration value to translate into our scope.
                */
                duration = parseInt(scope.duration) || 500;
                offset = parseInt(scope.offset) || 200;

                /*
                * Grabs the $window service, and binds a scroll event to it, checking to see if the current
                * top of window (pageYOffset) is lower than our offset key, if it is, fade in our back to top button.
                * if it isn't fade the button out.
                */
                angular.element($window).bind('scroll', function () {
                    if ($window.pageYOffset > offset) {
                        $element.fadeIn(duration);
                    } else {
                        $element.fadeOut(duration);
                    }
                });

                /*
                * binds the backToTop function to our directive isolated scope, stops navigation from happening, and scrolls
                * us back to the top of the page.
                */
                scope.backToTop = function () {
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: 0
                    }, duration);
                    return false;
                };
            }
        };
    }

    ccBackToTop.$inject = [
        '$window'
    ];

    angular.module('capabilities-catalog')
        .directive('ccBackToTop', ccBackToTop);

}(window.angular));
