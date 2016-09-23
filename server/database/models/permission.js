var mongoose,
    schema;

mongoose = require('mongoose');
schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    uppercase: true,
    unique: true
  }
});

module.exports = mongoose.model('Permission', schema);
