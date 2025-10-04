const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');
const { generateInvoiceNumber } = require('../utils/numberGenerator');

// Validation rules
const createInvoiceValidation = [
  body('companyId').notEmpty().withMessage('ID syarikat diperlukan'),
  body('userId').notEmpty().withMessage('ID pengguna diperlukan'),
  body('customerId').notEmpty().withMessage('ID pelanggan diperlukan'),
  body('date').isISO8601().withMessage('Format tarikh tidak sah'),
  body('dueDate').isISO8601().withMessage('Format tarikh tempoh tidak sah'),
  body('subject').optional().isString().withMessage('Subjek mestilah teks'),
  body('taxRate').optional().isNumeric().withMessage('Tax rate mestilah nombor'),
  body('items').isArray({ min: 1 }).withMessage('Butiran invois diperlukan'),
  body('items.*.description').notEmpty().withMessage('Penerangan item diperlukan'),
  body('items.*.quantity').isNumeric().withMessage('Kuantiti mestilah nombor'),
  body('items.*.unitPrice').isNumeric().withMessage('Harga unit mestilah nombor'),
  handleValidationErrors
];

const updateInvoiceValidation = [
  param('id').isString().withMessage('ID tidak sah'),
  body('companyId').optional().notEmpty().withMessage('ID syarikat tidak boleh kosong'),
  body('userId').optional().notEmpty().withMessage('ID pengguna tidak boleh kosong'),
  body('customerId').optional().notEmpty().withMessage('ID pelanggan tidak boleh kosong'),
  body('date').optional().isISO8601().withMessage('Format tarikh tidak sah'),
  body('dueDate').optional().isISO8601().withMessage('Format tarikh tempoh tidak sah'),
  body('subject').optional().isString().withMessage('Subjek mestilah teks'),
  body('status').optional().isIn(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).withMessage('Status tidak sah'),
  body('taxRate').optional().isNumeric().withMessage('Tax rate mestilah nombor'),
  body('items').optional().isArray({ min: 1 }).withMessage('Butiran invois mestilah array'),
  body('items.*.description').optional().notEmpty().withMessage('Penerangan item diperlukan'),
  body('items.*.quantity').optional().isNumeric().withMessage('Kuantiti mestilah nombor'),
  body('items.*.unitPrice').optional().isNumeric().withMessage('Harga unit mestilah nombor'),
  handleValidationErrors
];

// Helper function to generate invoice number is imported from utils/numberGenerator

// Helper function to calculate totals
const calculateTotals = (items, taxRate = 0.06) => {
  const subtotal = items.reduce((sum, item) =>  sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0);
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  
  return {
    subtotal: subtotal.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    total: total.toFixed(2)
  };
};

// GET /api/v1/invoices - Dapatkan semua invois
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, companyId, customerId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) where.status = status;
    if (companyId) where.companyId = companyId;
    if (customerId) where.customerId = customerId;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        // take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
          customer: { select: { id: true, name: true } },
          quote: { select: { id: true, quoteNumber: true } },
          _count: {
            select: {
              payments: true
            }
          }
        }
      }),
      prisma.invoice.count({ where })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    success(res, {
      invoices,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Senarai invois berjaya diambil');
  } catch (err) {
    console.error('Error fetching invoices:', err);
    error(res, 'Ralat mengambil senarai invois');
  }
});

// GET /api/v1/invoices/:id - Dapatkan invois mengikut ID
router.get('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        company: true,
        user: { select: { id: true, name: true, email: true } },
        customer: true,
        quote: { select: { id: true, quoteNumber: true } },
        // payments: {
        //   orderBy: { createdAt: 'desc' }
        // },
        // debtors: {
        //   orderBy: { createdAt: 'desc' }
        // }
      }
    });

    if (!invoice) {
      return notFound(res, 'Invois tidak ditemui');
    }

    success(res, invoice, 'Invois berjaya diambil');
  } catch (err) {
    console.error('Error fetching invoice:', err);
    error(res, 'Ralat mengambil invois');
  }
});

// POST /api/v1/invoices - Cipta invois baru
router.post('/', createInvoiceValidation, async (req, res) => {
  try {
    const { companyId, userId, customerId, date, dueDate, subject, items, notes, quoteId, taxRate } = req.body;

    // Verify related records exist
    const [company, user, customer] = await Promise.all([
      prisma.company.findUnique({ where: { id: companyId } }),
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.customer.findUnique({ where: { id: customerId } })
    ]);

    if (!company) return badRequest(res, 'Syarikat tidak ditemui');
    if (!user) return badRequest(res, 'Pengguna tidak ditemui');
    if (!customer) return badRequest(res, 'Pelanggan tidak ditemui');

    // Verify quote if provided
    if (quoteId) {
      const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
      if (!quote) return badRequest(res, 'Sebut harga tidak ditemui');
    }

    // Generate invoice number using company sequence
    const invoiceNumber = await generateInvoiceNumber(companyId);

    // Calculate totals - taxRate dari frontend dalam peratus (contoh 6), normalize ke decimal
    const normalizedTaxRate = (taxRate !== undefined && taxRate !== null) ? (parseFloat(taxRate) / 100) : 0.06;
    const { subtotal, taxAmount, total } = calculateTotals(items, normalizedTaxRate);

    // Prepare items data with calculated amounts
    const itemsWithAmounts = items.map(item => ({
      description: item.description,
      quantity: parseFloat(item.quantity),
      unitPrice: parseFloat(item.unitPrice),
      amount: parseFloat(item.quantity) * parseFloat(item.unitPrice),
      // Simpan DescriptionField properties jika dibekalkan
      ...(item.variant && { variant: item.variant }),
      ...(item.listType && { listType: item.listType }),
      ...(item.spacing && { spacing: item.spacing })
    }));

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        date: new Date(date),
        dueDate: new Date(dueDate),
        subject,
        subtotal: parseFloat(subtotal),
        taxAmount: parseFloat(taxAmount),
        total: parseFloat(total),
        notes,
        items: itemsWithAmounts,
        companyId,
        userId,
        customerId,
        ...(quoteId && { quoteId })
      },
      include: {
        company: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        customer: { select: { id: true, name: true } },
        quote: { select: { id: true, quoteNumber: true } }
      }
    });

    success(res, invoice, 'Invois berjaya dicipta', 201);
  } catch (err) {
    console.error('Error creating invoice:', err);
    error(res, 'Ralat mencipta invois');
  }
});

// PUT /api/v1/invoices/:id - Kemaskini invois
router.put('/:id', updateInvoiceValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id }
    });

    if (!existingInvoice) {
      return notFound(res, 'Invois tidak ditemui');
    }

    // Don't allow updates if invoice is paid
    if (existingInvoice.status === 'PAID' && updateData.status !== 'PAID') {
      return badRequest(res, 'Invois yang telah dibayar tidak boleh dikemaskini');
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

    // Prepare update data
    const invoiceUpdateData = {
      ...(updateData.date && { date: new Date(updateData.date) }),
      ...(updateData.dueDate && { dueDate: new Date(updateData.dueDate) }),
      ...(updateData.subject !== undefined && { subject: updateData.subject }),
      ...(updateData.status && { status: updateData.status }),
      ...(updateData.notes !== undefined && { notes: updateData.notes }),
      ...(updateData.companyId && { companyId: updateData.companyId }),
      ...(updateData.userId && { userId: updateData.userId }),
      ...(updateData.customerId && { customerId: updateData.customerId })
    };

    // Handle items update if provided
    if (updateData.items && Array.isArray(updateData.items)) {
      // Calculate totals from new items dengan taxRate jika dibekalkan
      const normalizedTaxRate = (updateData.taxRate !== undefined && updateData.taxRate !== null)
        ? (parseFloat(updateData.taxRate) / 100)
        : 0.06;
      const { subtotal, taxAmount, total } = calculateTotals(updateData.items, normalizedTaxRate);
      invoiceUpdateData.subtotal = parseFloat(subtotal);
      invoiceUpdateData.taxAmount = parseFloat(taxAmount);
      invoiceUpdateData.total = parseFloat(total);

      // Prepare items data with calculated amounts
      const itemsWithAmounts = updateData.items.map(item => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        amount: parseFloat(item.quantity) * parseFloat(item.unitPrice),
        ...(item.variant && { variant: item.variant }),
        ...(item.listType && { listType: item.listType }),
        ...(item.spacing && { spacing: item.spacing })
      }));

      invoiceUpdateData.items = itemsWithAmounts;
    }

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id },
      data: invoiceUpdateData,
      include: {
        company: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        customer: { select: { id: true, name: true } },
        quote: { select: { id: true, quoteNumber: true } }
      }
    });

    return success(res, invoice, 'Invois berjaya dikemaskini');
  } catch (err) {
    console.error('Error updating invoice:', err);
    error(res, 'Ralat mengemaskini invois');
  }
});

// POST /api/v1/invoices/:id/mark-paid - Tandakan invois sebagai dibayar
router.post('/:id/mark-paid', [
  param('id').isString().withMessage('ID tidak sah'),
  body('paidAmount').isNumeric().withMessage('Jumlah bayaran mestilah nombor'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAmount } = req.body;

    const invoice = await prisma.invoice.findUnique({
      where: { id }
    });

    if (!invoice) {
      return notFound(res, 'Invois tidak ditemui');
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        paidAmount: parseFloat(paidAmount),
        status: parseFloat(paidAmount) >= parseFloat(invoice.total) ? 'PAID' : 'SENT'
      },
      include: {
        company: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        customer: { select: { id: true, name: true } }
      }
    });

    success(res, updatedInvoice, 'Status pembayaran invois berjaya dikemaskini');
  } catch (err) {
    console.error('Error marking invoice as paid:', err);
    error(res, 'Ralat mengemaskini status pembayaran invois');
  }
});

// DELETE /api/v1/invoices/:id - Padam invois
router.delete('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        payments: true,
        debtors: true
      }
    });

    if (!existingInvoice) {
      return notFound(res, 'Invois tidak ditemui');
    }

    // Don't allow deletion if invoice has payments or is marked as paid
    if (existingInvoice.status === 'PAID' || existingInvoice.payments.length > 0) {
      return badRequest(res, 'Invois yang telah dibayar tidak boleh dipadam');
    }

    // Don't allow deletion if there are related debtors
    if (existingInvoice.debtors.length > 0) {
      return badRequest(res, 'Invois yang mempunyai rekod hutang tidak boleh dipadam');
    }

    // Delete invoice (details will be deleted automatically due to cascade)
    await prisma.invoice.delete({
      where: { id }
    });

    success(res, null, 'Invois berjaya dipadam');
  } catch (err) {
    console.error('Error deleting invoice:', err);
    error(res, 'Ralat memadam invois');
  }
});

// POST /api/v1/invoices/:id/convert-to-delivery-order - Tukar invois kepada delivery order
router.post('/:id/convert-to-delivery-order', [
  param('id').isString().withMessage('ID tidak sah'),
  body('deliveryDate').optional().isISO8601().withMessage('Format tarikh penghantaran tidak sah'),
  body('deliveryAddress').optional().isString().withMessage('Alamat penghantaran mestilah teks'),
  body('contactPerson').optional().isString().withMessage('Nama kontak mestilah teks'),
  body('contactPhone').optional().isMobilePhone('any').withMessage('Format telefon kontak tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryDate, deliveryAddress, contactPerson, contactPhone } = req.body;

    // Get invoice dengan semua data yang diperlukan
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true, deliveryOrderSeq: true, deliveryOrderPrefix: true } },
        user: { select: { id: true, name: true } },
        customer: { select: { id: true, name: true, address: true, phone: true } }
      }
    });

    if (!invoice) {
      return notFound(res, 'Invois tidak ditemui');
    }

    if (invoice.status === 'CANCELLED') {
      return badRequest(res, 'Invois yang dibatalkan tidak boleh ditukar kepada delivery order');
    }

    // Generate delivery order number
    const { generateDeliveryOrderNumber } = require('../utils/numberGenerator');
    const doNumber = await generateDeliveryOrderNumber(invoice.companyId);

    // Convert invoice items to delivery details
    const deliveryDetails = invoice.items?.map(item => ({
      description: item.description,
      quantity: parseFloat(item.quantity),
      unitPrice: parseFloat(item.unitPrice),
      amount: parseFloat(item.quantity) * parseFloat(item.unitPrice),
      deliveredQty: 0 // Belum dihantar
    })) || [];

    // Create delivery order
    const deliveryOrder = await prisma.deliveryOrder.create({
      data: {
        doNumber,
        date: new Date(),
        deliveryDate: new Date(deliveryDate || Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 hari
        subtotal: invoice.subtotal,
        taxAmount: invoice.taxAmount,
        total: invoice.total,
        deliveryAddress: deliveryAddress || invoice.customer.address,
        contactPerson: contactPerson || invoice.customer.name,
        contactPhone: contactPhone || invoice.customer.phone,
        notes: `Created from Invoice ${invoice.invoiceNumber}`,
        companyId: invoice.companyId,
        userId: invoice.userId,
        customerId: invoice.customerId,
        invoiceId: invoice.id,
        details: {
          create: deliveryDetails
        }
      },
      include: {
        company: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        customer: { select: { id: true, name: true } },
        invoice: { select: { id: true, invoiceNumber: true } },
        details: true
      }
    });

    success(res, deliveryOrder, 'Delivery order berjaya dicipta dari invois', 201);
  } catch (err) {
    console.error('Error converting invoice to delivery order:', err);
    error(res, 'Ralat menukar invois kepada delivery order');
  }
});

module.exports = router;
