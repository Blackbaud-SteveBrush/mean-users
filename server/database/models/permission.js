var mongoose;

mongoose = require('mongoose');

module.exports = mongoose.model('Permission', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    }
}));
