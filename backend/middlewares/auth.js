const { verifyToken } = require('../utils/tokenService');

module.exports = (roles = []) => {
  return (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = auth.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};