const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} Password match result
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token diperlukan'
      });
    }

    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak sah - pengguna tidak dijumpai'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Akaun pengguna telah dinyahaktifkan'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak sah'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token telah tamat tempoh'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ralat dalaman server'
    });
  }
}

/**
 * Authorization middleware - check user role
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} Middleware function
 */
function authorize(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak diautentikasi'
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak - peranan tidak mencukupi'
      });
    }

    next();
  };
}

/**
 * Password validation rules
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
function validatePassword(password) {
  const errors = [];

  if (!password) {
    errors.push('Kata laluan diperlukan');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Kata laluan mestilah sekurang-kurangnya 8 aksara');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Kata laluan mesti mengandungi sekurang-kurangnya satu huruf besar');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Kata laluan mesti mengandungi sekurang-kurangnya satu huruf kecil');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Kata laluan mesti mengandungi sekurang-kurangnya satu nombor');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Kata laluan mesti mengandungi sekurang-kurangnya satu aksara khas');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Update user last login
 * @param {string} userId - User ID
 */
async function updateLastLogin(userId) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() }
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  authenticateToken,
  authorize,
  validatePassword,
  updateLastLogin
};
