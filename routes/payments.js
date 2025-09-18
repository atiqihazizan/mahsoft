const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const createPaymentValidation = [
  body('customerId').notEmpty().withMessage('ID pelanggan diperlukan'),
  body('amount').isNumeric().withMessage('Jumlah pembayaran mestilah nombor'),
  body('method').isIn(['CASH', 'BANK_TRANSFER', 'CHEQUE', 'CREDIT_CARD', 'DEBIT_CARD', 'EWALLET']).withMessage('Kaedah pembayaran tidak sah'),
  body('date').isISO8601().withMessage('Format tarikh tidak sah'),
  // Either invoiceId or receiptId must be provided, but not both
  body().custom((body) => {
    const hasInvoiceId = !!body.invoiceId;
    const hasReceiptId = !!body.receiptId;
    
    if (!hasInvoiceId && !hasReceiptId) {
      throw new Error('ID invois atau ID resit diperlukan');
    }
    
    if (hasInvoiceId && hasReceiptId) {
      throw new Error('Hanya boleh pilih sama ada invois atau resit, bukan kedua-duanya');
    }
    
    return true;
  }),
  handleValidationErrors
];

const updatePaymentValidation = [
  param('id').isString().withMessage('ID tidak sah'),
  body('customerId').optional().notEmpty().withMessage('ID pelanggan tidak boleh kosong'),
  body('amount').optional().isNumeric().withMessage('Jumlah pembayaran mestilah nombor'),
  body('method').optional().isIn(['CASH', 'BANK_TRANSFER', 'CHEQUE', 'CREDIT_CARD', 'DEBIT_CARD', 'EWALLET']).withMessage('Kaedah pembayaran tidak sah'),
  body('date').optional().isISO8601().withMessage('Format tarikh tidak sah'),
  handleValidationErrors
];

// GET /api/v1/payments - Dapatkan semua pembayaran
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, method, customerId, invoiceId, receiptId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    if (search) {
      where.OR = [
        { reference: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (method) where.method = method;
    if (customerId) where.customerId = customerId;
    if (invoiceId) where.invoiceId = invoiceId;
    if (receiptId) where.receiptId = receiptId;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true } },
          invoice: { select: { id: true, invoiceNumber: true, total: true } },
          receipt: { select: { id: true, receiptNumber: true, total: true } }
        }
      }),
      prisma.payment.count({ where })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    success(res, {
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Senarai pembayaran berjaya diambil');
  } catch (err) {
    console.error('Error fetching payments:', err);
    error(res, 'Ralat mengambil senarai pembayaran');
  }
});

// GET /api/v1/payments/:id - Dapatkan pembayaran mengikut ID
router.get('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        customer: true,
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            total: true,
            paidAmount: true,
            status: true,
            company: { select: { id: true, name: true } }
          }
        },
        receipt: {
          select: {
            id: true,
            receiptNumber: true,
            total: true,
            status: true,
            company: { select: { id: true, name: true } }
          }
        }
      }
    });

    if (!payment) {
      return notFound(res, 'Pembayaran tidak ditemui');
    }

    success(res, payment, 'Pembayaran berjaya diambil');
  } catch (err) {
    console.error('Error fetching payment:', err);
    error(res, 'Ralat mengambil pembayaran');
  }
});

// POST /api/v1/payments - Cipta pembayaran baru
router.post('/', createPaymentValidation, async (req, res) => {
  try {
    const { customerId, amount, method, reference, date, notes, invoiceId, receiptId } = req.body;

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return badRequest(res, 'Pelanggan tidak ditemui');
    }

    // Verify invoice or receipt exists
    let relatedDocument = null;
    if (invoiceId) {
      relatedDocument = await prisma.invoice.findUnique({
        where: { id: invoiceId }
      });
      if (!relatedDocument) {
        return badRequest(res, 'Invois tidak ditemui');
      }
    } else if (receiptId) {
      relatedDocument = await prisma.receipt.findUnique({
        where: { id: receiptId }
      });
      if (!relatedDocument) {
        return badRequest(res, 'Resit tidak ditemui');
      }
    }

    // Validate payment amount
    const paymentAmount = parseFloat(amount);
    if (paymentAmount <= 0) {
      return badRequest(res, 'Jumlah pembayaran mestilah lebih besar daripada 0');
    }

    // For invoices, check if payment amount doesn't exceed remaining balance
    if (invoiceId && relatedDocument) {
      const remainingBalance = parseFloat(relatedDocument.total) - parseFloat(relatedDocument.paidAmount || 0);
      if (paymentAmount > remainingBalance) {
        return badRequest(res, 'Jumlah pembayaran melebihi baki yang perlu dibayar');
      }
    }

    // Create payment using transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          amount: paymentAmount,
          method,
          reference,
          date: new Date(date),
          notes,
          customerId,
          ...(invoiceId && { invoiceId }),
          ...(receiptId && { receiptId })
        },
        include: {
          customer: { select: { id: true, name: true } },
          invoice: { select: { id: true, invoiceNumber: true, total: true } },
          receipt: { select: { id: true, receiptNumber: true, total: true } }
        }
      });

      // Update invoice paid amount and status if applicable
      if (invoiceId) {
        const newPaidAmount = parseFloat(relatedDocument.paidAmount || 0) + paymentAmount;
        const newStatus = newPaidAmount >= parseFloat(relatedDocument.total) ? 'PAID' : 'SENT';
        
        await tx.invoice.update({
          where: { id: invoiceId },
          data: {
            paidAmount: newPaidAmount,
            status: newStatus
          }
        });
      }

      return payment;
    });

    success(res, result, 'Pembayaran berjaya dicipta', 201);
  } catch (err) {
    console.error('Error creating payment:', err);
    error(res, 'Ralat mencipta pembayaran');
  }
});

// PUT /api/v1/payments/:id - Kemaskini pembayaran
router.put('/:id', updatePaymentValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: true
      }
    });

    if (!existingPayment) {
      return notFound(res, 'Pembayaran tidak ditemui');
    }

    // Verify customer if provided
    if (updateData.customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: updateData.customerId }
      });
      if (!customer) return badRequest(res, 'Pelanggan tidak ditemui');
    }

    // If updating amount and this is an invoice payment, need to recalculate invoice paid amount
    let invoiceUpdate = null;
    if (updateData.amount && existingPayment.invoiceId) {
      const oldAmount = parseFloat(existingPayment.amount);
      const newAmount = parseFloat(updateData.amount);
      const amountDifference = newAmount - oldAmount;
      
      const invoice = existingPayment.invoice;
      const newPaidAmount = parseFloat(invoice.paidAmount) + amountDifference;
      const newStatus = newPaidAmount >= parseFloat(invoice.total) ? 'PAID' : 'SENT';
      
      invoiceUpdate = {
        paidAmount: newPaidAmount,
        status: newStatus
      };
    }

    // Update payment using transaction if invoice needs updating
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id },
        data: {
          ...(updateData.amount && { amount: parseFloat(updateData.amount) }),
          ...(updateData.method && { method: updateData.method }),
          ...(updateData.reference !== undefined && { reference: updateData.reference }),
          ...(updateData.date && { date: new Date(updateData.date) }),
          ...(updateData.notes !== undefined && { notes: updateData.notes }),
          ...(updateData.customerId && { customerId: updateData.customerId })
        },
        include: {
          customer: { select: { id: true, name: true } },
          invoice: { select: { id: true, invoiceNumber: true, total: true } },
          receipt: { select: { id: true, receiptNumber: true, total: true } }
        }
      });

      // Update invoice if needed
      if (invoiceUpdate && existingPayment.invoiceId) {
        await tx.invoice.update({
          where: { id: existingPayment.invoiceId },
          data: invoiceUpdate
        });
      }

      return payment;
    });

    success(res, result, 'Pembayaran berjaya dikemaskini');
  } catch (err) {
    console.error('Error updating payment:', err);
    error(res, 'Ralat mengemaskini pembayaran');
  }
});

// DELETE /api/v1/payments/:id - Padam pembayaran
router.delete('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: true
      }
    });

    if (!existingPayment) {
      return notFound(res, 'Pembayaran tidak ditemui');
    }

    // Delete payment using transaction to update invoice if needed
    await prisma.$transaction(async (tx) => {
      // If this is an invoice payment, update the invoice paid amount
      if (existingPayment.invoiceId && existingPayment.invoice) {
        const newPaidAmount = parseFloat(existingPayment.invoice.paidAmount) - parseFloat(existingPayment.amount);
        const newStatus = newPaidAmount <= 0 ? 'SENT' : (newPaidAmount >= parseFloat(existingPayment.invoice.total) ? 'PAID' : 'SENT');
        
        await tx.invoice.update({
          where: { id: existingPayment.invoiceId },
          data: {
            paidAmount: Math.max(0, newPaidAmount),
            status: newStatus
          }
        });
      }

      // Delete payment
      await tx.payment.delete({
        where: { id }
      });
    });

    success(res, null, 'Pembayaran berjaya dipadam');
  } catch (err) {
    console.error('Error deleting payment:', err);
    error(res, 'Ralat memadam pembayaran');
  }
});

module.exports = router;
