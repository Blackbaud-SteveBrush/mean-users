/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 * https://github.com/vitalets/checklist-model
 * License: MIT http://opensource.org/licenses/MIT
 */

 /* commonjs package manager support (eg componentjs) */
 if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
   module.exports = 'checklist-model';
 }

angular.module('checklist-model', [])
.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
  // contains
  function contains(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          return true;
        }
      }
    }
    return false;
  }

  // add
  function add(arr, item, comparator) {
    arr = angular.isArray(arr) ? arr : [];
      if(!contains(arr, item, comparator)) {
          arr.push(item);
      }
    return arr;
  }

  // remove
  function remove(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          arr.splice(i, 1);
          break;
        }
      }
    }
    return arr;
  }

  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
     // exclude recursion, but still keep the model
    var checklistModel = attrs.checklistModel;
    attrs.$set("checklistModel", null);
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);
    attrs.$set("checklistModel", checklistModel);

    // getter for original model
    var checklistModelGetter = $parse(checklistModel);
    var checklistChange = $parse(attrs.checklistChange);
    var checklistBeforeChange = $parse(attrs.checklistBeforeChange);
    var ngModelGetter = $parse(attrs.ngModel);



    var comparator = angular.equals;

    if (attrs.hasOwnProperty('checklistComparator')){
      if (attrs.checklistComparator[0] == '.') {
        var comparatorExpression = attrs.checklistComparator.substring(1);
        comparator = function (a, b) {
          return a[comparatorExpression] === b[comparatorExpression];
        };

      } else {
        comparator = $parse(attrs.checklistComparator)(scope.$parent);
      }
    }

    // watch UI checked change
    var unbindModel = scope.$watch(attrs.ngModel, function(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }

      if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
        ngModelGetter.assign(scope, contains(checklistModelGetter(scope.$parent), getChecklistValue(), comparator));
        return;
      }

      setValueInChecklistModel(getChecklistValue(), newValue);

      if (checklistChange) {
        checklistChange(scope);
      }
    });

    // watches for value change of checklistValue
    var unbindCheckListValue = scope.$watch(getChecklistValue, function(newValue, oldValue) {
      if( newValue != oldValue && angular.isDefined(oldValue) && scope[attrs.ngModel] === true ) {
        var current = checklistModelGetter(scope.$parent);
        checklistModelGetter.assign(scope.$parent, remove(current, oldValue, comparator));
        checklistModelGetter.assign(scope.$parent, add(current, newValue, comparator));
      }
    }, true);

    var unbindDestroy = scope.$on('$destroy', destroy);

    function destroy() {
      unbindModel();
      unbindCheckListValue();
      unbindDestroy();
    }

    function getChecklistValue() {
      return attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;
    }

    function setValueInChecklistModel(value, checked) {
      var current = checklistModelGetter(scope.$parent);
      if (angular.isFunction(checklistModelGetter.assign)) {
        if (checked === true) {
          checklistModelGetter.assign(scope.$parent, add(current, value, comparator));
        } else {
          checklistModelGetter.assign(scope.$parent, remove(current, value, comparator));
        }
      }

    }

    // declare one function to be used for both $watch functions
    function setChecked(newArr, oldArr) {
      if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
        setValueInChecklistModel(getChecklistValue(), ngModelGetter(scope));
        return;
      }
      ngModelGetter.assign(scope, contains(newArr, getChecklistValue(), comparator));
    }

    // watch original model change
    // use the faster $watchCollection method if it's available
    if (angular.isFunction(scope.$parent.$watchCollection)) {
        scope.$parent.$watchCollection(checklistModel, setChecked);
    } else {
        scope.$parent.$watch(checklistModel, setChecked, true);
    }
  }

  return {
    restrict: 'A',
    priority: 1000,
    terminal: true,
    scope: true,
    compile: function(tElement, tAttrs) {

      if (!tAttrs.checklistValue && !tAttrs.value) {
        throw 'You should provide `value` or `checklist-value`.';
      }

      // by default ngModel is 'checked', so we set it if not specified
      if (!tAttrs.ngModel) {
        // local scope var storing individual checkbox model
        tAttrs.$set("ngModel", "checked");
      }

      return postLinkFn;
    }
  };
}]);

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
        controller: 'AdminUsersController as usersCtrl'
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

(function (angular) {
  'use strict';

  function RoleService($http) {
    var service;
    service = this;
    service.getAll = function () {
      return $http.get('/api/roles/').then(function (res) {
        return res.data;
      });
    };
    service.create = function (data) {
      return $http.post('/api/roles/', data).then(function (res) {
        return res.data;
      });
    };
    service.deleteById = function (id) {
      return $http.delete('/api/roles/' + id).then(function (res) {
        return res.data;
      });
    };
    service.updateById = function (id, data) {
      return $http.put('/api/roles/' + id, data).then(function (res) {
        return res.data;
      });
    };
  }

  RoleService.$inject = [
    '$http'
  ];
  angular.module('mean-users')
    .service('RoleService', RoleService);
}(window.angular));

(function (angular) {
  'use strict';

  function PermissionsController(PermissionService) {
    var vm;

    vm = this;
    vm.formData = {};

    PermissionService.getAll().then(function (data) {
      vm.permissions = data.value;
    });

    vm.submit = function () {
      PermissionService.create(vm.formData).then(function (data) {
        vm.permissions.unshift(data);
        vm.formData = {};
      });
    };

    vm.delete = function (index) {
      PermissionService.deleteById(vm.permissions[index]._id).then(function () {
        vm.permissions.splice(index, 1);
      });
    };

    vm.update = function (permission) {
      delete permission.showEditor;
      PermissionService.updateById(permission._id, permission).then(function (data) {
        permission = data;
      });
    };
  }

  PermissionsController.$inject = ['PermissionService'];
  angular.module('mean-users')
    .controller('PermissionsController', PermissionsController);
}(window.angular));

(function (angular) {
  'use strict';

  function RolesController(PermissionService, RoleService) {
    var vm;

    vm = this;
    vm.formData = {};

    PermissionService.getAll().then(function (data) {
      vm.permissions = data.value;
      RoleService.getAll().then(function (data) {
        vm.roles = data.value;
      });
    });

    vm.submit = function () {
      RoleService.create(vm.formData).then(function (data) {
        vm.roles.unshift(data);
        vm.formData = {};
      });
    };

    vm.delete = function (index) {
      RoleService.deleteById(vm.roles[index]._id).then(function () {
        vm.roles.splice(index, 1);
      });
    };

    vm.update = function (role) {
      delete role.showEditor;
      RoleService.updateById(role._id, role).then(function (data) {
        role = data;
      });
    };

    vm.toggleSelection = function (permissionId) {
      vm.roles.forEach(function (role) {
        var index = role.permissions.indexOf(permissionId);
        if (index > -1) {
          role.permissions.splice(index, 1);
        } else {
          role.permissions.push(permissionId);
        }
      });
    };
  }

  RolesController.$inject = [
    'PermissionService',
    'RoleService'
  ];
  angular.module('mean-users')
    .controller('RolesController', RolesController);
}(window.angular));

(function (angular) {
  'use strict';

  function AdminUsersController() {}

  angular.module('mean-users')
    .controller('AdminUsersController', AdminUsersController);
}(window.angular));

(function (angular) {
  'use strict';

  function HomeController() {}

  angular.module('mean-users')
    .controller('HomeController', HomeController);
}(window.angular));

(function (angular) {
  'use strict';

  function LoginController($state, $window, AuthService) {
    var vm;

    vm = this;
    vm.formData = {};

    this.submit = function () {
      vm.disabled = true;
      AuthService
        .login(vm.formData.emailAddress, vm.formData.password)
        .then(function () {
          $state.go('home');
          $window.location.reload();
          vm.disabled = false;
        })
        .catch(function (err) {
          alert("ERROR!", err);
          vm.disabled = false;
        });
    };
  }

  LoginController.$inject = ['$state', '$window', 'AuthService'];
  angular.module('mean-users')
    .controller('LoginController', LoginController);
}(window.angular));

(function (angular) {
  'use strict';

  function ProfileController() {}

  angular.module('mean-users')
    .controller('ProfileController', ProfileController);
}(window.angular));

(function (angular) {
  'use strict';

  function RegisterController($state, AuthService) {
    var vm;

    vm = this;
    vm.formData = {};

    vm.submit = function () {
      vm.disabled = true;
      AuthService
        .register(vm.formData)
        .then(function () {
          $state.go('login');
          vm.disabled = false;
        })
        .catch(function () {
          alert("Error!");
          vm.formData = {};
          vm.disabled = false;
        });
    };
  }

  RegisterController.$inject = [
    '$state',
    'AuthService'
  ];

  angular.module('mean-users')
    .controller('RegisterController', RegisterController);
}(window.angular));

angular.module('mean-users.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('../public/app/views/admin/permissions.html',
        '<h1>Permissions</h1><table class="table table-striped"><tr><td><form class="form form-inline" ng-submit=permissionsCtrl.submit()><div class=form-group><input class=form-control id=field-permission placeholder=MY_PERMISSION ng-model=permissionsCtrl.formData.name> <button type=submit class="btn btn-default">Create</button></div></form></td><td></td></tr><tr ng-repeat="permission in permissionsCtrl.permissions"><td><form ng-if=permission.showEditor ng-submit=permissionsCtrl.update(permission)><input ng-model=permission.name class=form-control> <button type=submit class="btn btn-default btn-xs">Update</button> <button type=button class="btn btn-default btn-xs" ng-click="role.showEditor=false">Cancel</button></form><span ng-if=!permission.showEditor ng-click="permission.showEditor=true" ng-bind=permission.name></span></td><td ng-bind=permission._id></td><td><button class="btn btn-xs btn-default" ng-click=permissionsCtrl.delete($index)>Delete</button></td></tr></table>');
    $templateCache.put('../public/app/views/admin/roles.html',
        '<h1>Roles</h1><table class="table table-striped"><tr><td><form class="form form-inline" ng-submit=rolesCtrl.submit()><div class=form-group><input class=form-control id=field-role placeholder="e.g. admin" ng-model=rolesCtrl.formData.name> <button type=submit class="btn btn-default">Create</button></div></form></td><td></td><td></td></tr><tr><th>Name</th><th>Permissions</th><th></th></tr><tr ng-repeat="role in rolesCtrl.roles"><td><form ng-if=role.showEditor ng-submit=rolesCtrl.update(role)><div class=form-group><input ng-model=role.name class=form-control></div><button type=submit class="btn btn-primary btn-xs">Update</button> <button type=button class="btn btn-default btn-xs" ng-click="role.showEditor=false">Cancel</button></form><span ng-if=!role.showEditor ng-click="role.showEditor=true" ng-bind=role.name></span></td><td><form ng-submit=rolesCtrl.update(role)><div class=checkbox ng-repeat="permission in rolesCtrl.permissions"><label><input type=checkbox ng-checked="role.permissions.indexOf(permission._id) > -1" ng-click=rolesCtrl.toggleSelection(permission._id)><span ng-bind=permission.name></span></label></div><div class=form-group><button type=submit class="btn btn-xs btn-default">Update</button></div></form></td><td><button class="btn btn-xs btn-default" ng-click=rolesCtrl.delete($index)>Delete</button></td></tr></table>');
    $templateCache.put('../public/app/views/admin/users.html',
        'Users');
    $templateCache.put('../public/app/views/home.html',
        'Home');
    $templateCache.put('../public/app/views/login.html',
        '<h1>Log in</h1><form class=form ng-submit=loginCtrl.submit()><div class=form-group><label for=field-email-address>Email address</label><input type=email class=form-control id=field-email-address ng-model=loginCtrl.formData.emailAddress></div><div class=form-group><label for=field-password>Password</label><input type=password class=form-control id=field-password ng-model=loginCtrl.formData.password></div><div class=form-group><button type=submit class="btn btn-primary" ng-disabled=loginCtrl.disabled>Log in</button></div></form>');
    $templateCache.put('../public/app/views/profile.html',
        'Profile');
    $templateCache.put('../public/app/views/register.html',
        '<h1>Register</h1><form class=form ng-submit=registerCtrl.submit()><div class=form-group><label for=field-email-address>Email address</label><input type=email class=form-control id=field-email-address ng-model=registerCtrl.formData.emailAddress></div><div class=form-group><label for=field-password>Password</label><input type=password class=form-control id=field-password ng-model=registerCtrl.formData.password></div><div class=form-group><button type=submit class="btn btn-primary" ng-disabled=registerCtrl.disabled>Register</button></div></form>');
}]);

//# sourceMappingURL=app.js.map