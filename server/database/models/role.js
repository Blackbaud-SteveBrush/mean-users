var mongoose,
    schema;

mongoose = require('mongoose');
schema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }]
});

module.exports = mongoose.model('Role', schema);
