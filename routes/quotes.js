const express = require('express');
const path = require('path');
const { body, param } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');
const { generateQuoteNumber, generateInvoiceNumber } = require('../utils/numberGenerator');

// Validation rules
const createQuoteValidation = [
  body('companyId').notEmpty().withMessage('ID syarikat diperlukan'),
  body('userId').notEmpty().withMessage('ID pengguna diperlukan'),
  body('customerId').notEmpty().withMessage('ID pelanggan diperlukan'),
  body('quoteNumber').optional().isString().trim().notEmpty().withMessage('Nombor sebut harga tidak boleh kosong'),
  body('date').isISO8601().withMessage('Format tarikh tidak sah'),
  body('validUntil').isISO8601().withMessage('Format tarikh sah hingga tidak sah'),
  body('subject').optional().isString().withMessage('Subjek mestilah teks'),
  body('items').isArray({ min: 1 }).withMessage('Butiran sebut harga diperlukan'),
  body('items.*.description').notEmpty().withMessage('Penerangan item diperlukan'),
  body('items.*.quantity').isNumeric().withMessage('Kuantiti mestilah nombor'),
  body('items.*.unitPrice').isNumeric().withMessage('Harga unit mestilah nombor'),
  body('items.*.unit').optional().isString(),
  handleValidationErrors
];

const updateQuoteValidation = [
  param('id').isString().withMessage('ID tidak sah'),
  body('companyId').optional().notEmpty().withMessage('ID syarikat tidak boleh kosong'),
  body('userId').optional().notEmpty().withMessage('ID pengguna tidak boleh kosong'),
  body('customerId').optional().notEmpty().withMessage('ID pelanggan tidak boleh kosong'),
  body('quoteNumber').optional().isString().trim().notEmpty().withMessage('Nombor sebut harga tidak boleh kosong'),
  body('date').optional().isISO8601().withMessage('Format tarikh tidak sah'),
  body('validUntil').optional().isISO8601().withMessage('Format tarikh sah hingga tidak sah'),
  body('subject').optional().isString().withMessage('Subjek mestilah teks'),
  body('status').optional().isIn(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'DUMMY']).withMessage('Status tidak sah'),
  body('items').optional().isArray({ min: 1 }).withMessage('Butiran sebut harga mesti dalam array'),
  body('items.*.description').optional().notEmpty().withMessage('Penerangan item diperlukan'),
  body('items.*.quantity').optional().isNumeric().withMessage('Kuantiti mestilah nombor'),
  body('items.*.unitPrice').optional().isNumeric().withMessage('Harga unit mestilah nombor'),
  body('items.*.unit').optional().isString(),
  handleValidationErrors
];

// Helper function to generate quote number (legacy - now using numberGenerator)
const generateQuoteNumberLegacy = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `QT${currentYear}`;
  
  const lastQuote = await prisma.quote.findFirst({
    where: {
      quoteNumber: {
        startsWith: prefix
      }
    },
    orderBy: {
      quoteNumber: 'desc'
    }
  });

  let nextNumber = 1;
  if (lastQuote) {
    const lastNumber = parseInt(lastQuote.quoteNumber.slice(prefix.length));
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
};

// Helper function to calculate totals
const calculateTotals = (items, taxRate = 0, discountPercent = 0, discountAmount = 0) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice));
  }, 0);
  
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

// GET /api/v1/quotes - Dapatkan semua sebut harga
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, companyId, customerId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    if (search) {
      where.OR = [
        { quoteNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) where.status = status;
    if (companyId) where.companyId = companyId;
    if (customerId) where.customerId = customerId;

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
          customer: { select: { id: true, name: true } }
        }
      }),
      prisma.quote.count({ where })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    success(res, {
      quotes,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Senarai sebut harga berjaya diambil');
  } catch (err) {
    console.error('Error fetching quotes:', err);
    error(res, 'Ralat mengambil senarai sebut harga');
  }
});

// GET /api/v1/quotes/:id - Dapatkan sebut harga mengikut ID
router.get('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        company: true,
        user: { select: { id: true, name: true, email: true } },
        customer: true,
        invoices: true
      }
    });

    if (!quote) {
      return notFound(res, 'Sebut harga tidak ditemui');
    }

    success(res, quote, 'Sebut harga berjaya diambil');
  } catch (err) {
    console.error('Error fetching quote:', err);
    error(res, 'Ralat mengambil sebut harga');
  }
});

// POST /api/v1/quotes - Cipta sebut harga baru
router.post('/', createQuoteValidation, async (req, res) => {
  try {
    const { companyId, userId, customerId, quoteNumber: customQuoteNumber, date, validUntil, subject, items, notes, discountPercent, discountAmount, discountLabel } = req.body;

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
    let quoteNumber;
    if (customQuoteNumber) {
      const existing = await prisma.quote.findUnique({ where: { quoteNumber: customQuoteNumber } });
      if (existing) return badRequest(res, 'Nombor sebut harga ini sudah digunakan');
      quoteNumber = customQuoteNumber;
    } else {
      quoteNumber = await generateQuoteNumber(companyId);
    }

    // Calculate totals (respect client taxRate if provided; else default 0.06)
  const inputTaxRate = typeof req.body.taxRate === 'number' ? (req.body.taxRate / 100) : 0.06;
  const discPct = parseFloat(discountPercent || 0);
  const discAmt = parseFloat(discountAmount || 0);
    const { subtotal, taxAmount, total } = calculateTotals(items, inputTaxRate, discPct, discAmt);

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

    // Create quote with items
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        date: new Date(date),
        validUntil: new Date(validUntil),
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

    success(res, quote, 'Sebut harga berjaya dicipta', 201);
  } catch (err) {
    console.error('Error creating quote:', err);
    error(res, 'Ralat mencipta sebut harga');
  }
});

// PUT /api/v1/quotes/:id - Kemaskini sebut harga
router.put('/:id', updateQuoteValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if quote exists
    const existingQuote = await prisma.quote.findUnique({
      where: { id }
    });

    if (!existingQuote) {
      return notFound(res, 'Sebut harga tidak ditemui');
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

    // Semak keunikan nombor sebut harga jika ditukar
    if (updateData.quoteNumber && updateData.quoteNumber !== existingQuote.quoteNumber) {
      const clash = await prisma.quote.findUnique({ where: { quoteNumber: updateData.quoteNumber } });
      if (clash) return badRequest(res, 'Nombor sebut harga ini sudah digunakan');
    }

    // If items provided, recalc totals and map amounts
    let recalculatedFields = {};
    if (Array.isArray(updateData.items) && updateData.items.length > 0) {
      const itemsWithAmounts = updateData.items.map((item) => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        amount: parseFloat(item.quantity) * parseFloat(item.unitPrice),
        ...(item.variant && { variant: item.variant }),
        ...(item.listType && { listType: item.listType }),
        ...(item.spacing && { spacing: item.spacing }),
        ...(item.unit && { unit: item.unit })
      }));
      const updateTaxRate = typeof updateData.taxRate === 'number' ? (updateData.taxRate / 100) : 0;
      const discPct = parseFloat(updateData.discountPercent || 0);
      const discAmt = parseFloat(updateData.discountAmount || 0);
      const { subtotal, taxAmount, total } = calculateTotals(itemsWithAmounts, updateTaxRate, discPct, discAmt);
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
      const sub = existingQuote.subtotal;
      const tax = existingQuote.taxAmount;
      const discPct = parseFloat(updateData.discountPercent ?? existingQuote.discountPercent ?? 0);
      const discAmt = parseFloat(updateData.discountAmount ?? existingQuote.discountAmount ?? 0);
      const calculatedDiscount = discPct > 0 ? sub * discPct / 100 : discAmt;
      recalculatedFields = {
        ...recalculatedFields,
        discountPercent: discPct,
        discountAmount: parseFloat(calculatedDiscount.toFixed(2)),
        ...(updateData.discountLabel !== undefined && { discountLabel: updateData.discountLabel }),
        total: parseFloat((sub - calculatedDiscount + tax).toFixed(2))
      };
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        ...(updateData.quoteNumber && { quoteNumber: updateData.quoteNumber }),
        ...(updateData.date && { date: new Date(updateData.date) }),
        ...(updateData.validUntil && { validUntil: new Date(updateData.validUntil) }),
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

    success(res, quote, 'Sebut harga berjaya dikemaskini');
  } catch (err) {
    console.error('Error updating quote:', err);
    error(res, 'Ralat mengemaskini sebut harga');
  }
});

// POST /api/v1/quotes/:id/convert-to-invoice - Tukar sebut harga kepada invois
// Bagi pilihan tambahan `createDeliveryOrder: true` untuk terus cipta Delivery Order
// sekali dalam tindakan yang sama (quote diterima -> invois + DO serentak).
router.post('/:id/convert-to-invoice', [
  param('id').isString().withMessage('ID tidak sah'),
  body('dueDate').optional().isISO8601().withMessage('Format tarikh tempoh tidak sah'),
  body('createDeliveryOrder').optional().isBoolean().withMessage('createDeliveryOrder mestilah boolean'),
  body('deliveryDate').optional().isISO8601().withMessage('Format tarikh penghantaran tidak sah'),
  body('deliveryAddress').optional().isString().withMessage('Alamat penghantaran mestilah teks'),
  body('contactPerson').optional().isString().withMessage('Nama kontak mestilah teks'),
  body('contactPhone').optional().isMobilePhone('any').withMessage('Format telefon kontak tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { dueDate, createDeliveryOrder, deliveryDate, deliveryAddress, contactPerson, contactPhone } = req.body;
    const wantsDeliveryOrder = createDeliveryOrder === true || createDeliveryOrder === 'true';

    // Get quote (sertakan customer untuk default alamat/kontak DO jika diperlukan)
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, address: true, phone: true } }
      }
    });

    if (!quote) {
      return notFound(res, 'Sebut harga tidak ditemui');
    }

    if (quote.status !== 'ACCEPTED') {
      return badRequest(res, 'Hanya sebut harga yang diterima boleh ditukar kepada invois');
    }

    // Generate nombor invois (dan nombor DO jika diminta) mengikut sequence syarikat
    const invoiceNumber = await generateInvoiceNumber(quote.companyId);
    let doNumber = null;
    if (wantsDeliveryOrder) {
      const { generateDeliveryOrderNumber } = require('../utils/numberGenerator');
      doNumber = await generateDeliveryOrderNumber(quote.companyId);
    }

    // Cipta invois (dan delivery order jika diminta) dalam satu transaction Prisma -
    // jika penciptaan DO gagal separuh jalan, invois tidak akan "orphan" dalam database
    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          date: new Date(),
          dueDate: new Date(dueDate || Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
          subtotal: quote.subtotal,
          discountPercent: quote.discountPercent,
          discountAmount: quote.discountAmount,
          discountLabel: quote.discountLabel,
          taxAmount: quote.taxAmount,
          total: quote.total,
          notes: quote.notes,
          items: quote.items, // Copy items from quote
          companyId: quote.companyId,
          userId: quote.userId,
          customerId: quote.customerId,
          quoteId: quote.id
        },
        include: {
          company: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
          customer: { select: { id: true, name: true } },
          quote: { select: { id: true, quoteNumber: true } }
        }
      });

      let deliveryOrder = null;
      if (wantsDeliveryOrder) {
        const deliveryDetails = (quote.items || []).map(item => ({
          description: item.description,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          amount: parseFloat(item.quantity) * parseFloat(item.unitPrice),
          deliveredQty: 0 // Belum dihantar
        }));

        deliveryOrder = await tx.deliveryOrder.create({
          data: {
            doNumber,
            date: new Date(),
            deliveryDate: new Date(deliveryDate || Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 hari
            subtotal: invoice.subtotal,
            discountPercent: invoice.discountPercent,
            discountAmount: invoice.discountAmount,
            discountLabel: invoice.discountLabel,
            taxAmount: invoice.taxAmount,
            total: invoice.total,
            deliveryAddress: deliveryAddress || quote.customer?.address,
            contactPerson: contactPerson || quote.customer?.name,
            contactPhone: contactPhone || quote.customer?.phone,
            notes: `Created from Invoice ${invoice.invoiceNumber}`,
            companyId: quote.companyId,
            userId: quote.userId,
            customerId: quote.customerId,
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
      }

      return { invoice, deliveryOrder };
    });

    // Kekalkan bentuk respons sedia ada (invois sahaja) bila DO tidak diminta,
    // supaya flow convert-to-invoice sedia ada tidak terjejas.
    if (!result.deliveryOrder) {
      return success(res, result.invoice, 'Sebut harga berjaya ditukar kepada invois', 201);
    }

    success(res, result, 'Sebut harga berjaya ditukar kepada invois dan delivery order', 201);
  } catch (err) {
    console.error('Error converting quote to invoice:', err);
    error(res, 'Ralat menukar sebut harga kepada invois');
  }
});

// DELETE /api/v1/quotes/:id - Padam sebut harga
router.delete('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if quote exists
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
      include: {
        invoices: true
      }
    });

    if (!existingQuote) {
      return notFound(res, 'Sebut harga tidak ditemui');
    }

    // Check if quote has been converted to invoice
    if (existingQuote.invoices.length > 0) {
      return badRequest(res, 'Sebut harga tidak boleh dipadam kerana telah ditukar kepada invois');
    }

    // Delete quote (details will be deleted automatically due to cascade)
    await prisma.quote.delete({
      where: { id }
    });

    success(res, null, 'Sebut harga berjaya dipadam');
  } catch (err) {
    console.error('Error deleting quote:', err);
    error(res, 'Ralat memadam sebut harga');
  }
});

// POST /api/v1/quotes/:id/pdf - Generate PDF untuk quotation
router.post('/:id/pdf', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { generatePdf } = require('../utils/pdfGenerator');
    const pdfPath = await generatePdf('QUOTATION', id);
    success(res, { pdfPath }, 'PDF berjaya dijana');
  } catch (err) {
    console.error('Error generating quote PDF:', err);
    error(res, 'Ralat menjana PDF');
  }
});

// GET /api/v1/quotes/:id/pdf - Serve PDF untuk quotation (?preview=html untuk preview)
router.get('/:id/pdf', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = require('../utils/prisma');

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { company: true, customer: true }
    });

    if (!quote) return notFound(res, 'Sebut harga tidak ditemui');

    if (req.query.preview === 'html') {
      const { generateHTML } = require('../utils/pdfTemplate');
      const path = require('path');
      const fs = require('fs');
      const bank = quote.company?.bank || {};
      let logoData = '';
      const logoPath = path.join(__dirname, '..', 'public', 'logo', 'logo.png');
      try {
        if (fs.existsSync(logoPath)) {
          const ext = path.extname(logoPath).slice(1);
          logoData = `data:image/${ext};base64,${fs.readFileSync(logoPath).toString('base64')}`;
        }
      } catch (e) {}
      const html = generateHTML({
        documentType: 'QUOTATION',
        company: quote.company,
        logoData,
        customer: quote.customer,
        documentNumber: quote.quoteNumber,
        date: quote.date,
        validUntil: quote.validUntil,
        items: quote.items || [],
        subtotal: Number(quote.subtotal) || 0,
        discountPercent: Number(quote.discountPercent) || 0,
        discountAmount: Number(quote.discountAmount) || 0,
        discountLabel: quote.discountLabel,
        tax: Number(quote.taxAmount) || 0,
        total: Number(quote.total) || 0,
        bank,
        issuedBy: quote.issuedBy,
        notes: quote.notes
      });
      return res.send(html);
    }

    const { generatePdf, needsRegeneration, getPdfPath } = require('../utils/pdfGenerator');

    const needsGen = await needsRegeneration('QUOTATION', id);

    if (needsGen) {
      await generatePdf('QUOTATION', id);
    }

    const fullPath = getPdfPath('QUOTATION', id);
    const filename = quote?.quoteNumber ? `QUO-${quote.quoteNumber}.pdf` : `quote-${id}.pdf`;
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.sendFile(fullPath);
  } catch (err) {
    console.error('Error serving quote PDF:', err);
    error(res, 'Ralat mendapatkan PDF');
  }
});

// POST /api/v1/quotes/:id/email - Email PDF quotation
router.post('/:id/email', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { to } = req.body;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { company: true, customer: true }
    });

    if (!quote) return notFound(res, 'Sebut harga tidak ditemui');

    const recipient = to || quote.customer?.email;
    if (!recipient) return badRequest(res, 'Sila masukkan alamat emel penerima');

    const { generatePdf, getPdfPath } = require('../utils/pdfGenerator');
    const pdfPath = getPdfPath('QUOTATION', id);
    const { existsSync } = require('fs');
    if (!existsSync(pdfPath)) {
      await generatePdf('QUOTATION', id);
    }

    const { sendEmail } = require('../utils/email');
    const pdfBuffer = require('fs').readFileSync(pdfPath);

    await sendEmail({
      to: recipient,
      subject: `Quotation ${quote.quoteNumber} from ${quote.company?.name || ''}`,
      text: `Dear ${quote.customer?.name || ''},\n\nPlease find attached quotation ${quote.quoteNumber}.\n\nThank you.`,
      attachments: [{ filename: `QUO-${quote.quoteNumber}.pdf`, content: pdfBuffer }]
    });

    success(res, null, 'Emel berjaya dihantar');
  } catch (err) {
    console.error('Error emailing quote:', err);
    error(res, 'Ralat menghantar emel');
  }
});

// POST /api/v1/quotes/:id/whatsapp - Send PDF quotation via WhatsApp
router.post('/:id/whatsapp', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { phone } = req.body;

    if (!phone) return badRequest(res, 'Sila masukkan nombor telefon penerima');

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { company: true, customer: true }
    });

    if (!quote) return notFound(res, 'Sebut harga tidak ditemui');

    const { generatePdf, getPdfPath } = require('../utils/pdfGenerator');
    const pdfPath = getPdfPath('QUOTATION', id);
    const { existsSync } = require('fs');
    if (!existsSync(pdfPath)) {
      await generatePdf('QUOTATION', id);
    }

    const { getStatus, sendPdf, waitForQrCode } = require('../utils/whatsappClient');
    const status = getStatus();
    if (!status.ready) {
      await waitForQrCode();
      const updatedStatus = getStatus();
      if (updatedStatus.ready) {
        await sendPdf(phone, pdfPath, `Quotation ${quote.quoteNumber} from ${quote.company?.name || ''}`);
        return success(res, null, 'PDF berjaya dihantar melalui WhatsApp');
      }
      return success(res, { needsAuth: true, ...updatedStatus }, 'WhatsApp belum sedia. Sila imbas QR code.');
    }

    await sendPdf(phone, pdfPath, `Quotation ${quote.quoteNumber} from ${quote.company?.name || ''}`);

    success(res, null, 'PDF berjaya dihantar melalui WhatsApp');
  } catch (err) {
    console.error('Error sending quote via WhatsApp:', err);
    error(res, err.message || 'Ralat menghantar melalui WhatsApp');
  }
});

// POST /api/v1/quotes/:id/revise - Cipta revisi baru
router.post('/:id/revise', [
  param('id').isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params
    const original = await prisma.quote.findUnique({
      where: { id },
      include: { company: true }
    })
    if (!original) return notFound(res, 'Sebut harga tidak ditemui')

    const revCount = await prisma.quote.count({ where: { revisionOf: id } })
    const suffix = `-R${revCount + 1}`
    const newNumber = `${original.quoteNumber}${suffix}`

    const revised = await prisma.$transaction(async (tx) => {
      await tx.quote.update({
        where: { id },
        data: { status: 'REVISED' }
      })
      return tx.quote.create({
        data: {
          quoteNumber: newNumber,
          date: new Date(),
          validUntil: original.validUntil,
          status: 'DRAFT',
          items: original.items,
          subtotal: original.subtotal,
          discountPercent: original.discountPercent,
          discountAmount: original.discountAmount,
          discountLabel: original.discountLabel,
          taxAmount: original.taxAmount,
          total: original.total,
          notes: original.notes,
          companyId: original.companyId,
          userId: original.userId,
          customerId: original.customerId,
          revisionOf: id
        }
      })
    })
    success(res, revised, 'Revisi berjaya dicipta')
  } catch (err) {
    console.error('Error revising quote:', err)
    error(res, 'Ralat mencipta revisi')
  }
})

module.exports = router;
