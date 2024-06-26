const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.get('/', forumController.getForums);
router.post('/', forumController.createForum);

module.exports = router;
