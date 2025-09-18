const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest, conflict } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');
const { authenticateToken, authorize, hashPassword, validatePassword } = require('../utils/auth');

// Validation rules
const createUserValidation = [
  body('name').notEmpty().withMessage('Nama pengguna diperlukan'),
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

const updateUserValidation = [
  param('id').isString().withMessage('ID tidak sah'),
  body('name').optional().notEmpty().withMessage('Nama pengguna tidak boleh kosong'),
  body('username').optional().isLength({ min: 3 }).withMessage('Username mestilah sekurang-kurangnya 3 aksara'),
  body('email').optional().isEmail().withMessage('Format email tidak sah'),
  body('password').optional().custom((value) => {
    if (value) {
      const validation = validatePassword(value);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
    }
    return true;
  }),
  body('role').optional().isIn(['ADMIN', 'USER', 'VIEWER']).withMessage('Peranan tidak sah'),
  body('isActive').optional().isBoolean().withMessage('Status aktif mestilah boolean'),
  handleValidationErrors
];

// GET /api/v1/users - Dapatkan semua pengguna
router.get('/', authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, isActive } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (role) {
      where.role = role;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
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
          // Exclude password from response
        }
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    success(res, {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Senarai pengguna berjaya diambil');
  } catch (err) {
    console.error('Error fetching users:', err);
    error(res, 'Ralat mengambil senarai pengguna');
  }
});

// GET /api/v1/users/:id - Dapatkan pengguna mengikut ID
router.get('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        invoices: { take: 5, orderBy: { createdAt: 'desc' } },
        receipts: { take: 5, orderBy: { createdAt: 'desc' } },
        quotes: { take: 5, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!user) {
      return notFound(res, 'Pengguna tidak ditemui');
    }

    success(res, user, 'Pengguna berjaya diambil');
  } catch (err) {
    console.error('Error fetching user:', err);
    error(res, 'Ralat mengambil pengguna');
  }
});

// POST /api/v1/users - Cipta pengguna baru
router.post('/', createUserValidation, authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { name, username, email, password, role = 'USER' } = req.body;

    // Check if user with same username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return conflict(res, 'Username sudah digunakan');
    }

    // Check if user with same email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return conflict(res, 'Email sudah digunakan');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

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
        createdAt: true,
        updatedAt: true
      }
    });

    success(res, user, 'Pengguna berjaya dicipta', 201);
  } catch (err) {
    console.error('Error creating user:', err);
    error(res, 'Ralat mencipta pengguna');
  }
});

// PUT /api/v1/users/:id - Kemaskini pengguna
router.put('/:id', updateUserValidation, authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, email, password, role, isActive } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return notFound(res, 'Pengguna tidak ditemui');
    }

    // Check if another user with same username exists (excluding current user)
    if (username && username !== existingUser.username) {
      const duplicateUsername = await prisma.user.findUnique({
        where: { username }
      });

      if (duplicateUsername) {
        return conflict(res, 'Username sudah digunakan');
      }
    }

    // Check if another user with same email exists (excluding current user)
    if (email && email !== existingUser.email) {
      const duplicateEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (duplicateEmail) {
        return conflict(res, 'Email sudah digunakan');
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = await hashPassword(password);
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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

    success(res, user, 'Pengguna berjaya dikemaskini');
  } catch (err) {
    console.error('Error updating user:', err);
    error(res, 'Ralat mengemaskini pengguna');
  }
});

// DELETE /api/v1/users/:id - Padam pengguna
router.delete('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        invoices: true,
        receipts: true,
        quotes: true
      }
    });

    if (!existingUser) {
      return notFound(res, 'Pengguna tidak ditemui');
    }

    // Check if user has related records
    const hasRelatedRecords = existingUser.invoices.length > 0 || 
                             existingUser.receipts.length > 0 || 
                             existingUser.quotes.length > 0;

    if (hasRelatedRecords) {
      return badRequest(res, 'Pengguna tidak boleh dipadam kerana mempunyai rekod berkaitan');
    }

    await prisma.user.delete({
      where: { id }
    });

    success(res, null, 'Pengguna berjaya dipadam');
  } catch (err) {
    console.error('Error deleting user:', err);
    error(res, 'Ralat memadam pengguna');
  }
});

module.exports = router;
