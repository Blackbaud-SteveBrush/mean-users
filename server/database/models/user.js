var mongoose,
    schema;

mongoose = require('mongoose');
schema = new mongoose.Schema({
    _role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    resetPasswordToken: String
});

schema.plugin(require('passport-local-mongoose'), {
    usernameField: 'emailAddress',
    usernameQueryFields: ['emailAddress']
});

module.exports = mongoose.model('User', schema);
