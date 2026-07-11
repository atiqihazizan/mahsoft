const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, forbidden, badRequest } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');
const { hashPassword, validatePassword, generateToken } = require('../utils/auth');

// Validation untuk payload setup pertama kali
const setupValidation = [
  // Company
  body('company.name').notEmpty().withMessage('Nama syarikat diperlukan'),
  body('company.label').optional().isString().withMessage('Label syarikat mestilah teks'),
  body('company.address').optional().isString().withMessage('Alamat syarikat mestilah teks'),
  body('company.phone').optional().isString().withMessage('Nombor telefon mestilah teks'),
  body('company.email').optional().isEmail().withMessage('Format email syarikat tidak sah'),
  body('company.bankholder').optional().isString().withMessage('Pemegang akaun bank mestilah teks'),
  body('company.bankname').optional().isString().withMessage('Nama bank mestilah teks'),
  body('company.bankacc').optional().isString().withMessage('Nombor akaun bank mestilah teks'),
  body('company.bankbranch').optional().isString().withMessage('Cawangan bank mestilah teks'),
  body('company.ssm').optional().isString().withMessage('Nombor SSM mestilah teks'),
  body('company.manager').optional().isString().withMessage('Nama pengurus mestilah teks'),
  body('company.taxNumber').optional().isString().withMessage('Nombor cukai mestilah teks'),
  body('company.assist').optional().isString().withMessage('Assistant mestilah teks'),
  body('company.accountant').optional().isString().withMessage('Accountant mestilah teks'),
  body('company.technical').optional().isString().withMessage('Technical mestilah teks'),

  // User (admin pertama)
  body('user.name').notEmpty().withMessage('Nama pengguna diperlukan'),
  body('user.username').isLength({ min: 3 }).withMessage('Username mestilah sekurang-kurangnya 3 aksara'),
  body('user.email').isEmail().withMessage('Format email tidak sah'),
  body('user.password').custom((value) => {
    const validation = validatePassword(value);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    return true;
  }),

  handleValidationErrors
];

// GET /api/v1/setup/status - Semak sama ada sistem perlu first-time setup
router.get('/status', async (req, res) => {
  try {
    const [userCount, companyCount] = await Promise.all([
      prisma.user.count(),
      prisma.company.count()
    ]);

    const needsSetup = userCount === 0 || companyCount === 0;

    success(res, { needsSetup, userCount, companyCount }, 'Status setup berjaya diambil');
  } catch (err) {
    console.error('Error getting setup status:', err);
    error(res, 'Ralat mendapatkan status setup');
  }
});

// POST /api/v1/setup - First-time setup: cipta 1 company + 1 admin user
router.post('/', setupValidation, async (req, res) => {
  try {
    const [userCount, companyCount] = await Promise.all([
      prisma.user.count(),
      prisma.company.count()
    ]);

    // Hanya benarkan setup jika TIADA user dan TIADA company
    if (userCount > 0 || companyCount > 0) {
      return forbidden(res, 'Setup telah selesai. Tidak boleh dijalankan lagi.');
    }

    const { company: companyInput, user: userInput } = req.body;

    if (!companyInput || !userInput) {
      return badRequest(res, 'Data syarikat dan pengguna diperlukan');
    }

    const { name, label, address, phone, email, bankholder, bankname, bankacc, bankbranch, ssm, manager, assist, accountant, technical, taxNumber } = companyInput;
    const { name: userName, username, email: userEmail, password } = userInput;

    // Pastikan username / email belum digunakan (walaupun sepatutnya kosong)
    const [existingUsername, existingEmail] = await Promise.all([
      prisma.user.findUnique({ where: { username } }),
      prisma.user.findUnique({ where: { email: userEmail } })
    ]);

    if (existingUsername) {
      return badRequest(res, 'Username sudah digunakan');
    }

    if (existingEmail) {
      return badRequest(res, 'Email sudah digunakan');
    }

    const hashedPassword = await hashPassword(password);

    // Jalankan dalam transaksi supaya konsisten
    const result = await prisma.$transaction(async (tx) => {
      const createdCompany = await tx.company.create({
        data: {
          name,
          label,
          address,
          phone,
          email,
          taxNumber,
          bankholder,
          bankname,
          bankacc,
          bankbranch,
          ssm,
          manager,
          assist,
          accountant,
          technical,
          tempId: 1,
          is_default: true
        }
      });

      const createdUser = await tx.user.create({
        data: {
          name: userName,
          username,
          email: userEmail,
          password: hashedPassword,
          role: 'ADMIN'
        },
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

      return { createdCompany, createdUser };
    });

    const token = generateToken({
      userId: result.createdUser.id,
      username: result.createdUser.username,
      role: result.createdUser.role
    });

    success(res, {
      user: result.createdUser,
      company: result.createdCompany,
      token,
      expiresIn: '24h'
    }, 'Setup pertama berjaya. Pengguna ADMIN dan syarikat telah dicipta.');
  } catch (err) {
    console.error('Error running initial setup:', err);
    error(res, 'Ralat menjalankan setup pertama');
  }
});

module.exports = router;

