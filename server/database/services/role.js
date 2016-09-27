var DatabaseObject,
    PermissionService;

DatabaseObject = require('../classes/database-object');
PermissionService = require(__dirname + '/permission');

module.exports = new DatabaseObject({
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
