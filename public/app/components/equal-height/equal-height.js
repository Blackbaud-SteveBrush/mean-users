(function (angular) {
    'use strict';

    function ccEqualHeight($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {

                // Add a timeout so that this executes at the end of a digest.
                $timeout(function () {
                    var items,
                        len;

                    items = element[0].querySelectorAll('.equal-height-item');
                    len = items.length;

                    function setHeight() {
                        var h,
                            height,
                            i;

                        height = 0;

                        // First, make sure no explicit heights are set.
                        for (i = 0; i < len; ++i) {
                            items[i].style.height = 'auto';
                        }

                        // Second, determine the max height of the children.
                        for (i = 0; i < len; ++i) {
                            h = items[i].offsetHeight;
                            height = (h > height) ? h : height;
                        }

                        // Finally, set all children's height to the max height.
                        for (i = 0; i < len; ++i) {
                            items[i].style.height = height + 'px';
                        }
                    }

                    // Set the heights when the page loads.
                    setHeight();

                    // Set the heights when the page is resized.
                    angular.element(window).bind('resize', setHeight);
                });
            }
        };
    }

    ccEqualHeight.$inject = [
        '$timeout'
    ];

    angular.module('capabilities-catalog')
        .directive('ccEqualHeight', ccEqualHeight);

}(window.angular));
