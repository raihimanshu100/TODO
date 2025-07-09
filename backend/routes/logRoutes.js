const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const ActionLog = require('../models/ActionLog');

router.get('/', verifyToken, async (req, res) => {
  const logs = await ActionLog.find()
    .sort({ timestamp: -1 })
    .limit(20)
    .populate('userId', 'name')
    .populate('taskId', 'title');
  res.json(logs);
});

module.exports = router;
