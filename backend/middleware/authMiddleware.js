const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token:', token);  // Log the token for debugging
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded);  // Log decoded token details
      req.user = await User.findById(decoded.id).select('-password');
      console.log('Authenticated User:', req.user);  // Log the user object
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.error('Token expired');
        return res.status(401).json({ message: 'Token expired, please log in again' });
      } else {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  } else {
    console.log('No token found in request');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };
