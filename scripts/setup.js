var async,
    database,
    environment,
    isWin;

require(__dirname + '/environment');

async = require('async');
database = require('../server/database');
environment = process.env.NODE_ENV || 'development';
isWin = (process.platform === 'win32');

function resetUsersFromEnv(callback) {
    var admins,
        adminPassword,
        doResetUsers,
        editors,
        editorPassword,
        editorPermissions,
        permissionIds,
        permissions,
        PermissionService,
        RoleService,
        UserService;

    UserService = require('../server/database/services/user');
    RoleService = require('../server/database/services/role');
    PermissionService = require('../server/database/services/permission');

    doResetUsers = (process.env.RESET_USERS_ON_SETUP === true || process.env.RESET_USERS_ON_SETUP === 'true');
    permissions = process.env.SITE_PERMISSIONS;

    admins = process.env.SITE_ADMINISTRATORS;
    adminPassword = process.env.SITE_ADMINISTRATORS_PASSWORD;

    editors = process.env.SITE_EDITORS;
    editorPassword = process.env.SITE_EDITORS_PASSWORD;
    editorPermissions = (process.env.SITE_EDITORS_PERMISSIONS) ? process.env.SITE_EDITORS_PERMISSIONS.split(',') : [];

    permissionIds = {
        'editor': [],
        'admin': []
    };

    if (doResetUsers === false) {
        callback.call();
        return;
    }

    console.log("Resetting users to defaults...");

    if (!admins || !adminPassword || !permissions) {
        console.log("Aborting. Please provide SITE_ADMINISTRATORS, SITE_ADMINISTRATORS_PASSWORD, and SITE_PERMISSIONS in this script's environment.");
        callback.call();
        return;
    }

    // Delete all roles.
    console.log("Deleting roles...");
    RoleService.deleteAll()

        // Delete all permissions.
        .then(function () {
            console.log("Deleting permissions...");
            return PermissionService.deleteAll();
        })

        // Delete all users.
        .then(function () {
            console.log("Deleting users...");
            return UserService.deleteAll();
        })

        // Create all permissions
        .then(function () {
            console.log("Creating default permissions...");
            return new Promise(function (resolve, reject) {
                async.eachSeries(
                    permissions.split(','),
                    function each(permission, next) {
                        PermissionService.create({
                            name: permission
                        }).then(function (data) {
                            if (editorPermissions.indexOf(data.name) > -1) {
                                permissionIds.editor.push(data._id);
                            }
                            permissionIds.admin.push(data._id);
                            console.log("Permission created: " + data.name);
                            next();
                        }).catch(next);
                    },
                    function done(error) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve();
                    }
                );
            });
        })

        // Create the admin role.
        .then(function () {
            console.log("Creating admin role...");
            return RoleService.create({
                name: 'admin',
                _permissions: permissionIds.admin
            });
        })

        // Create admin users.
        .then(function (adminRole) {
            console.log("Creating admin accounts...");
            return new Promise(function (resolve, reject) {
                async.eachSeries(
                    admins.split(','),
                    function each(emailAddress, next) {
                        UserService.register(emailAddress, adminPassword, adminRole._id).then(function () {
                            console.log("Created admin user for " + emailAddress);
                            next();
                        }).catch(next);
                    },
                    function done(error) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve();
                    }
                );
            });
        })

        // Create the editor role.
        .then(function () {
            console.log("Creating editor role...");
            return RoleService.create({
                name: 'editor',
                _permissions: permissionIds.editor,
                isDefault: true
            });
        })

        // Create editor users.
        .then(function (editorRole) {
            console.log("Creating editor accounts...");
            return new Promise(function (resolve, reject) {
                if (!editors) {
                    console.log("SITE_EDITORS not defined.");
                    return resolve();
                }
                async.eachSeries(
                    editors.split(','),
                    function each(emailAddress, next) {
                        UserService.register(emailAddress, editorPassword, editorRole._id).then(function () {
                            console.log("Created editor user for " + emailAddress);
                            next();
                        }).catch(next);
                    },
                    function done(error) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve();
                    }
                );
            });
        })

        // All done!
        .then(callback)
        .catch(function (error) {
            console.log("ERROR with resetUsersFromEnv:", error);
            process.exit();
        });
}

console.log('Setting up ' + environment + ' environment...');
database.connect(function (uri) {
    console.log('Database connected to ' + uri);
    if (environment === 'production') {
        process.exit();
    } else {
        resetUsersFromEnv(function () {
            console.log("Setup complete!");
            process.exit();
        });
    }
});
