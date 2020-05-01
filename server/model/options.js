const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const optionsSchema = {
    logo: {
        type: String
    },
    startMessage: {
        heading: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    endMessage: {
        heading: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    }
};

module.exports = mongoose.model('Options', optionsSchema);