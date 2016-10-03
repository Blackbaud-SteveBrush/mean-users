(function (angular) {
    'use strict';

    function AppController($scope, $state, $timeout, AuthService) {
        var vm;

        vm = this;
        vm.isLoggedIn = AuthService.isLoggedIn;
        vm.isAuthorized = AuthService.isAuthorized;

        /**
         * Login Process:
         * --------------
         * 1. On page load, wait for the Omnibar to alert Angular app about user status.
         * 2. If the user is logged out, redirect them to blackbaud.com to login. Upon successful login, save the access token in the Angular app's local storage.
         * 3. If the user is logged into blackbaud.com, the access token stored in the session is validated.
         * 4. If the token is valid, the user may automatically login to the catalog using the access token, by clicking on a "Login with Blackbaud.com" button.
         * 5. If the token is invalid, redirect to blackbaud.com to login.
         * 6. A user can logout of the catalog with a logout button, but still view the site. If the user is validated by BBAUTH, but logged out of the catalog, they may click the "Login" button to automatically login again.
         */
        $scope.$on('omnibarUserLoaded', function (e, user) {
            if (!user.id) {
                console.log("Not logged in to blackbaud.com. Redirecting...");
                AuthService
                    .logout()
                    .then(AuthService.redirect)
                    .catch(AuthService.redirect);
            } else {
                console.log("Already logged in to blackbaud.com.");
                //console.log("Logged in!", user, AuthService.getAccessToken());
                AuthService
                    .validateToken()
                    .then(function () {
                        console.log("Token validated!");
                    })
                    .catch(function () {
                        console.log("Token invalid.");
                        // AuthService
                        //     .logout()
                        //     .then(AuthService.redirect)
                        //     .catch(AuthService.redirect);
                    });
            }
        });

        $scope.$on('ccAuthorizationSuccess', function () {
            vm.isReady = true;
            $timeout(function () {
                vm.user = AuthService.getUser();
            });
        });
    }

    AppController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        'AuthService'
    ];

    angular.module('capabilities-catalog')
        .controller('AppController', AppController);

}(window.angular));
