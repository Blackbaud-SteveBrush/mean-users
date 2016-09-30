var PermissionService,
    passport,
    RoleService,
    UserService;

PermissionService = require('../database/services/permission');
RoleService = require('../database/services/role');
UserService = require('../database/services/user');
passport = require('passport');

module.exports = function (router) {

    // Add role and permissions to the request.
    router.use(function (req, res, next) {
        req.role = null;
        req.permissions = [];

        if (!req.isAuthenticated()) {
            return next();
        }

        RoleService.getById(req.user._role).then(function (role) {
            if (!role) {
                return next();
            }

            req.role = role.name;

            PermissionService.getByIds(role._permissions).then(function (permissions) {
                req.permissions = permissions.map(function (permission) {
                    return permission.name;
                });
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
        UserService
            .register(req.body.emailAddress, req.body.password, req.body.roleId)
            .then(function (user) {
                passport.authenticate('local')(req, res, function () {
                    return res.status(200).json({
                        status: 'Registration successful!',
                        user: user
                    });
                });
            })
            .catch(next);
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
                _id: req.user._id,
                emailAddress: req.user.emailAddress,
                permissions: req.permissions,
                role: req.role
            }
        });
    });
};
