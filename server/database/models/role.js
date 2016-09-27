var mongoose;
mongoose = require('mongoose');
module.exports = mongoose.model('Role', new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
    unique: true
  }]
}));
