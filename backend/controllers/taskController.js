const Task = require('../models/Task');
const User = require('../models/User');
const ActionLog = require('../models/ActionLog');

// 🔸 Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (['Todo', 'In Progress', 'Done'].includes(title)) {
      return res.status(400).json({ message: 'Title cannot be a column name' });
    }

    const task = await Task.create({ title, description, priority });
    await logAction(req.user.userId, task._id, 'created', req);

    req.io.emit('task-created', task);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔸 Get All Tasks
const getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate('assignedTo', 'name email');
  res.status(200).json(tasks);
};

// 🔸 Update Task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  const task = await Task.findByIdAndUpdate(id, update, { new: true });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  await logAction(req.user.userId, id, 'updated', req);
  req.io.emit('task-updated', task);
  res.status(200).json(task);
};

// 🔸 Delete Task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findByIdAndDelete(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  await logAction(req.user.userId, id, 'deleted', req);
  req.io.emit('task-deleted', task);
  res.status(200).json({ message: 'Task deleted' });
};

// 🔸 Smart Assign
const smartAssign = async (req, res) => {
  const { id } = req.params;

  const users = await User.find();
  const userTasks = await Promise.all(
    users.map(async user => {
      const count = await Task.countDocuments({
        assignedTo: user._id,
        status: { $ne: 'Done' },
      });
      return { user, count };
    })
  );

  const leastBusy = userTasks.sort((a, b) => a.count - b.count)[0].user;
  const task = await Task.findByIdAndUpdate(id, { assignedTo: leastBusy._id }, { new: true });

  await logAction(leastBusy._id, id, 'assigned via Smart Assign', req);
  req.io.emit('task-updated', task);
  res.status(200).json(task);
};

// 🔸 Log Action Helper
const logAction = async (userId, taskId, action, req) => {
  const log = await ActionLog.create({ userId, taskId, action });
  req.io.emit('log-updated', log);
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  smartAssign,
};
