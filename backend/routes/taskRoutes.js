const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  smartAssign,
} = require('../controllers/taskController');

// Protect all task routes
router.use(verifyToken);

// Routes
router.post('/', createTask);
router.get('/', getAllTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/smart-assign', smartAssign);

module.exports = router;
