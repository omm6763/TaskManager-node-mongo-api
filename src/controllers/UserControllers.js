const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { validationResult } = require('express-validator')
dotenv.config()

// Login user [POST]
const loginUser = async (req, res) => {
  const { email, password } = req.body

  // Find user by email
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({ message: 'Invalid email or password' })
  }

  // Validate password
  const isMatch = await user.isValidPassword(password)
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' })
  }

  // Create JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
  res.json({ token })
}

// Get all users [GET]
const getAllUser = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get user by ID [GET]
const getUserById = async (req, res) => {
  res.json(res.user)
}

// Create user [POST]
const createUser = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { name, email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const user = new User({ name, email, password })
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Partially update user [PATCH]
const updateUserPartial = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const userIdFromToken = req.user._id
  const userIdFromRoute = req.params.id

  if (userIdFromToken.toString() !== userIdFromRoute) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  try {
    const updatedUser = await res.user.set(req.body).save()
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Fully update user [PUT]
const updateUserComplete = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const userIdFromToken = req.user._id
  const userIdFromRoute = req.params.id

  if (userIdFromToken.toString() !== userIdFromRoute) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  try {
    const updatedUser = await res.user.set(req.body).save()
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete user [DELETE]
const deleteUser = async (req, res) => {
  const userIdFromToken = req.user._id
  const userIdFromRoute = req.params.id

  if (userIdFromToken.toString() !== userIdFromRoute) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  try {
    const userDeleted = await res.user
    await userDeleted.deleteOne()
    res.json({ message: `User ${userDeleted.name} deleted successfully!` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//  Export all together
module.exports = {
  loginUser,
  getAllUser,
  getUserById,
  createUser,
  updateUserPartial,
  updateUserComplete,
  deleteUser,
}
