const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header or cookie
  const token = req.header('x-auth-token') || req.cookies?.token;

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
    req.user = {
      _id: decoded.userId,
      userId: decoded.userId,  // Add this for backward compatibility
      username: decoded.username,
      email: decoded.email
    };
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};