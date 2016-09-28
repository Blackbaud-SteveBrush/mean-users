var PermissionService,
    passport,
    RoleService,
    User;

PermissionService = require('../database/services/permission');
RoleService = require('../database/services/role');
User = require('../database/models/user');
passport = require('passport');

function AuthService() {
    var service;

    service = {};

    service.register = function (emailAddress, password, roleId) {

        console.log("Creating account for:", emailAddress, password, roleId);

        function createUserWithRole(roleId) {
            return new Promise(function (resolve, reject) {
                User.register(new User({
                    emailAddress: emailAddress,
                    _role: roleId
                }), password, function (err, user) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(user);
                });
            });
        }

        if (roleId) {
            return createUserWithRole(roleId);
        } else {
            return RoleService.getDefault().then(function (role) {
                return createUserWithRole(role._id);
            });
        }
    };

    service.addRoutes = function (router) {

        // Add role and permissions to the request.
        router.use(function (req, res, next) {
            req.role = null;
            req.permissions = [];

            if (!req.isAuthenticated()) {
                return next();
            }

            RoleService.getById(req.user._role).then(function (role) {
                var permissionNames = [];

                if (!role) {
                    return next();
                }

                req.role = role.name;

                PermissionService.getByIds(role._permissions).then(function (permissions) {
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

        router.post('/api/register', function (req, res, next) {
            service.register(req.body.emailAddress, req.body.password, req.body.roleId).then(function (user) {
                passport.authenticate('local')(req, res, function () {
                    return res.status(200).json({
                        status: 'Registration successful!',
                        user: user
                    });
                });
            }).catch(function (error) {
                next(error);
            });

            // RoleService.getDefault().then(function (defaultRole) {
            //     User.register(new User({
            //         emailAddress: req.body.emailAddress,
            //         roleId: req.body.roleId || defaultRole._id
            //     }), req.body.password, function (err, user) {
            //         if (err) {
            //             return next(err);
            //         }
            //         passport.authenticate('local')(req, res, function () {
            //             return res.status(200).json({
            //                 status: 'Registration successful!',
            //                 user: user
            //             });
            //         });
            //     });
            // });
        });

        router.post('/api/login', function (req, res, next) {
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(info);
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return next('Could not log in user!');
                    }
                    res.status(200).json({
                        message: 'Login successful!'
                    });
                });
            })(req, res, next);
        });

        router.get('/api/logout', function (req, res) {
            req.logout();
            res.status(200).json({
                status: 'Bye!'
            });
        });

        router.get('/api/user-status', function (req, res) {
            if (!req.isAuthenticated()) {
                return res.status(200).json({
                    status: false,
                    user: null
                });
            }
            res.status(200).json({
                status: true,
                user: {
                    permissions: req.permissions,
                    role: req.role
                }
            });
        });
    };

    return service;
}

module.exports = new AuthService();
