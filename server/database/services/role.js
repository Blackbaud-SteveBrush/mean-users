var DatabaseObject,
    PermissionService,
    service;

DatabaseObject = require('../classes/database-object');
PermissionService = require(__dirname + '/permission');
service = new DatabaseObject({
    model: require('../models/role'),
    onBeforeUpdate: function (data) {
        var foundIds;
        foundIds = [];
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
});

service.getDefault = function () {
    return service.model.findOne({
        'isDefault': true
    }).exec();
};

module.exports = service;
