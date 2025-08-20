const express = require('express')
const TaskController = require('../controllers/TaskControllers')
const AuthMiddleware = require('../middlewares/AuthMiddleware')
const TaskMiddleware = require('../middlewares/TaskMiddleware')
const {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
} = require('../utils/validations')
const router = express.Router()

// Get all tasks [GET]
router.get('/', AuthMiddleware.authenticate, TaskController.getAllTasks)

// Create a new task [POST]
router.post(
  '/',
  validateCreateTask,
  AuthMiddleware.authenticate,
  TaskController.createTask
)

// Get a task by its id [GET]
router.get(
  '/:id',
  AuthMiddleware.authenticate,
  TaskMiddleware.findTask,
  TaskController.getTask
)

// Update a task [PUT]
router.put(
  '/:id',
  validateUpdateTask,
  AuthMiddleware.authenticate,
  TaskMiddleware.findTask,
  TaskController.updateTask
)

// Delete a task [DELETE]
router.delete(
  '/:id',
  validateTaskId,
  AuthMiddleware.authenticate,
  TaskMiddleware.findTask,
  TaskController.deleteTask
)

module.exports = router
