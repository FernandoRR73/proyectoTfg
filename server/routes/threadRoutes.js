const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');

router.get('/', threadController.getAllThreads);
router.get('/:forumId', threadController.getThreads);
router.post('/', threadController.createThread);

module.exports = router;
