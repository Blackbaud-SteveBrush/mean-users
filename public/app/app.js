(function (angular) {
  'use strict';

  function ConfigRoutes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '../public/app/views/home.html',
        controller: 'HomeController as homeCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: '../public/app/views/login.html',
        controller: 'LoginController as loginCtrl'
      })
      .state('logout', {
        url: '/logout',
        template: '',
        controller: ['$state', '$window', 'AuthService', function ($state, $window, AuthService) {
          AuthService.logout().then(function () {
            $state.go('login');
            $window.location.reload();
          });
        }]
      })
      .state('register', {
        url: '/register',
        templateUrl: '../public/app/views/register.html',
        controller: 'RegisterController as registerCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: '../public/app/views/profile.html',
        controller: 'ProfileController as profileCtrl',
        restrictions: {
          role: 'editor'
        }
      })
      .state('admin', {
        url: '/admin',
        abstract: true,
        template: '<ui-view/>',
        restrictions: {
          role: 'admin'
        }
      })
      .state('admin.users', {
        url: '/users',
        templateUrl: '../public/app/views/admin/users.html',
        controller: 'UsersController as usersCtrl'
      })
      .state('admin.roles', {
        url: '/roles',
        templateUrl: '../public/app/views/admin/roles.html',
        controller: 'RolesController as rolesCtrl'
      })
      .state('admin.permissions', {
        url: '/permissions',
        templateUrl: '../public/app/views/admin/permissions.html',
        controller: 'PermissionsController as permissionsCtrl'
      });
  }

  function Run($rootScope, $state, AuthService) {
    $rootScope.$on('$stateChangeStart', function (e, next) {
      AuthService
        .getUserStatus()
        .then(function () {
          if (AuthService.isAuthorized(next.permissions) === false || AuthService.isRole(next.role) === false) {
            e.preventDefault();
            $state.go('login');
          }
        });
    });
  }

  function AppController(AuthService) {
    var vm;
    vm = this;
    vm.isLoggedIn = AuthService.isLoggedIn;
    vm.isAuthorized = AuthService.isAuthorized;
  }

  ConfigRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
  Run.$inject = ['$rootScope', '$state', 'AuthService'];
  AppController.$inject = ['AuthService'];

  angular.module('mean-users', [
    'sky',
    'ui.router',
    'mean-users.templates',
    'checklist-model'
  ])
    .config(ConfigRoutes)
    .run(Run)
    .controller('AppController', AppController);

}(window.angular));
