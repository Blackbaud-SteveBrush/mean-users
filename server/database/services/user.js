var DatabaseObject,
    utils;

DatabaseObject = require('../classes/database-object');
utils = require('../../libs/utils');

function Service(options) {
    DatabaseObject.call(this, options);
}

utils.mixin(Service, DatabaseObject);

module.exports = new Service({
    model: require('../models/user')
});
