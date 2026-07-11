const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest, conflict } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const createCustomerValidation = [
  body('name').notEmpty().withMessage('Nama pelanggan diperlukan'),
  body('short').notEmpty().withMessage('Nama pendek diperlukan'),
  body('email').optional().isEmail().withMessage('Format email tidak sah'),
  body('phone').optional().isString().withMessage('Telefon mestilah teks'),
  body('mobile').optional().isString().withMessage('Mobile mestilah teks'),
  body('address').optional().isString().withMessage('Alamat mestilah teks'),
  body('attn').optional().isString().withMessage('Tandaan mestilah teks'),
  body('taxNumber').optional().isString().withMessage('Nombor cukai mestilah teks'),
  handleValidationErrors
];

const updateCustomerValidation = [
  param('id').isString().withMessage('ID tidak sah'),
  body('name').optional().custom((value) => {
    if (value !== undefined && value !== null && value.trim() === '') {
      throw new Error('Nama pelanggan tidak boleh kosong');
    }
    return true;
  }),
  body('short').optional().custom((value) => {
    if (value !== undefined && value !== null && value.trim() === '') {
      throw new Error('Nama pendek tidak boleh kosong');
    }
    return true;
  }),
  body('email').optional().custom((value) => {
    if (value && value !== null && value.trim() !== '') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        throw new Error('Format email tidak sah');
      }
    }
    return true;
  }),
  body('phone').optional().custom((value) => {
    if (value !== null) return true;
    return true;
  }),
  body('mobile').optional().custom((value) => {
    if (value !== null) return true;
    return true;
  }),
  body('address').optional().custom((value) => {
    if (value !== null) return true;
    return true;
  }),
  body('attn').optional().custom((value) => {
    if (value !== null) return true;
    return true;
  }),
  body('taxNumber').optional().custom((value) => {
    if (value !== null) return true;
    return true;
  }),
  handleValidationErrors
];

// GET /api/v1/customers - Dapatkan semua pelanggan
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

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({ where })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    success(res, {
      customers,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Senarai pelanggan berjaya diambil');
  } catch (err) {
    console.error('Error fetching customers:', err);
    error(res, 'Ralat mengambil senarai pelanggan');
  }
});

// GET /api/v1/customers/:id - Dapatkan pelanggan mengikut ID
router.get('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        invoices: { take: 5, orderBy: { createdAt: 'desc' } },
        receipts: { take: 5, orderBy: { createdAt: 'desc' } },
        quotes: { take: 5, orderBy: { createdAt: 'desc' } },
        payments: { take: 5, orderBy: { createdAt: 'desc' } },
        debtors: { take: 5, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!customer) {
      return notFound(res, 'Pelanggan tidak ditemui');
    }

    success(res, customer, 'Pelanggan berjaya diambil');
  } catch (err) {
    console.error('Error fetching customer:', err);
    error(res, 'Ralat mengambil pelanggan');
  }
});

// POST /api/v1/customers - Cipta pelanggan baru
router.post('/', createCustomerValidation, async (req, res) => {
  try {
    const { name, short, email, phone, mobile, address, attn, taxNumber } = req.body;

    // Check if customer with same email already exists (if email provided)
    if (email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { email }
      });

      if (existingCustomer) {
        return conflict(res, 'Pelanggan dengan email ini sudah wujud');
      }
    }

    // Check if customer with same short name already exists
    const existingShortCustomer = await prisma.customer.findFirst({
      where: { short }
    });

    if (existingShortCustomer) {
      return conflict(res, 'Pelanggan dengan nama pendek ini sudah wujud');
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        short,
        email,
        phone,
        mobile,
        address,
        attn,
        taxNumber,
        tempId: Math.floor(Math.random() * 1000000)
      }
    });

    success(res, customer, 'Pelanggan berjaya dicipta', 201);
  } catch (err) {
    console.error('Error creating customer:', err);
    error(res, 'Ralat mencipta pelanggan');
  }
});

// PUT /api/v1/customers/:id - Kemaskini pelanggan
router.put('/:id', updateCustomerValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, short, email, phone, mobile, address, attn, taxNumber } = req.body;

    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    });

    if (!existingCustomer) {
      return notFound(res, 'Pelanggan tidak ditemui');
    }

    if (email && email !== existingCustomer.email) {
      const duplicateCustomer = await prisma.customer.findFirst({
        where: { 
          email,
          id: { not: id }
        }
      });

      if (duplicateCustomer) {
        return conflict(res, 'Pelanggan dengan email ini sudah wujud');
      }
    }

    if (short && short !== existingCustomer.short) {
      const duplicateShortCustomer = await prisma.customer.findFirst({
        where: { 
          short,
          id: { not: id }
        }
      });

      if (duplicateShortCustomer) {
        return conflict(res, 'Pelanggan dengan nama pendek ini sudah wujud');
      }
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(short !== undefined && { short }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(mobile !== undefined && { mobile }),
        ...(address !== undefined && { address }),
        ...(attn !== undefined && { attn }),
        ...(taxNumber !== undefined && { taxNumber })
      }
    });

    success(res, customer, 'Pelanggan berjaya dikemaskini');
  } catch (err) {
    console.error('Error updating customer:', err);
    error(res, 'Ralat mengemaskini pelanggan');
  }
});

// DELETE /api/v1/customers/:id - Padam pelanggan
router.delete('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
      include: {
        invoices: true,
        receipts: true,
        quotes: true,
        payments: true,
        debtors: true
      }
    });

    if (!existingCustomer) {
      return notFound(res, 'Pelanggan tidak ditemui');
    }

    const invoiceCount = existingCustomer.invoices.length;
    const receiptCount = existingCustomer.receipts.length;
    const quoteCount = existingCustomer.quotes.length;
    const paymentCount = existingCustomer.payments.length;
    const debtorCount = existingCustomer.debtors.length;
    
    const totalRelatedRecords = invoiceCount + receiptCount + quoteCount + paymentCount + debtorCount;

    if (totalRelatedRecords > 0) {
      let relatedDataMessage = `Tidak boleh padam pelanggan "${existingCustomer.name}". Pelanggan ini digunakan dalam:\n`;
      
      if (invoiceCount > 0) {
        relatedDataMessage += `- ${invoiceCount} invois\n`;
      }
      if (receiptCount > 0) {
        relatedDataMessage += `- ${receiptCount} resit\n`;
      }
      if (quoteCount > 0) {
        relatedDataMessage += `- ${quoteCount} sebut harga\n`;
      }
      if (paymentCount > 0) {
        relatedDataMessage += `- ${paymentCount} pembayaran\n`;
      }
      if (debtorCount > 0) {
        relatedDataMessage += `- ${debtorCount} rekod hutang\n`;
      }
      
      relatedDataMessage += `\nJumlah: ${totalRelatedRecords} rekod. Sila buang atau pindahkan rekod ini sebelum memadam pelanggan.`;
      
      return badRequest(res, relatedDataMessage);
    }

    await prisma.customer.delete({
      where: { id }
    });

    success(res, null, 'Pelanggan berjaya dipadam');
  } catch (err) {
    console.error('Error deleting customer:', err);
    error(res, 'Ralat memadam pelanggan');
  }
});

module.exports = router;
