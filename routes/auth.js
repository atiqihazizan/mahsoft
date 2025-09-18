const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, badRequest, notFound, unauthorized } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');
const { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  validatePassword, 
  updateLastLogin,
  authenticateToken
} = require('../utils/auth');

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Nama diperlukan'),
  body('username').isLength({ min: 3 }).withMessage('Username mestilah sekurang-kurangnya 3 aksara'),
  body('email').isEmail().withMessage('Format email tidak sah'),
  body('password').custom((value) => {
    const validation = validatePassword(value);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    return true;
  }),
  body('role').optional().isIn(['ADMIN', 'USER', 'VIEWER']).withMessage('Peranan tidak sah'),
  handleValidationErrors
];

const loginValidation = [
  body('username').notEmpty().withMessage('Username atau email diperlukan'),
  body('password').notEmpty().withMessage('Kata laluan diperlukan'),
  handleValidationErrors
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Kata laluan semasa diperlukan'),
  body('newPassword').custom((value) => {
    const validation = validatePassword(value);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    return true;
  }),
  handleValidationErrors
];

// POST /api/v1/auth/register - Daftar pengguna baru
router.post('/register', registerValidation, async (req, res) => {
  try {
    const { name, username, email, password, role = 'USER' } = req.body;

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return badRequest(res, 'Username sudah digunakan');
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return badRequest(res, 'Email sudah digunakan');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    success(res, user, 'Pengguna berjaya didaftarkan', 201);

  } catch (err) {
    console.error('Error registering user:', err);
    error(res, 'Ralat mendaftarkan pengguna');
  }
});

// POST /api/v1/auth/login - Log masuk
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email (case sensitive)
    // Using raw query with BINARY to ensure exact case-sensitive matching
    // BINARY forces MySQL to perform case-sensitive comparison
    // This means "Admin" != "admin" != "ADMIN"
    const users = await prisma.$queryRaw`
      SELECT id, name, username, email, password, role, is_active as isActive, last_login as lastLogin, created_at as createdAt, updated_at as updatedAt
      FROM users 
      WHERE BINARY username = ${username} OR BINARY email = ${username}
      LIMIT 1
    `;
    
    const user = users.length > 0 ? users[0] : null;

    if (!user) {
      return unauthorized(res, 'Invalid username or password');
    }

    if (!user.isActive) {
      return unauthorized(res, 'Account has been deactivated');
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return unauthorized(res, 'Invalid username or password');
    }

    // Update last login
    await updateLastLogin(user.id);

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    // Return user data without password
    const userData = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: new Date()
    };

    success(res, {
      user: userData,
      token,
      expiresIn: '24h'
    }, 'Log masuk berjaya');

  } catch (err) {
    console.error('Error logging in:', err);
    error(res, 'Ralat log masuk');
  }
});

// POST /api/v1/auth/change-password - Tukar kata laluan
router.post('/change-password', changePasswordValidation, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From auth middleware

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      return notFound(res, 'Pengguna tidak dijumpai');
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return badRequest(res, 'Kata laluan semasa tidak betul');
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    success(res, null, 'Kata laluan berjaya ditukar');

  } catch (err) {
    console.error('Error changing password:', err);
    error(res, 'Ralat menukar kata laluan');
  }
});

// GET /api/v1/auth/me - Dapatkan maklumat pengguna semasa
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return notFound(res, 'Pengguna tidak dijumpai');
    }

    success(res, user, 'Maklumat pengguna berjaya diambil');

  } catch (err) {
    console.error('Error getting user profile:', err);
    error(res, 'Ralat mendapatkan maklumat pengguna');
  }
});

// POST /api/v1/auth/logout - Log keluar (client-side token removal)
router.post('/logout', async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token from storage
    success(res, null, 'Log keluar berjaya');

  } catch (err) {
    console.error('Error logging out:', err);
    error(res, 'Ralat log keluar');
  }
});

// POST /api/v1/auth/refresh - Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    // Generate new token
    const token = generateToken({
      userId: req.user.id,
      username: req.user.username,
      role: req.user.role
    });

    success(res, {
      token,
      expiresIn: '24h'
    }, 'Token berjaya diperbaharui');

  } catch (err) {
    console.error('Error refreshing token:', err);
    error(res, 'Ralat memperbaharui token');
  }
});

module.exports = router;
