(function (angular) {
  'use strict';

  function AuthService($http, $q) {
    var isLoggedIn,
        service,
        user;

    isLoggedIn = false;
    service = this;
    user = null;

    service.getUserStatus = function () {
      var deferred;
      deferred = $q.defer();
      $http.get('/api/user-status').then(function (res) {
        isLoggedIn = res.data.status;
        user = res.data.user;
        if (res.data.status === true) {
          deferred.resolve();
        } else {
          deferred.reject();
        }
      }).catch(function () {
        isLoggedIn = false;
        user = null;
        deferred.reject();
      });
      return deferred.promise;
    };

    service.isLoggedIn = function () {
      return isLoggedIn;
    };

    service.isAuthorized = function (permission) {
      console.log("isAuthorized:", user);
      return true;
    };

    service.isRole = function (role) {
      var isAuthorized;
      switch (role) {
        case 'admin':
        isAuthorized = true;
        break;
        case 'editor':
        isAuthorized = service.isLoggedIn();
        break;
        default:
        isAuthorized = true;
        break;
      }
      return isAuthorized;
    };

    service.login = function (emailAddress, password) {
      var deferred;
      deferred = $q.defer();
      $http.post('/api/login', {
        emailAddress: emailAddress,
        password: password
      }).then(function (res) {
        isLoggedIn = true;
        deferred.resolve(res.data);
      }).catch(function (res) {
        isLoggedIn = false;
        deferred.reject(res.data);
      });
      return deferred.promise;
    };

    service.logout = function () {
      console.log("LOGOUT!!!");
      var deferred;
      deferred = $q.defer();
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

    service.register = function (data) {
      return $http.post('/api/register', data).then(function (res) {
        return res.data;
      });
    };
  }

  AuthService.$inject = ['$http', '$q'];

  angular.module('mean-users')
    .service('AuthService', AuthService);
}(window.angular));
