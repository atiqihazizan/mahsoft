const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest, conflict } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const createSupplierValidation = [
  body('name').notEmpty().withMessage('Nama pembekal diperlukan'),
  body('email').optional().isEmail().withMessage('Format email tidak sah'),
  body('phone').optional().isMobilePhone('any').withMessage('Format telefon tidak sah'),
  handleValidationErrors
];

const updateSupplierValidation = [
  param('id').isString().withMessage('ID tidak sah'),
  body('name').optional().notEmpty().withMessage('Nama pembekal tidak boleh kosong'),
  body('email').optional().isEmail().withMessage('Format email tidak sah'),
  body('phone').optional().isMobilePhone('any').withMessage('Format telefon tidak sah'),
  handleValidationErrors
];

// GET /api/v1/suppliers - Dapatkan semua pembekal
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.supplier.count({ where })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    success(res, {
      suppliers,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Senarai pembekal berjaya diambil');
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    error(res, 'Ralat mengambil senarai pembekal');
  }
});

// GET /api/v1/suppliers/:id - Dapatkan pembekal mengikut ID
router.get('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        debtors: { take: 5, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!supplier) {
      return notFound(res, 'Pembekal tidak ditemui');
    }

    success(res, supplier, 'Pembekal berjaya diambil');
  } catch (err) {
    console.error('Error fetching supplier:', err);
    error(res, 'Ralat mengambil pembekal');
  }
});

// POST /api/v1/suppliers - Cipta pembekal baru
router.post('/', createSupplierValidation, async (req, res) => {
  try {
    const { name, email, phone, address, taxNumber } = req.body;

    // Check if supplier with same email already exists (if email provided)
    if (email) {
      const existingSupplier = await prisma.supplier.findFirst({
        where: { email }
      });

      if (existingSupplier) {
        return conflict(res, 'Pembekal dengan email ini sudah wujud');
      }
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        address,
        taxNumber
      }
    });

    success(res, supplier, 'Pembekal berjaya dicipta', 201);
  } catch (err) {
    console.error('Error creating supplier:', err);
    error(res, 'Ralat mencipta pembekal');
  }
});

// PUT /api/v1/suppliers/:id - Kemaskini pembekal
router.put('/:id', updateSupplierValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, taxNumber } = req.body;

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id }
    });

    if (!existingSupplier) {
      return notFound(res, 'Pembekal tidak ditemui');
    }

    // Check if another supplier with same email exists (excluding current supplier)
    if (email && email !== existingSupplier.email) {
      const duplicateSupplier = await prisma.supplier.findFirst({
        where: { 
          email,
          id: { not: id }
        }
      });

      if (duplicateSupplier) {
        return conflict(res, 'Pembekal dengan email ini sudah wujud');
      }
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(taxNumber !== undefined && { taxNumber })
      }
    });

    success(res, supplier, 'Pembekal berjaya dikemaskini');
  } catch (err) {
    console.error('Error updating supplier:', err);
    error(res, 'Ralat mengemaskini pembekal');
  }
});

// DELETE /api/v1/suppliers/:id - Padam pembekal
router.delete('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        debtors: true
      }
    });

    if (!existingSupplier) {
      return notFound(res, 'Pembekal tidak ditemui');
    }

    // Check if supplier has related records
    if (existingSupplier.debtors.length > 0) {
      return badRequest(res, 'Pembekal tidak boleh dipadam kerana mempunyai rekod hutang');
    }

    await prisma.supplier.delete({
      where: { id }
    });

    success(res, null, 'Pembekal berjaya dipadam');
  } catch (err) {
    console.error('Error deleting supplier:', err);
    error(res, 'Ralat memadam pembekal');
  }
});

module.exports = router;
