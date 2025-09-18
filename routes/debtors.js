const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const createDebtorValidation = [
  body('amount').isNumeric().withMessage('Jumlah hutang mestilah nombor'),
  body('dueDate').isISO8601().withMessage('Format tarikh tempoh tidak sah'),
  body('status').optional().isIn(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']).withMessage('Status tidak sah'),
  // Either customerId or supplierId must be provided, but not both
  body().custom((body) => {
    const hasCustomerId = !!body.customerId;
    const hasSupplierId = !!body.supplierId;
    
    if (!hasCustomerId && !hasSupplierId) {
      throw new Error('ID pelanggan atau ID pembekal diperlukan');
    }
    
    if (hasCustomerId && hasSupplierId) {
      throw new Error('Hanya boleh pilih sama ada pelanggan atau pembekal, bukan kedua-duanya');
    }
    
    return true;
  }),
  // Either invoiceId or receiptId can be provided (optional)
  body().custom((body) => {
    const hasInvoiceId = !!body.invoiceId;
    const hasReceiptId = !!body.receiptId;
    
    if (hasInvoiceId && hasReceiptId) {
      throw new Error('Hanya boleh pilih sama ada invois atau resit, bukan kedua-duanya');
    }
    
    return true;
  }),
  handleValidationErrors
];

const updateDebtorValidation = [
  param('id').isString().withMessage('ID tidak sah'),
  body('amount').optional().isNumeric().withMessage('Jumlah hutang mestilah nombor'),
  body('dueDate').optional().isISO8601().withMessage('Format tarikh tempoh tidak sah'),
  body('status').optional().isIn(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']).withMessage('Status tidak sah'),
  handleValidationErrors
];

// GET /api/v1/debtors - Dapatkan semua hutang
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, customerId, supplierId, type } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    if (search) {
      where.OR = [
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (supplierId) where.supplierId = supplierId;
    
    // Filter by type (customer/supplier debts)
    if (type === 'customer') {
      where.customerId = { not: null };
    } else if (type === 'supplier') {
      where.supplierId = { not: null };
    }

    // Check for overdue debts and update status
    await prisma.debtor.updateMany({
      where: {
        status: 'PENDING',
        dueDate: {
          lt: new Date()
        }
      },
      data: {
        status: 'OVERDUE'
      }
    });

    const [debtors, total] = await Promise.all([
      prisma.debtor.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true, email: true } },
          supplier: { select: { id: true, name: true, email: true } },
          invoice: { select: { id: true, invoiceNumber: true, total: true } },
          receipt: { select: { id: true, receiptNumber: true, total: true } }
        }
      }),
      prisma.debtor.count({ where })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    success(res, {
      debtors,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Senarai hutang berjaya diambil');
  } catch (err) {
    console.error('Error fetching debtors:', err);
    error(res, 'Ralat mengambil senarai hutang');
  }
});

// GET /api/v1/debtors/summary - Dapatkan ringkasan hutang
router.get('/summary', async (req, res) => {
  try {
    const { customerId, supplierId } = req.query;
    
    const where = {};
    if (customerId) where.customerId = customerId;
    if (supplierId) where.supplierId = supplierId;

    // Update overdue status first
    await prisma.debtor.updateMany({
      where: {
        status: 'PENDING',
        dueDate: {
          lt: new Date()
        }
      },
      data: {
        status: 'OVERDUE'
      }
    });

    const [totalPending, totalOverdue, totalPaid, pendingAmount, overdueAmount] = await Promise.all([
      prisma.debtor.count({
        where: { ...where, status: 'PENDING' }
      }),
      prisma.debtor.count({
        where: { ...where, status: 'OVERDUE' }
      }),
      prisma.debtor.count({
        where: { ...where, status: 'PAID' }
      }),
      prisma.debtor.aggregate({
        where: { ...where, status: 'PENDING' },
        _sum: { amount: true }
      }),
      prisma.debtor.aggregate({
        where: { ...where, status: 'OVERDUE' },
        _sum: { amount: true }
      })
    ]);

    const summary = {
      totalPending,
      totalOverdue,
      totalPaid,
      pendingAmount: pendingAmount._sum.amount || 0,
      overdueAmount: overdueAmount._sum.amount || 0,
      totalAmount: (pendingAmount._sum.amount || 0) + (overdueAmount._sum.amount || 0)
    };

    success(res, summary, 'Ringkasan hutang berjaya diambil');
  } catch (err) {
    console.error('Error fetching debtor summary:', err);
    error(res, 'Ralat mengambil ringkasan hutang');
  }
});

// GET /api/v1/debtors/:id - Dapatkan hutang mengikut ID
router.get('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const debtor = await prisma.debtor.findUnique({
      where: { id },
      include: {
        customer: true,
        supplier: true,
        invoice: {
          include: {
            company: { select: { id: true, name: true } },
            user: { select: { id: true, name: true } }
          }
        },
        receipt: {
          include: {
            company: { select: { id: true, name: true } },
            user: { select: { id: true, name: true } }
          }
        }
      }
    });

    if (!debtor) {
      return notFound(res, 'Hutang tidak ditemui');
    }

    success(res, debtor, 'Hutang berjaya diambil');
  } catch (err) {
    console.error('Error fetching debtor:', err);
    error(res, 'Ralat mengambil hutang');
  }
});

// POST /api/v1/debtors - Cipta hutang baru
router.post('/', createDebtorValidation, async (req, res) => {
  try {
    const { amount, dueDate, status = 'PENDING', notes, customerId, supplierId, invoiceId, receiptId } = req.body;

    // Verify customer or supplier exists
    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId }
      });
      if (!customer) {
        return badRequest(res, 'Pelanggan tidak ditemui');
      }
    }

    if (supplierId) {
      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId }
      });
      if (!supplier) {
        return badRequest(res, 'Pembekal tidak ditemui');
      }
    }

    // Verify invoice or receipt exists if provided
    if (invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId }
      });
      if (!invoice) {
        return badRequest(res, 'Invois tidak ditemui');
      }
    }

    if (receiptId) {
      const receipt = await prisma.receipt.findUnique({
        where: { id: receiptId }
      });
      if (!receipt) {
        return badRequest(res, 'Resit tidak ditemui');
      }
    }

    // Validate amount
    if (parseFloat(amount) <= 0) {
      return badRequest(res, 'Jumlah hutang mestilah lebih besar daripada 0');
    }

    // Create debtor
    const debtor = await prisma.debtor.create({
      data: {
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        status,
        notes,
        ...(customerId && { customerId }),
        ...(supplierId && { supplierId }),
        ...(invoiceId && { invoiceId }),
        ...(receiptId && { receiptId })
      },
      include: {
        customer: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
        invoice: { select: { id: true, invoiceNumber: true, total: true } },
        receipt: { select: { id: true, receiptNumber: true, total: true } }
      }
    });

    success(res, debtor, 'Hutang berjaya dicipta', 201);
  } catch (err) {
    console.error('Error creating debtor:', err);
    error(res, 'Ralat mencipta hutang');
  }
});

// PUT /api/v1/debtors/:id - Kemaskini hutang
router.put('/:id', updateDebtorValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if debtor exists
    const existingDebtor = await prisma.debtor.findUnique({
      where: { id }
    });

    if (!existingDebtor) {
      return notFound(res, 'Hutang tidak ditemui');
    }

    // Don't allow updates if debtor is paid
    if (existingDebtor.status === 'PAID') {
      return badRequest(res, 'Hutang yang telah dibayar tidak boleh dikemaskini');
    }

    // Validate amount if provided
    if (updateData.amount && parseFloat(updateData.amount) <= 0) {
      return badRequest(res, 'Jumlah hutang mestilah lebih besar daripada 0');
    }

    const debtor = await prisma.debtor.update({
      where: { id },
      data: {
        ...(updateData.amount && { amount: parseFloat(updateData.amount) }),
        ...(updateData.dueDate && { dueDate: new Date(updateData.dueDate) }),
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.notes !== undefined && { notes: updateData.notes })
      },
      include: {
        customer: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
        invoice: { select: { id: true, invoiceNumber: true, total: true } },
        receipt: { select: { id: true, receiptNumber: true, total: true } }
      }
    });

    success(res, debtor, 'Hutang berjaya dikemaskini');
  } catch (err) {
    console.error('Error updating debtor:', err);
    error(res, 'Ralat mengemaskini hutang');
  }
});

// POST /api/v1/debtors/:id/mark-paid - Tandakan hutang sebagai dibayar
router.post('/:id/mark-paid', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    const debtor = await prisma.debtor.findUnique({
      where: { id }
    });

    if (!debtor) {
      return notFound(res, 'Hutang tidak ditemui');
    }

    if (debtor.status === 'PAID') {
      return badRequest(res, 'Hutang sudah ditandakan sebagai dibayar');
    }

    const updatedDebtor = await prisma.debtor.update({
      where: { id },
      data: {
        status: 'PAID'
      },
      include: {
        customer: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
        invoice: { select: { id: true, invoiceNumber: true, total: true } },
        receipt: { select: { id: true, receiptNumber: true, total: true } }
      }
    });

    success(res, updatedDebtor, 'Hutang berjaya ditandakan sebagai dibayar');
  } catch (err) {
    console.error('Error marking debtor as paid:', err);
    error(res, 'Ralat menandakan hutang sebagai dibayar');
  }
});

// DELETE /api/v1/debtors/:id - Padam hutang
router.delete('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if debtor exists
    const existingDebtor = await prisma.debtor.findUnique({
      where: { id }
    });

    if (!existingDebtor) {
      return notFound(res, 'Hutang tidak ditemui');
    }

    // Don't allow deletion if debtor is paid (for audit purposes)
    if (existingDebtor.status === 'PAID') {
      return badRequest(res, 'Hutang yang telah dibayar tidak boleh dipadam untuk tujuan audit');
    }

    await prisma.debtor.delete({
      where: { id }
    });

    success(res, null, 'Hutang berjaya dipadam');
  } catch (err) {
    console.error('Error deleting debtor:', err);
    error(res, 'Ralat memadam hutang');
  }
});

module.exports = router;
