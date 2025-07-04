const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();


/**
 * Generate a signed JWT token with payload and expiry
 */
exports.createToken = (payload, expiresIn) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a valid object');
  }
  if (!expiresIn || typeof expiresIn !== 'string') {
    throw new Error('ExpiresIn must be a valid string (e.g., "1h", "2d")');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
    issuer: 'your-app',
    audience: payload.id.toString(),
  });
};

/**
 * Verify a JWT token
 */

exports.verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  if (!token || typeof token !== 'string') {
    throw new Error('Token must be a valid string');
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'your-app',
  });
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Decode a JWT token without verifying
 */
exports.decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Hash a token using SHA-256
 */
exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

