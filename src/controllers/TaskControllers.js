const { validationResult } = require('express-validator')
const Task = require('../models/TaskModel')

// Get all tasks [GET]
exports.getAllTasks = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const tasks = await Task.find({ user: req.user._id })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get a task by ID [GET]
exports.getTask = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Create a new task [POST]
exports.createTask = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  // Prevent user from manually setting the user field
  const { user, ...taskData } = req.body
  if (user) {
    return res.status(400).json({ message: 'Cannot set user manually' })
  }

  try {
    const task = new Task({
      ...taskData,
      user: req.user._id, // automatically link task to logged-in user
    })
    await task.save()
    res.status(201).json(task)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Update a task [PUT]
exports.updateTask = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    Object.assign(task, req.body) // merge request data into task
    const updatedTask = await task.save()
    res.json(updatedTask)
  } catch (error) {
    res.status(400).send(error)
  }
}

// Delete a task [DELETE]
exports.deleteTask = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).send(error)
  }
}
