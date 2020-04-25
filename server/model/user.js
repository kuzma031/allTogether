const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = {
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    passwordResetToken: String
};

module.exports = mongoose.model('Users', userSchema);