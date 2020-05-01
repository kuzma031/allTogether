const express = require('express');

const router = express.Router();

const { uploadLogo } = require('../middlewares/multer');

const controller = require('../controller/main');

router.get('/options', controller.getOptions);
router.post('/change-logo', uploadLogo, controller.changeLogo);
router.post('/change-messages', controller.changeMessage);

router.post('/add-question', controller.addNewQuestion );
router.post('/delete-question', controller.deleteQuestion);
router.post('/edit-question', controller.editQuestion);
router.get('/questions', controller.getAllQuestions);

module.exports = router;