var async,
    express,
    passport,
    router,
    PermissionService,
    RoleService,
    User,
    UserService,
    utils;

async = require('async');
express = require('express');
passport = require('passport');
User = require('../database/models/user');
PermissionService = require('../database/services/permission');
RoleService = require('../database/services/role');
UserService = require('../database/services/user');
utils = require('../libs/utils');
router = express.Router();

require(__dirname + '/auth')(router);

router.get('/', function (req, res) {
    res.render('index', {
        title: 'Service Catalog',
        user: req.user
    });
});

router.post('/api/register', function (req, res, next) {
    RoleService.getDefault().then(function (defaultRole) {
        User.register(new User({
            emailAddress: req.body.emailAddress,
            roleId: req.body.roleId || defaultRole._id
        }), req.body.password, function (err, user) {
            if (err) {
                return next(err);
            }
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({
                    status: 'Registration successful!',
                    user: user
                });
            });
        });
    });
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

router.route('/api/permissions')
    .get(function (req, res, next) {
        PermissionService.getAll().then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    })
    .post(function (req, res, next) {
        PermissionService.create(req.body).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    });

router.route('/api/permissions/:id')
    .delete(function (req, res, next) {
        PermissionService.deleteById(req.params.id).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    })
    .get(function (req, res, next) {
        PermissionService.getById(req.params.id).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    })
    .put(function (req, res, next) {
        PermissionService.updateById(req.params.id, req.body).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    });

router.route('/api/roles')
    .get(function (req, res, next) {
        RoleService.getAll().then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    })
    .post(function (req, res, next) {
        RoleService.create(req.body).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    });

router.route('/api/roles/:id')
    .delete(function (req, res, next) {
        RoleService.deleteById(req.params.id).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    })
    .get(function (req, res, next) {
        RoleService.getById(req.params.id).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    })
    .put(function (req, res, next) {
        RoleService.updateById(req.params.id, req.body).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    });

router.route('/api/users')
    .get(
        function (req, res, next) {
            next(req.isAuthorized('GET_USERS'));
        },
        function (req, res, next) {
            UserService.getAll().then(function (data) {
                utils.parseSuccess(res, data);
            }).catch(next);
        }
    )
    .post(function (req, res, next) {
        UserService.create(req.body).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    });

router.route('/api/users/:id')
    .delete(function (req, res, next) {
        UserService.deleteById(req.params.id).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    })
    .get(function (req, res, next) {
        UserService.getById(req.params.id).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    })
    .put(function (req, res, next) {
        UserService.updateById(req.params.id, req.body).then(function (data) {
            utils.parseSuccess(res, data);
        }).catch(next);
    });

module.exports = router;
