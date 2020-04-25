const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require('../model/user');
const Question = require('../model/question');
const Answer = require('../model/answer');

exports.getUser = async (req,res) => {
    try {
        const id = req.id; // we will always have this id thanks to isAuth middleware
        const findUser = await User.findById(id);
        if(!findUser) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const questions = await Question.find();

        const answers = await Answer.find({
            'userId': { $in: [
                mongoose.Types.ObjectId(id)
            ]}
        }); // answers this user made

        return res.status(200).json({ success: true, findUser, questions, answers });   

    } catch(err) {
        console.log(err);
    }
}

exports.getAllUsers = async (req,res) => {
    try {
        const users = await User.find();

        return res.json({
            success: true, 
            users
        });
    } catch(err) {
        console.log(err);
    }
}

exports.addUser = async (req,res) => {
    try {
        const { email, password, confirmPassword, userType } = req.body;
        
        if(!email || !password || !confirmPassword || !userType ) return res.status(400).json({ success: false, message: 'Fill all fields' });
        if(password !== confirmPassword ) return res.status(400).json({ success: false, message: 'Passwords dont match' });

        const findUser = await User.findOne({ email });
        if(findUser) return res.status(400).json({ success: false, message: 'User with that email already exist' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            userType
        });

        await newUser.save();

        return res.status(200).json({ success: true, newUser, message: 'User added' });

    } catch(err) {
        console.log(err);
    }
}

exports.deleteUser = async (req,res) => {
    try {
        const id = req.body.id;

        if(!id) return res.status(400).json({ success: false, message: 'Provide id' });

        const deleteUser = await User.findByIdAndDelete(id);

        if(deleteUser) {
            const users = await User.find();
            return res.json({
                success: true, 
                users
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

// Auth
exports.login = async (req,res) => {
    try {
        const { email, password } = req.body;

        const findUser = await User.findOne({email});

        if(!findUser) return res.status(400).json({ success: false, message: 'User dont exist' });

        const comparePassword = await bcrypt.compare(password, findUser.password);

        if(!comparePassword) return res.status(400).json({ success: false, message: 'Wrong password' });

        const token = jwt.sign({ id: findUser._id }, process.env.JWTSecret );

        const questions = await Question.find();

        return res.status(200).json({ success: true, token, findUser, questions, answers: [] });
 
    } catch(err) {
        console.log(err);
    }
}

exports.requirePasswordReset = async (req,res) => {
    try {
        const email = req.body.email;

        const findUser = await User.findOne({email});

        if(!findUser) return res.status(400).json({ success: false, message: 'User not found'});

        const buffer = await crypto.randomBytes(32);
        const token = buffer.toString('hex');

        findUser.passwordResetToken = token;
        await findUser.save();

        const msg = {
            to: findUser.email,
            from: 'admin@allTogether.com',
            subject: 'Forgot Password Link',
            text: 'Password Reset Link',
            html: `
                <h2>Hello!</h2>
                <p>You are receiving this email because we received a password reset request for your account.</p>

                <a href="${process.env.WEBSITE_URL}/password-reset/${token}">Reset password</a>
                <p>If you did not request a password reset, no further action is required.</p>
                <p>Regards,</p>
                <p>allTogether</p>
            `,
        };

       await sgMail.send(msg);

       return res.status(200).json({ success: true, message: 'Email sent'});

    } catch(err) {
        console.log(err);
    }
}

exports.passwordReset = async (req,res) => {
    try {
        const { token, newPassword, confirmNewPassword } = req.body;

        const findUser = await User.findOne({passwordResetToken: token});

        if(!findUser) return res.status(400).json({ success: false, message: 'Token is wrong or expired'});
        if(!newPassword) return res.status(400).json({ success: false, message: 'You must provide new password'});
        if(newPassword !== confirmNewPassword) return res.status(400).json({ success: false, message: 'Passwords dont match'});

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        findUser.password = hashedPassword;
        // findUser.passwordResetToken = null;
        await findUser.save();

        return res.status(200).json({ success: true, findUser, message: 'Password changed!' });
    }

    catch(err) {
        console.log(err);
    }
}

exports.submitAnswer = async (req,res) => {
    try {

        const userId = req.id;
        const questionId = req.body.question;
        const location = req.file.location;
        
        const answer = new Answer({
            userId,
            questionId,
            mediaUrl: location
        });

        const saveAnswer = await answer.save();

        return res.status(200).json({ success: true, answer, message: 'Answer submited' });

    } catch(err) {
        console.log(err);
        return res.status(400).json({ success: false, message: 'Something went wrong on server' });
    }
}

exports.getAnswers = async (req,res) => {
    try {
        const id = req.params.id;

        const questions = await Question.find();

        const answers = await Answer.find({ 
            'userId': { $in: [
                mongoose.Types.ObjectId(id)
            ]}
        });

        return res.status(200).json({ success: true, questions, answers });

    } catch(err) {
        console.log(err);
    }
}