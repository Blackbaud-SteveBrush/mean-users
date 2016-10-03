(function (angular) {
    'use strict';

    function AuthService($http, $q, $window, SessionService) {
        var isLoggedIn,
            service,
            user;

        isLoggedIn = false;
        service = this;
        user = null;

        service.getUser = function () {
            return user;
        };

        service.getUserStatus = function () {
            var deferred;

            deferred = $q.defer();

            $http
                .get('/api/user-status')
                .then(function (res) {
                    isLoggedIn = res.data.status;
                    user = res.data.user;
                    deferred.resolve({
                        isLoggedIn: isLoggedIn
                    });
                })
                .catch(function (res) {
                    isLoggedIn = false;
                    user = null;
                    deferred.reject(res);
                });

            return deferred.promise;
        };

        service.isLoggedIn = function () {
            return isLoggedIn;
        };

        service.isAuthorized = function (permission) {
            if (!permission) {
                return true;
            }
            if (user === null) {
                return false;
            }
            if (user.role === 'admin') {
                return true;
            }
            return (user.permissions.indexOf(permission) > -1);
        };

        service.isRole = function (role) {
            if (!role) {
                return true;
            }
            if (user === null) {
                return false;
            }
            if (user.role === 'admin') {
                return true;
            }
            return (user.role === role);
        };

        service.login = function (emailAddress, password) {
            var deferred;

            deferred = $q.defer();

            $http
                .post('/api/login', {
                    emailAddress: emailAddress,
                    password: password
                })
                .then(function (res) {
                    isLoggedIn = true;
                    deferred.resolve(res.data);
                })
                .catch(function (res) {
                    isLoggedIn = false;
                    deferred.reject(res);
                });

            return deferred.promise;
        };

        service.logout = function () {
            var deferred;

            deferred = $q.defer();
            SessionService.clearAll();

            $http
                .get('/api/logout')
                .then(function (res) {
                    isLoggedIn = false;
                    deferred.resolve(res.data);
                })
                .catch(function (res) {
                    isLoggedIn = true;
                    deferred.reject(res.data);
                });

            return deferred.promise;
        };

        service.redirect = function () {
            var redirect = 'https://signin.blackbaud.com/' +
                'oauth2/authorize?response_type=id_token' +
                '&scope=openid profile email' +
                '&client_id=' + encodeURIComponent('renxt.blackbaud.com') +
                '&state=' + encodeURIComponent('abc123') +
                '&nonce=' + encodeURIComponent('abc123') +
                '&redirect_uri=' + encodeURIComponent('http://localhost:3000/');
            console.log("REDIRECT", redirect);
            // $window.location.href = redirect;
        };

        service.register = function (data) {
            return $http
                .post('/api/register', data)
                .then(function (res) {
                    return res.data;
                });
        };

        service.validateToken = function () {
            console.log("Validating access token...");
            return $http.post('/api/oauth/validate', SessionService.get('token'));
        };
    }

    AuthService.$inject = [
        '$http',
        '$q',
        '$window',
        'SessionService'
    ];

    angular.module('capabilities-catalog')
        .service('AuthService', AuthService);

}(window.angular));
