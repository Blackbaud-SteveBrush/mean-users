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
                controller: 'LoginPageController as loginPageCtrl'
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
                data: {
                    restrictions: {
                        role: 'editor'
                    }
                }
            })
            .state('admin', {
                url: '/admin',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    restrictions: {
                        role: 'admin'
                    }
                }
            })
            .state('admin.user-form', {
                url: '/edit/:id',
                templateUrl: '../public/app/views/user-form.html',
                controller: 'UserFormController as userFormCtrl'
            })
            .state('admin.users', {
                url: '/users',
                templateUrl: '../public/app/views/users.html',
                controller: 'UsersController as usersCtrl'
            })
            .state('admin.roles', {
                url: '/roles',
                templateUrl: '../public/app/views/roles.html',
                controller: 'RolesController as rolesCtrl'
            })
            .state('admin.permissions', {
                url: '/permissions',
                templateUrl: '../public/app/views/permissions.html',
                controller: 'PermissionsController as permissionsCtrl'
            });
    }

    function Run($rootScope, $state, $window, AuthService, MessageService) {
        var bypass;
        bypass = false;
        // Restrict routes to roles and permissions.
        $rootScope.$on('$stateChangeStart', function (e, toState, toParams) {
            if (bypass || toState.name === 'login') {
                bypass = false;
                return;
            }
            e.preventDefault();
            AuthService
                .getUserStatus()
                .then(function (data) {
                    toState.data = toState.data || {};
                    if (toState.data.restrictions) {
                        toState.data.restrictions = toState.data.restrictions || {};
                        if (!data.isLoggedIn || AuthService.isAuthorized(toState.data.restrictions.permission) === false || AuthService.isRole(toState.data.restrictions.role) === false) {
                            MessageService.error("You are not authorized to view that page.");
                            $state.go('login', {}, {
                                reload: true,
                                notify: false
                            });
                            $window.location.reload();
                            return;
                        }
                    }
                    bypass = true;
                    $state.go(toState, toParams);
                });
        });

        // Store the previous state, for login redirects.
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $state.previous = {
                name: fromState.name,
                params: fromParams
            };
            $rootScope.$broadcast('ccAuthorizationSuccess');
        });
    }

    function AppController($scope, AuthService) {
        var vm;
        vm = this;
        vm.isLoggedIn = AuthService.isLoggedIn;
        vm.isAuthorized = AuthService.isAuthorized;
        $scope.$on('ccAuthorizationSuccess', function () {
            vm.isReady = true;
        });
    }

    ConfigRoutes.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];
    Run.$inject = [
        '$rootScope',
        '$state',
        '$window',
        'AuthService',
        'MessageService'
    ];
    AppController.$inject = [
        '$scope',
        'AuthService'
    ];

    angular.module('capabilities-catalog', [
        'sky',
        'ui.router',
        'capabilities-catalog.templates',
        'ngSanitize'
    ])
        .config(ConfigRoutes)
        .run(Run)
        .controller('AppController', AppController);

}(window.angular));
