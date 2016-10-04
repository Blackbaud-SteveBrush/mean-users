var DatabaseObject,
    randomstring,
    sha1,
    utils;

DatabaseObject = require('../classes/database-object');
randomstring = require('randomstring');
utils = require('../../libs/utils');
sha1 = require('sha1');

function Service(options) {
    DatabaseObject.call(this, options);
}

utils.mixin(Service, DatabaseObject);

Service.prototype.getAll = function () {
    return this.settings.model.find({}).populate('_role').exec();
};

Service.prototype.getByEmailAddress = function (emailAddress) {
    return this.settings.model.findOne({
        'emailAddress': emailAddress
    }).exec().then(function (user) {
        if (!user) {
            return Promise.reject(new Error("User not found with email address, " + emailAddress));
        }
        return Promise.resolve(user);
    });
};

Service.prototype.getRandomPassword = function () {
    return randomstring.generate(4) + ' ' + randomstring.generate(4) + ' ' + randomstring.generate(4);
};

Service.prototype.create = function (data) {
    if (!data.password) {
        data.password = this.getRandomPassword();
    }
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

Service.prototype.sendResetPasswordRequest = function (emailAddress) {
    var self;

    self = this;

    return self.getByEmailAddress(emailAddress)
        .then(function (user) {
            if (!user) {
                return Promise.reject(new Error("That email address wasn't found in our records."));
            }
            user.password = self.getRandomPassword();
            user.resetPasswordToken = sha1(emailAddress + ':' + user.password + Date.now());
            return user.save();
        });
};

module.exports = new Service({
    model: require('../models/user')
});
