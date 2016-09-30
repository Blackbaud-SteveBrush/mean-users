var DatabaseObject,
    utils;

DatabaseObject = require('../classes/database-object');
utils = require('../../libs/utils');

function Service(options) {
    DatabaseObject.call(this, options);
}

Service.prototype.getDefault = function () {
    return this.settings.model.findOne({
        'isDefault': true
    }).exec();
};

Service.prototype.getByName = function (name) {
    return this.settings.model.findOne({
        'name': name
    }).exec().then(function (error, doc) {
        if (error) {
            return Promise.reject(error);
        }
        if (!doc) {
            return Promise.reject("Role not found named '" + name + "'!");
        }
    });
};

Service.prototype.hooks = {
    onBeforeUpdate: function (data) {
        var foundIds,
            PermissionService;

        foundIds = [];
        PermissionService = require(__dirname + '/permission');

        // Make sure existing permissions are valid before update.
        return PermissionService.getAll().then(function (permissions) {
            permissions.forEach(function (permission) {
                data.permissions.forEach(function (permissionId) {
                    if (permission._id.equals(permissionId)) {
                        foundIds.push(permissionId);
                    }
                });
            });
            data.permissions = foundIds;
        });
    }
};

utils.mixin(Service, DatabaseObject);

module.exports = new Service({
    model: require('../models/role')
});
