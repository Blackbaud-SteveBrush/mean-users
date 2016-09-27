var PermissionService,
    RoleService;

PermissionService = require('../database/services/permission');
RoleService = require('../database/services/role');

module.exports = function (router) {

    // Add role and permissions to the request.
    router.use(function (req, res, next) {
        req.role = null;
        req.permissions = [];
        if (!req.isAuthenticated()) {
            return next();
        }
        RoleService.getById(req.user.roleId).then(function (role) {
            var permissionNames = [];
            if (!role) {
                return next();
            }
            req.role = role.name;
            PermissionService.getByIds(role.permissions).then(function (permissions) {
                permissions.forEach(function (permission) {
                    permissionNames.push(permission.name);
                });
                req.permissions = permissionNames;
                next();
            }).catch(next);
        }).catch(next);
    });

    // Add a method to the request to check permissions.
    router.use(function (req, res, next) {
        req.isAuthorized = function (permission) {
            var err;
            if (!req.isAuthenticated() || !req.permissions || req.permissions.indexOf(permission) === -1) {
                err = new Error("Not Authorized");
                err.status = 401;
                return err;
            }
            return null;
        };
        next();
    });
};
