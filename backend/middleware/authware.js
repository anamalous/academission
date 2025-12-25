const jwt = require('jsonwebtoken');
const User = require('../models/userschema');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) { return res.status(401).json({ message: 'Not authorized, user not found' }); }
      req.user = user;
      next();
    } catch (error) {
      console.log('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) { return res.status(401).json({ message: 'Not authorized, no token' }); }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Access denied. Admins only.' });
};

module.exports = { protect, admin };