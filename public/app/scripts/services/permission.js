(function (angular) {
  'use strict';

  function PermissionService($http) {
    var service;
    service = this;
    service.getAll = function () {
      return $http.get('/api/permissions/').then(function (res) {
        return res.data;
      });
    };
    service.create = function (data) {
      return $http.post('/api/permissions/', data).then(function (res) {
        return res.data;
      });
    };
    service.deleteById = function (id) {
      return $http.delete('/api/permissions/' + id).then(function (res) {
        return res.data;
      });
    };
    service.updateById = function (id, data) {
      return $http.put('/api/permissions/' + id, data).then(function (res) {
        return res.data;
      });
    };
  }

  PermissionService.$inject = [
    '$http'
  ];
  angular.module('mean-users')
    .service('PermissionService', PermissionService);
}(window.angular));
