var utils;

utils = require('../libs/utils');

function CrudRouter(options) {
    var checkPermissionMiddleware,
        defaults,
        k,
        merge,
        self;

    self = this;
    defaults = {
        authorization: {
            delete: {
                permission: null,
                message: "You do not have permission to delete that resource."
            },
            get: {
                permission: null,
                message: "You do not have permission to read that resource."
            },
            getAll: {
                permission: null,
                message: "You do not have permission to read those resources."
            },
            post: {
                permission: null,
                message: "You do not have permission to create that resource."
            },
            put: {
                permission: null,
                message: "You do not have permission to update that resource."
            }
        },
        resourceName: null,
        service: null
    };

    merge = require('merge');

    self.settings = merge.recursive({}, defaults, options);

    self.routes = {
        delete: [function (req, res, next) {
            self.settings.service.deleteById(req.params.id).then(function (data) {
                utils.parseSuccess(res, data);
            }).catch(next);
        }],
        get: [function (req, res, next) {
            self.settings.service.getById(req.params.id).then(function (data) {
                utils.parseSuccess(res, data);
            }).catch(next);
        }],
        getAll: [function (req, res, next) {
            self.settings.service.getAll().then(function (data) {
                utils.parseSuccess(res, data);
            }).catch(next);
        }],
        post: [function (req, res, next) {
            self.settings.service.create(req.body).then(function (data) {
                utils.parseSuccess(res, data);
            }).catch(next);
        }],
        put: [function (req, res, next) {
            self.settings.service.updateById(req.params.id, req.body).then(function (data) {
                utils.parseSuccess(res, data);
            }).catch(next);
        }]
    };

    // Add permission checks to the middleware arrays.
    checkPermissionMiddleware = function (req, res, next) {
        next(req.isAuthorized(self.settings.authorization[k].permission));
    };
    for (k in self.routes) {
        if (self.routes.hasOwnProperty(k)) {
            if (self.settings.authorization[k].permission) {
                console.log("+ Requiring permission `" + self.settings.authorization[k].permission + "` for route " + k + ".");
                self.routes[k].unshift(checkPermissionMiddleware);
            }
        }
    }

    self.attach = function (router) {
        router.route('/api/' + self.settings.resourceName)
            .get(self.routes.getAll)
            .post(self.routes.post);
        router.route('/api/' + self.settings.resourceName + '/:id')
            .delete(self.routes.delete)
            .get(self.routes.get)
            .put(self.routes.put);
    };
}

module.exports = CrudRouter;
