const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('Auth middleware - headers:', req.headers);
  
  // Get token from header or cookie
  const token = req.header('x-auth-token') || req.cookies?.token;

  // Check if no token
  if (!token) {
    console.log('No auth token found');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('Verifying token:', token);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded);
    
    if (!decoded.userId) {
      console.error('Token does not contain user ID');
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
    req.user = {
      _id: decoded.userId,
      userId: decoded.userId,  // Add this for backward compatibility
      username: decoded.username,
      email: decoded.email
    };
    
    console.log('User set in request:', req.user);
    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};