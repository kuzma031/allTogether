const Question = require('../model/question');
const Answer = require('../model/answer');

exports.changeLogo = async (req,res) => {
    try {
        console.log('change logo');
    } catch(err) {
        console.log(err);
    }
}

exports.addNewQuestion = async (req,res) => {
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
        console.log(err);
    }
};

exports.getAllQuestions = async (req,res) => {
    try {
        const questions = await Question.find();

        return res.status(200).json({ success: true, questions });

    } catch(err) {
        console.log(err);
    }
}

exports.deleteQuestion = async (req,res) => {
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
        console.log(err);
    }
}

exports.editQuestion = async (req,res) => {
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
        console.log(err);
    }
}