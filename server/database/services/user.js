var DatabaseObject,
    utils;

DatabaseObject = require('../classes/database-object');
utils = require('../../libs/utils');

function Service(options) {
    DatabaseObject.call(this, options);
}

utils.mixin(Service, DatabaseObject);

Service.prototype.getAll = function () {
    return this.settings.model.find({}).populate('_role').exec();
};

Service.prototype.create = function (data) {
    return this.register(data.emailAddress, data.password, data._role);
};

Service.prototype.register = function (emailAddress, password, roleId) {
    var RoleService,
        self;

    self = this;
    RoleService = require(__dirname + '/role');

    function createUserWithRole(roleId) {
        return new Promise(function (resolve, reject) {
            self.settings.model.register(new self.settings.model({
                emailAddress: emailAddress,
                _role: roleId
            }), password, function (err, user) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(user);
            });
        });
    }

    if (!emailAddress) {
        return Promise.reject(new Error("Please provide a valid email address."));
    }

    if (!password) {
        return Promise.reject(new Error("Please provide a valid password."));
    }

    if (roleId) {
        return createUserWithRole(roleId);
    } else {
        return RoleService.getDefault().then(function (role) {
            return createUserWithRole(role._id);
        });
    }
};

module.exports = new Service({
    model: require('../models/user')
});
