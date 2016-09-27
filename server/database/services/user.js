var DatabaseObject;
DatabaseObject = require('../classes/database-object');
module.exports = new DatabaseObject({
    model: require('../models/user')
});
