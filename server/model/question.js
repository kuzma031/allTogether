const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = {
    content: {
        type: String,
        required: true    
    },
    answerTime: {
        type: Number,
        required: true
    }
};

module.exports = mongoose.model('Question', questionSchema);