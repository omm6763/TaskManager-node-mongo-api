const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const dotenv = require('dotenv')
dotenv.config()

// Middleware to check if request has a valid token
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization

  // If no token in headers
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1] // Get token after "Bearer"

  try {
    // Verify token with secret
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Find user by id from payload
    const user = await User.findById(payload.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found or deleted' })
    }

    // Attach user to request for later use
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}
