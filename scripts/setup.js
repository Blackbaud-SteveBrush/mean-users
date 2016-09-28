var async,
    database,
    environment,
    isWin;

require(__dirname + '/environment');

async = require('async');
database = require('../server/database');
environment = process.env.NODE_ENV || 'development';
isWin = (process.platform === 'win32');

database.connect(function (uri) {
    console.log('Database connected to ' + uri);
});

function resetUsersFromEnv(callback) {
    var admins,
        adminsPassword,
        adminPermissionIds,
        adminsPermissions,
        AuthService,
        doResetUsers,
        editors,
        editorsPassword,
        editorPermissionIds,
        editorsPermissions,
        permissions,
        PermissionService,
        RoleService,
        UserService;

    AuthService = require('../server/middleware/auth');
    UserService = require('../server/database/services/user');
    RoleService = require('../server/database/services/role');
    PermissionService = require('../server/database/services/permission');

    doResetUsers = (process.env.RESET_USERS_ON_SETUP === true || process.env.RESET_USERS_ON_SETUP === 'true');

    admins = process.env.SITE_ADMINISTRATORS;
    adminsPassword = process.env.SITE_ADMINISTRATORS_PASSWORD;
    adminsPermissions = process.env.SITE_ADMINISTRATORS_PERMISSIONS;

    editors = process.env.SITE_EDITORS;
    editorsPassword = process.env.SITE_EDITORS_PASSWORD;
    editorsPermissions = process.env.SITE_EDITORS_PERMISSIONS;
    permissions = process.env.SITE_PERMISSIONS;

    adminPermissionIds = [];
    editorPermissionIds = [];


    if (doResetUsers === false) {
        callback.call();
        return;
    }

    console.log("Resetting users to defaults...");

    if (!admins || !adminsPassword || !permissions) {
        console.log("Aborting. Please provide SITE_ADMINISTRATORS, SITE_ADMINISTRATORS_PASSWORD, and SITE_PERMISSIONS in this script's environment.");
        callback.call();
        return;
    }

    // Delete all roles.
    RoleService.deleteAll()

        // Delete all permissions.
        .then(function () {
            return PermissionService.deleteAll();
        })

        // Delete all users.
        .then(function () {
            return UserService.deleteAll();
        })

        // Create all permissions
        .then(function () {
            return new Promise(function (resolve, reject) {
                var permissionIds = [];
                async.eachSeries(
                    permissions.split(','),
                    function each(permission, next) {
                        PermissionService.create({
                            name: permission
                        }).then(function (data) {
                            permissionIds.push(data._id);
                            next();
                        }).catch(next);
                    },
                    function done(error) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(permissionIds);
                    }
                );
            });
        })

        // Create the admin role.
        .then(function (permissionIds) {
            return RoleService.create({
                name: 'admin',
                _permissions: permissionIds
            });
        })

        // Create admin users.
        .then(function (adminRole) {
            var emailAddresses;
            emailAddresses = admins.split(',');

            console.log("Creating admin accounts...");

            async.eachSeries(emailAddresses, function each(emailAddress, next) {
                console.log("Creating admin user for " + emailAddress);
                AuthService.register(emailAddress, adminsPassword, adminRole._id).then(function (data) {
                    console.log("AuthService success:", data);
                    UserService.getAll().then(function (data) {
                        console.log("USERS", data);
                        next();
                    });

                }).catch(next);
            }, function done(error) {
                if (error) {
                    console.log(error);
                }
                callback.call();
            });
        });




    //     // Create the admin and editor roles
    //     return Promise.all([
    //         RoleService.create({
    //             name: 'admin',
    //             permissions: []
    //         }),
    //         RoleService.create({
    //             name: 'editor',
    //             isDefault: true,
    //             permissions: []
    //         })
    //     ]);
    // }).then(function () {
    //     return UserService.deleteAll();
    // }).then(function () {
    //     var emailAddresses;
    //
    //     emailAddresses = admins.split(',');
    //
    //     console.log("All users removed from database.");
    //     console.log("Creating admin accounts...");
    //
    //     async.eachSeries(emailAddresses, function each(emailAddress, next) {
    //         console.log("Creating admin user for " + emailAddress);
    //         AuthService.register(emailAddress, adminsPassword, 'admin').then(function (data) {
    //             console.log("AuthService success:", data);
    //             next();
    //         }).catch(next);
    //     }, function done(error) {
    //         if (error) {
    //             console.log(error);
    //         }
    //         callback.call();
    //     });
    // });
}

console.log('Setting up ' + environment + ' environment...');
if (environment === 'production') {
    process.exit();
} else {
    resetUsersFromEnv(function () {
        console.log("Setup complete!");
        process.exit();
    });
}
