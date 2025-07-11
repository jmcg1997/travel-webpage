import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes and attach authenticated user to request
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and is properly formatted
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify JWT and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from DB (excluding password)
    req.user = await User.findById(decoded.userId).select('-password');

    next(); // Continue to protected route
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

export default authMiddleware;
