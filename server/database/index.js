var databaseUri,
    environment,
    mongoose;

environment = process.env.NODE_ENV || 'development';
mongoose = require('mongoose');

if (process.env.DATABASE_URI) {
    databaseUri = process.env.DATABASE_URI;
} else {
    if (environment === 'production') {
        databaseUri = 'mongodb://localhost:27017/capabilities-catalog';
    } else {
        databaseUri = 'mongodb://localhost:27017/capabilities-catalog-test';
    }
}

mongoose.Promise = global.Promise;

module.exports = {
    connect: function (callback) {
        mongoose.connect(databaseUri, function () {
            if (typeof callback === 'function') {
                callback.call({}, databaseUri);
            }
        });
    }
};
