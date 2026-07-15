const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');
const { generateReceiptNumber } = require('../utils/numberGenerator');

// Validation rules
const createReceiptValidation = [
  body('companyId').notEmpty().withMessage('ID syarikat diperlukan'),
  body('userId').notEmpty().withMessage('ID pengguna diperlukan'),
  body('customerId').notEmpty().withMessage('ID pelanggan diperlukan'),
  body('receiptNumber').optional().isString().trim().notEmpty().withMessage('Nombor resit tidak boleh kosong'),
  body('date').isISO8601().withMessage('Format tarikh tidak sah'),
  body('subject').optional().isString().withMessage('Subjek mestilah teks'),
  body('taxRate').optional().isNumeric().withMessage('Tax rate mestilah nombor'),
  body('items').isArray({ min: 1 }).withMessage('Butiran resit diperlukan'),
  body('items.*.description').notEmpty().withMessage('Penerangan item diperlukan'),
  body('items.*.quantity').isNumeric().withMessage('Kuantiti mestilah nombor'),
  body('items.*.unitPrice').isNumeric().withMessage('Harga unit mestilah nombor'),
  body('items.*.unit').optional().isString(),
  handleValidationErrors
];

const updateReceiptValidation = [
  param('id').isString().withMessage('ID tidak sah'),
  body('companyId').optional().notEmpty().withMessage('ID syarikat tidak boleh kosong'),
  body('userId').optional().notEmpty().withMessage('ID pengguna tidak boleh kosong'),
  body('customerId').optional().notEmpty().withMessage('ID pelanggan tidak boleh kosong'),
  body('receiptNumber').optional().isString().trim().notEmpty().withMessage('Nombor resit tidak boleh kosong'),
  body('date').optional().isISO8601().withMessage('Format tarikh tidak sah'),
  body('subject').optional().isString().withMessage('Subjek mestilah teks'),
  body('status').optional().isIn(['DRAFT', 'ISSUED', 'CANCELLED']).withMessage('Status tidak sah'),
  body('taxRate').optional().isNumeric().withMessage('Tax rate mestilah nombor'),
  handleValidationErrors
];

// Helper function to generate receipt number is imported from utils/numberGenerator

// Helper function to calculate totals
const calculateTotals = (items, taxRate = 0.06, discountPercent = 0, discountAmount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0);
  const taxAmount = subtotal * taxRate;
  const discPct = parseFloat(discountPercent) || 0;
  const discAmt = parseFloat(discountAmount) || 0;
  const calculatedDiscount = discPct > 0 ? subtotal * discPct / 100 : discAmt;
  const total = subtotal - calculatedDiscount + taxAmount;
  
  return {
    subtotal: subtotal.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    total: total.toFixed(2)
  };
};

// GET /api/v1/receipts - Dapatkan semua resit
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, companyId, customerId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    if (search) {
      where.OR = [
        { receiptNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) where.status = status;
    if (companyId) where.companyId = companyId;
    if (customerId) where.customerId = customerId;

    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
          customer: { select: { id: true, name: true } },
          _count: {
            select: {
              payments: true
            }
          }
        }
      }),
      prisma.receipt.count({ where })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    success(res, {
      receipts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Senarai resit berjaya diambil');
  } catch (err) {
    console.error('Error fetching receipts:', err);
    error(res, 'Ralat mengambil senarai resit');
  }
});

// GET /api/v1/receipts/:id - Dapatkan resit mengikut ID
router.get('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const receipt = await prisma.receipt.findUnique({
      where: { id },
      include: {
        company: true,
        user: { select: { id: true, name: true, email: true } },
        customer: true,
        payments: {
          orderBy: { createdAt: 'desc' }
        },
        debtors: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!receipt) {
      return notFound(res, 'Resit tidak ditemui');
    }

    success(res, receipt, 'Resit berjaya diambil');
  } catch (err) {
    console.error('Error fetching receipt:', err);
    error(res, 'Ralat mengambil resit');
  }
});

// POST /api/v1/receipts - Cipta resit baru
router.post('/', createReceiptValidation, async (req, res) => {
  try {
    const { companyId, userId, customerId, receiptNumber: customReceiptNumber, date, subject, items, notes, taxRate, discountPercent, discountAmount, discountLabel } = req.body;

    // Verify related records exist
    const [company, user, customer] = await Promise.all([
      prisma.company.findUnique({ where: { id: companyId } }),
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.customer.findUnique({ where: { id: customerId } })
    ]);

    if (!company) return badRequest(res, 'Syarikat tidak ditemui');
    if (!user) return badRequest(res, 'Pengguna tidak ditemui');
    if (!customer) return badRequest(res, 'Pelanggan tidak ditemui');

    // Guna nombor custom jika diberi, jika tidak generate ikut sequence syarikat
    let receiptNumber;
    if (customReceiptNumber) {
      const existing = await prisma.receipt.findUnique({ where: { receiptNumber: customReceiptNumber } });
      if (existing) return badRequest(res, 'Nombor resit ini sudah digunakan');
      receiptNumber = customReceiptNumber;
    } else {
      receiptNumber = await generateReceiptNumber(companyId);
    }

    // Calculate totals dengan taxRate dari request (peratus → decimal). Default 0.06 jika tidak diberi.
    const normalizedTaxRate = (taxRate !== undefined && taxRate !== null) ? (parseFloat(taxRate) / 100) : 0.06;
    const discPct = parseFloat(discountPercent || 0);
    const discAmt = parseFloat(discountAmount || 0);
    const { subtotal, taxAmount, total } = calculateTotals(items, normalizedTaxRate, discPct, discAmt);

    // Prepare items data with calculated amounts
    const itemsWithAmounts = items.map(item => ({
      description: item.description,
      quantity: parseFloat(item.quantity),
      unitPrice: parseFloat(item.unitPrice),
      amount: parseFloat(item.quantity) * parseFloat(item.unitPrice),
      ...(item.variant && { variant: item.variant }),
      ...(item.listType && { listType: item.listType }),
      ...(item.spacing && { spacing: item.spacing }),
      ...(item.unit && { unit: item.unit })
    }));

    // Create receipt with items
    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber,
        date: new Date(date),
        subject,
        subtotal: parseFloat(subtotal),
        discountPercent: discPct,
        discountAmount: discPct > 0 ? parseFloat(subtotal) * discPct / 100 : discAmt,
        discountLabel: discountLabel || '',
        taxAmount: parseFloat(taxAmount),
        total: parseFloat(total),
        notes,
        items: itemsWithAmounts,
        companyId,
        userId,
        customerId
      },
      include: {
        company: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        customer: { select: { id: true, name: true } }
      }
    });

    success(res, receipt, 'Resit berjaya dicipta', 201);
  } catch (err) {
    console.error('Error creating receipt:', err);
    error(res, 'Ralat mencipta resit');
  }
});

// PUT /api/v1/receipts/:id - Kemaskini resit
router.put('/:id', updateReceiptValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if receipt exists
    const existingReceipt = await prisma.receipt.findUnique({
      where: { id }
    });

    if (!existingReceipt) {
      return notFound(res, 'Resit tidak ditemui');
    }

    // Don't allow updates if receipt is cancelled
    if (existingReceipt.status === 'CANCELLED') {
      return badRequest(res, 'Resit yang telah dibatalkan tidak boleh dikemaskini');
    }

    // Verify related records if provided
    if (updateData.companyId) {
      const company = await prisma.company.findUnique({ where: { id: updateData.companyId } });
      if (!company) return badRequest(res, 'Syarikat tidak ditemui');
    }

    if (updateData.userId) {
      const user = await prisma.user.findUnique({ where: { id: updateData.userId } });
      if (!user) return badRequest(res, 'Pengguna tidak ditemui');
    }

    if (updateData.customerId) {
      const customer = await prisma.customer.findUnique({ where: { id: updateData.customerId } });
      if (!customer) return badRequest(res, 'Pelanggan tidak ditemui');
    }

    // Semak keunikan nombor resit jika ditukar
    if (updateData.receiptNumber && updateData.receiptNumber !== existingReceipt.receiptNumber) {
      const clash = await prisma.receipt.findUnique({ where: { receiptNumber: updateData.receiptNumber } });
      if (clash) return badRequest(res, 'Nombor resit ini sudah digunakan');
    }

    // If items provided, recalc totals and map amounts
    let recalculatedFields = {};
    if (Array.isArray(updateData.items) && updateData.items.length > 0) {
      const itemsWithAmounts = updateData.items.map(item => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        amount: parseFloat(item.quantity) * parseFloat(item.unitPrice),
        ...(item.variant && { variant: item.variant }),
        ...(item.listType && { listType: item.listType }),
        ...(item.spacing && { spacing: item.spacing }),
        ...(item.unit && { unit: item.unit })
      }));
      const normalizedTaxRate = (updateData.taxRate !== undefined && updateData.taxRate !== null)
        ? (parseFloat(updateData.taxRate) / 100)
        : 0.06;
      const discPct = parseFloat(updateData.discountPercent || 0);
      const discAmt = parseFloat(updateData.discountAmount || 0);
      const { subtotal, taxAmount, total } = calculateTotals(itemsWithAmounts, normalizedTaxRate, discPct, discAmt);
      recalculatedFields = {
        items: itemsWithAmounts,
        subtotal: parseFloat(subtotal),
        discountPercent: discPct,
        discountAmount: discPct > 0 ? parseFloat(subtotal) * discPct / 100 : discAmt,
        ...(updateData.discountLabel !== undefined && { discountLabel: updateData.discountLabel }),
        taxAmount: parseFloat(taxAmount),
        total: parseFloat(total)
      };
    }

    // Handle discount update when items are not provided
    if (!Array.isArray(updateData.items) && (updateData.discountPercent !== undefined || updateData.discountAmount !== undefined)) {
      const sub = existingReceipt.subtotal;
      const tax = existingReceipt.taxAmount;
      const discPct = parseFloat(updateData.discountPercent ?? existingReceipt.discountPercent ?? 0);
      const discAmt = parseFloat(updateData.discountAmount ?? existingReceipt.discountAmount ?? 0);
      const calculatedDiscount = discPct > 0 ? sub * discPct / 100 : discAmt;
      recalculatedFields = {
        ...recalculatedFields,
        discountPercent: discPct,
        discountAmount: parseFloat(calculatedDiscount.toFixed(2)),
        ...(updateData.discountLabel !== undefined && { discountLabel: updateData.discountLabel }),
        total: parseFloat((sub - calculatedDiscount + tax).toFixed(2))
      };
    }

    const receipt = await prisma.receipt.update({
      where: { id },
      data: {
        ...(updateData.receiptNumber && { receiptNumber: updateData.receiptNumber }),
        ...(updateData.date && { date: new Date(updateData.date) }),
        ...(updateData.subject !== undefined && { subject: updateData.subject }),
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.notes !== undefined && { notes: updateData.notes }),
        ...(updateData.companyId && { companyId: updateData.companyId }),
        ...(updateData.userId && { userId: updateData.userId }),
        ...(updateData.customerId && { customerId: updateData.customerId }),
        ...recalculatedFields
      },
      include: {
        company: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        customer: { select: { id: true, name: true } }
      }
    });

    success(res, receipt, 'Resit berjaya dikemaskini');
  } catch (err) {
    console.error('Error updating receipt:', err);
    error(res, 'Ralat mengemaskini resit');
  }
});

// DELETE /api/v1/receipts/:id - Padam resit
router.delete('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if receipt exists
    const existingReceipt = await prisma.receipt.findUnique({
      where: { id },
      include: {
        payments: true,
        debtors: true
      }
    });

    if (!existingReceipt) {
      return notFound(res, 'Resit tidak ditemui');
    }

    // Don't allow deletion if receipt is issued and has payments
    if (existingReceipt.status === 'ISSUED' && existingReceipt.payments.length > 0) {
      return badRequest(res, 'Resit yang telah dikeluarkan dan mempunyai pembayaran tidak boleh dipadam');
    }

    // Don't allow deletion if there are related debtors
    if (existingReceipt.debtors.length > 0) {
      return badRequest(res, 'Resit yang mempunyai rekod hutang tidak boleh dipadam');
    }

    // Delete receipt (details will be deleted automatically due to cascade)
    await prisma.receipt.delete({
      where: { id }
    });

    success(res, null, 'Resit berjaya dipadam');
  } catch (err) {
    console.error('Error deleting receipt:', err);
    error(res, 'Ralat memadam resit');
  }
});

module.exports = router;
