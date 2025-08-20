const express = require('express');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const UserMiddleware = require('../middlewares/UserMiddleware');
const UserController = require('../controllers/UserControllers');
const {
  validateCreateUser,
  validateUpdateUser,
  validateLoginUser,
  validateUserId,
} = require('../utils/validations');

const router = express.Router();

// Get all users [GET]
router.get('/', UserController.getAllUser);

// Create a new user [POST]
router.post('/', validateCreateUser, UserController.createUser);

// Login a user [POST]
router.post('/login', validateLoginUser, UserController.loginUser);

// Get a user by ID [GET]
router.get(
  '/:id',
  AuthMiddleware.authenticate,
  UserMiddleware.findUser,
  UserController.getUserById
);

// Partially update a user [PATCH]
router.patch(
  '/:id',
  validateUpdateUser,
  AuthMiddleware.authenticate,
  UserMiddleware.findUser,
  UserController.updateUserPartial
);

// Fully update a user [PUT]
router.put(
  '/:id',
  validateUpdateUser,
  AuthMiddleware.authenticate,
  UserMiddleware.findUser,
  UserController.updateUserComplete
);

// Delete a user [DELETE]
router.delete(
  '/:id',
  validateUserId,
  AuthMiddleware.authenticate,
  UserMiddleware.findUser,
  UserController.deleteUser
);

module.exports = router;
