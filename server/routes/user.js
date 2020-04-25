const express = require('express');

const isAuth = require('../middlewares/isAuth');
const upload = require('../middlewares/multer');

const router = express.Router();

const controller = require('../controller/user');

// Auth
router.post('/login', controller.login);
router.post('/require-password-reset', controller.requirePasswordReset);
router.post('/change-password', controller.passwordReset);

// Users
router.get('/id/', isAuth, controller.getUser);
router.post('/add-new', controller.addUser);
router.post('/delete', controller.deleteUser);
router.get('/all', controller.getAllUsers);

// Videos
router.post('/submit-answer', isAuth, upload, controller.submitAnswer);
router.get('/answers/:id', controller.getAnswers );

module.exports = router;