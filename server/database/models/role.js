var mongoose;
mongoose = require('mongoose');
module.exports = mongoose.model('Role', new mongoose.Schema({
    isDefault: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    _permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        unique: true
    }]
}));
