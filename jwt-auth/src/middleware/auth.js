
const { verifyToken } = require('../config/jwt');

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = verifyToken(token);

    req.user = decoded;
    
    next();
    
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticateUser };