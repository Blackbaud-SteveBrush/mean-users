var async,
    CrudRouter,
    express,
    mailer,
    passport,
    PermissionService,
    permissionRouter,
    RoleService,
    roleRouter,
    router,
    User,
    UserService,
    userRouter,
    utils;

async = require('async');
express = require('express');
passport = require('passport');
User = require('../database/models/user');
CrudRouter = require('../classes/crud-router');
PermissionService = require('../database/services/permission');
RoleService = require('../database/services/role');
UserService = require('../database/services/user');
utils = require('../libs/utils');
mailer = require('../libs/mailer');
router = express.Router();

require(__dirname + '/auth')(router);

router.get('/', function (req, res) {
    res.render('index', {
        title: 'Service Catalog',
        user: req.user
    });
});

// PERMISSIONS
permissionRouter = new CrudRouter({
    resourceName: 'permissions',
    service: PermissionService,
    authorization: {
        post: {
            permission: 'CREATE_PERMISSION'
        },
        delete: {
            permission: 'DELETE_PERMISSION'
        },
        put: {
            permission: 'EDIT_PERMISSION'
        }
    }
});
permissionRouter.attach(router);

// ROLES
roleRouter = new CrudRouter({
    resourceName: 'roles',
    service: RoleService,
    authorization: {
        post: {
            permission: 'CREATE_ROLE'
        },
        delete: {
            permission: 'DELETE_ROLE'
        },
        put: {
            permission: 'EDIT_ROLE'
        }
    }
});
roleRouter.attach(router);


// USERS
userRouter = new CrudRouter({
    resourceName: 'users',
    service: UserService,
    authorization: {
        post: {
            permission: 'CREATE_USER'
        },
        delete: {
            permission: 'DELETE_USER'
        },
        put: {
            permission: 'EDIT_USER'
        }
    }
});
userRouter.delete([
    function (req, res, next) {
        if (req.user._id.equals(req.params.id)) {
            throw new Error("You cannot delete yourself.");
        }
        userRouter.settings.service
            .deleteById(req.params.id)
            .then(function (data) {
                utils.parseSuccess(res, data);
            })
            .catch(next);
    }
]);
userRouter.attach(router);

router.route('/api/users/role/:name')
    .get(
        function (req, res, next) {
            UserService
                .getAllByRole(req.params.name)
                .then(function (data) {
                    utils.parseSuccess(res, data);
                })
                .catch(next);
        }
    );

router.route('/api/users/reset-password-request')
    .post(function (req, res, next) {
        UserService
            .createResetPasswordToken(req.body.emailAddress)
            .then(function (user) {
                mailer
                    .sendEmail({
                        to: user.emailAddress,
                        inject: {
                            url: req.headers.referrer + '#/reset-password/' + user.resetPasswordToken
                        },
                        body: '<p>You are receiving this email because someone requested that your password be reset. If you did not request this action, please reach out to a Service Catalog administrator.</p><p><a href="{{url}}">Reset your password&nbsp;&rarr;</a></p>',
                        subject: 'Service Catalog > Reset Password Request'
                    })
                    .then(function () {
                        utils.parseSuccess(res, {});
                    });
            })
            .catch(next);
    });

router.route('/api/users/reset-password/:token')
    .post(function (req, res, next) {
        UserService
            .getByResetPasswordToken(req.params.token)
            .then(function (user) {
                delete user.resetPasswordToken;
                user.setPassword(req.body.password, function (error) {
                    if (error) {
                        next(error);
                        return;
                    }
                    user
                        .save()
                        .then(function () {
                            utils.parseSuccess(res);
                        })
                        .catch(next);
                });
            })
            .catch(next);
    });


module.exports = router;
