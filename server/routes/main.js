const express = require('express');

const router = express.Router();

const controller = require('../controller/main');

router.post('/change-logo', controller.changeLogo);
router.post('/add-question', controller.addNewQuestion );
router.post('/delete-question', controller.deleteQuestion);
router.post('/edit-question', controller.editQuestion);
router.get('/questions', controller.getAllQuestions);

module.exports = router;