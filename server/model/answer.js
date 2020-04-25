const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = {
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    questionId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Question'
    },
    mediaUrl: {
        type: String,
        required: true
    }
}

module.exports = mongoose.model('Answers', answerSchema);