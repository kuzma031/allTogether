const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const detailsSchema = {
    logo: {
        type: String
    }
};

module.exports = mongoose.model('Details', detailsSchema);