const Question = require('../model/question');
const Answer = require('../model/answer');
const Options = require('../model/options');

exports.changeLogo = async (req,res, next) => {
    try {
        const options = await Options.findOne();
        
        options.logo = req.file.location;
        await options.save();
        
        return res.status(200).json({ success: true, options , message: 'Logo changed' });
    } catch(err) {
        return next(new Error(err));
    }
}

exports.changeMessage = async (req,res,next) => {
    try {
        const { startMessage, endMessage } = req.body;

        const options = await Options.findOne();

        if(!startMessage || !endMessage ) return res.status(400).json({ success: false, message: 'Fill all fields' });

        options.startMessage.heading = startMessage.heading;
        options.startMessage.message = startMessage.message;
        options.endMessage.heading = endMessage.heading;
        options.endMessage.message = endMessage.message;

        await options.save();

        return res.status(200).json({ success: true, options , message: 'Messages updated' });

    } catch(err) {
        return next(new Error(err));
    }
}

exports.getOptions = async (req,res,next) => {
    try {
        const options = await Options.findOne();

        return res.status(200).json({ success: true, options });
    } catch(err) {
        return next(new Error(err));
    }
}

exports.addNewQuestion = async (req,res, next) => {
    try {
        const { content, answerTime } = req.body;

        if(!content || !answerTime ) return res.status(400).json({ success: false, message: 'Fill all fields' });

        const question = new Question({
            content,
            answerTime
        });

        await question.save();

        return res.status(200).json({ success: true, question, message: 'Question added' });

    } catch(err) {
        return next(new Error(err));
    }
};

exports.getAllQuestions = async (req,res, next) => {
    try {
        const questions = await Question.find();

        return res.status(200).json({ success: true, questions });

    } catch(err) {
        return next(new Error(err));
    }
}

exports.deleteQuestion = async (req,res, next) => {
    try {
        const id = req.body.id;

        if(!id) return res.status(400).json({ success: false, message: 'Provide id' });

        const deleteQuestion = await Question.findByIdAndDelete(id); 

        if(deleteQuestion) {
            const questions = await Question.find();
            await Answer.deleteMany({ 'questionId' : id });
            return res.json({
                success: true, 
                questions
            });
        } else {
            return res.json({
                success: false, 
                message: 'No user with that id'
            });
        }
    } catch(err) {
        return next(new Error(err));
    }
}

exports.editQuestion = async (req,res, next) => {
    try {
        const { id, content, answerTime } = req.body;

        if(!id) return res.status(400).json({ success: false, message: 'Provide id' });

        if(!content || !answerTime) return res.status(400).json({ success: false, message: 'Please fill all fields' });

        const question = await Question.findById(id);

        if(!question) return res.status(400).json({ success: false, message: 'Wrong id' });

        question.content = content;
        question.answerTime = answerTime;

        await question.save();

        return res.status(200).json({ success: true, question, message: 'Question edited' });

    } catch(err) {
        return next(new Error(err));
    }
}