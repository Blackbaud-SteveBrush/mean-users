(function (angular) {
    'use strict';

    function ConfigOmnibar(bbOmnibarConfig) {
        bbOmnibarConfig.serviceName = 'Service Catalog';
        bbOmnibarConfig.signInRedirectUrl = window.location.href;
        bbOmnibarConfig.url = 'https://signin.blackbaud.com/omnibar.min.js';
    }

    function ConfigRoutes($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/');

        // Views that do not require OAuth.
        $stateProvider
            .state('logout', {
                url: '/logout',
                controller: 'LogoutController'
            })
            .state('validate', {
                url: '/oauth/?validate=&id_token&state',
                template: '',
                controller: 'TokenController as tokenCtrl'
            });

        // OAuth protected views.
        $stateProvider
            .state('oauth', {
                url: '/',
                templateUrl: '../public/app/views/app.html',
                controller: 'OAuthController as oAuthCtrl'
            })
            .state('home', {
                url: 'home',
                parent: 'oauth',
                templateUrl: '../public/app/views/home.html',
                controller: 'HomeController as homeCtrl'
            })
            .state('login', {
                url: 'login',
                parent: 'oauth',
                templateUrl: '../public/app/views/login.html',
                controller: 'LoginPageController as loginPageCtrl'
            })
            .state('register', {
                url: 'register',
                parent: 'oauth',
                templateUrl: '../public/app/views/register.html',
                controller: 'RegisterController as registerCtrl'
            })
            .state('reset-password', {
                url: 'reset-password/:token',
                parent: 'oauth',
                templateUrl: '../public/app/views/reset-password.html',
                controller: 'ResetPasswordController as resetPasswordCtrl'
            })
            .state('profile', {
                url: 'profile',
                parent: 'oauth',
                templateUrl: '../public/app/views/profile.html',
                controller: 'ProfileController as profileCtrl',
                data: {
                    restrictions: {
                        role: 'editor'
                    }
                }
            })
            .state('admin', {
                url: 'admin',
                parent: 'oauth',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    restrictions: {
                        role: 'admin'
                    }
                }
            })
            .state('admin.user-form', {
                url: '/user/edit/:id',
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

    function ConfigSession(localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('serviceCatalog');
    }

    function Run($rootScope, $state, $window, AuthService, bbOmnibarConfig, MessageService) {
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
                            $state.go('login', {}, { reload: true });
                            return;
                        }
                    }

                    bypass = true;
                    $state.go(toState, toParams);
                }).catch(MessageService.handleError);
        });

        // Store the previous state, for login redirects.
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $state.previous = {
                name: fromState.name,
                params: fromParams
            };
            $rootScope.$broadcast('ccAuthorizationSuccess');
        });

        bbOmnibarConfig.userLoaded = function (data) {
            angular.element(document).ready(function () {
                $rootScope.$broadcast('omnibarUserLoaded', data);
            });
        };
    }

    ConfigOmnibar.$inject = [
        'bbOmnibarConfig'
    ];

    ConfigRoutes.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    ConfigSession.$inject = [
        'localStorageServiceProvider'
    ];

    Run.$inject = [
        '$rootScope',
        '$state',
        '$window',
        'AuthService',
        'bbOmnibarConfig',
        'MessageService'
    ];

    angular.module('capabilities-catalog', [
        'sky',
        'ui.router',
        'capabilities-catalog.templates',
        'LocalStorageModule',
        'ngSanitize'
    ])
        .config(ConfigOmnibar)
        .config(ConfigRoutes)
        .run(Run);

        // Disabling this feature until ng-sortable gets their crap together:
        // https://github.com/RubaXa/Sortable/issues/865
        // .config(['$compileProvider', function ($compileProvider) {
        //     $compileProvider.debugInfoEnabled(false);
        // }]);

}(window.angular));
