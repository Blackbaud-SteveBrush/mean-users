var async,
    CrudRouter,
    express,
    passport,
    router,
    PermissionService,
    permissionsRouter,
    RoleService,
    rolesRouter,
    User,
    UserService,
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
router = express.Router();

require(__dirname + '/auth')(router);

router.get('/', function (req, res) {
    res.render('index', {
        title: 'Service Catalog',
        user: req.user
    });
});

// PERMISSIONS
permissionsRouter = new CrudRouter({
    resourceName: 'permissions',
    service: PermissionService,
    authorization: {
        get: {
            permission: 'GET_PERMISSION',
            message: "You don't have permission to view that permission."
        }
    }
});
permissionsRouter.attach(router);

// ROLES
rolesRouter = new CrudRouter({
    resourceName: 'roles',
    service: RoleService
});
rolesRouter.attach(router);



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

router.post('/api/users/:id/reset-password', function (req, res, next) {
    UserService.sendResetPasswordRequest(req.params.id).then(function (data) {
        utils.parseSuccess(res, data);
    }).catch(next);
});

router.route('/api/users/:id')
    .delete(function (req, res, next) {
        if (req.user._id.equals(req.params.id)) {
            throw new Error("You cannot delete yourself.");
        }
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
