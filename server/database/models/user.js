var mongoose,
    schema;

mongoose = require('mongoose');
schema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }
});

schema.plugin(require('passport-local-mongoose'), {
  usernameField: 'emailAddress'
});

module.exports = mongoose.model('User', schema);
