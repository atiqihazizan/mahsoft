const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest, conflict } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const createCompanyValidation = [
  // Required fields
  body('name').notEmpty().withMessage('Nama syarikat diperlukan'),
  body('label').notEmpty().withMessage('Label syarikat diperlukan'),
  body('address').notEmpty().withMessage('Alamat syarikat diperlukan'),
  body('phone').notEmpty().withMessage('Nombor telefon diperlukan'),
  body('email').isEmail().withMessage('Format email tidak sah'),
  body('bankholder').notEmpty().withMessage('Pemegang akaun bank diperlukan'),
  body('bankname').notEmpty().withMessage('Nama bank diperlukan'),
  body('bankacc').notEmpty().withMessage('Nombor akaun bank diperlukan'),
  body('bankbranch').notEmpty().withMessage('Cawangan bank diperlukan'),
  body('ssm').notEmpty().withMessage('Nombor pendaftaran SSM diperlukan'),
  body('manager').notEmpty().withMessage('Nama pengurus diperlukan'),
  
  // Optional fields
  body('taxNumber').optional().isString().withMessage('Nombor cukai mestilah teks'),
  body('assist').optional().isString().withMessage('Assistant mestilah teks'),
  body('accountant').optional().isString().withMessage('Accountant mestilah teks'),
  body('technical').optional().isString().withMessage('Technical mestilah teks'),
  
  // Prefix fields - allow null and empty strings
  body('invoicePrefix').optional().custom((value) => {
    if (value === null || value === undefined || typeof value === 'string') return true;
    throw new Error('Invoice prefix mestilah teks atau null');
  }),
  body('quotePrefix').optional().custom((value) => {
    if (value === null || value === undefined || typeof value === 'string') return true;
    throw new Error('Quote prefix mestilah teks atau null');
  }),
  body('receiptPrefix').optional().custom((value) => {
    if (value === null || value === undefined || typeof value === 'string') return true;
    throw new Error('Receipt prefix mestilah teks atau null');
  }),
  body('deliveryOrderPrefix').optional().custom((value) => {
    if (value === null || value === undefined || typeof value === 'string') return true;
    throw new Error('Delivery order prefix mestilah teks atau null');
  }),
  
  // Sequence fields - allow empty strings and convert to 0
  body('invoiceSeq').optional().custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    const num = parseInt(value);
    if (isNaN(num) || num < 0) throw new Error('Invoice sequence mestilah nombor positif');
    return true;
  }),
  body('quoteSeq').optional().custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    const num = parseInt(value);
    if (isNaN(num) || num < 0) throw new Error('Quote sequence mestilah nombor positif');
    return true;
  }),
  body('receiptSeq').optional().custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    const num = parseInt(value);
    if (isNaN(num) || num < 0) throw new Error('Receipt sequence mestilah nombor positif');
    return true;
  }),
  body('deliveryOrderSeq').optional().custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    const num = parseInt(value);
    if (isNaN(num) || num < 0) throw new Error('Delivery order sequence mestilah nombor positif');
    return true;
  }),
  handleValidationErrors
];

const updateCompanyValidation = [
  param('id').isString().withMessage('ID tidak sah'),
  
  // Required fields - must not be empty if provided
  body('name').optional().notEmpty().withMessage('Nama syarikat tidak boleh kosong'),
  body('label').optional().notEmpty().withMessage('Label syarikat tidak boleh kosong'),
  body('address').optional().notEmpty().withMessage('Alamat syarikat tidak boleh kosong'),
  body('phone').optional().notEmpty().withMessage('Nombor telefon tidak boleh kosong'),
  body('email').optional().isEmail().withMessage('Format email tidak sah'),
  body('bankholder').optional().notEmpty().withMessage('Pemegang akaun bank tidak boleh kosong'),
  body('bankname').optional().notEmpty().withMessage('Nama bank tidak boleh kosong'),
  body('bankacc').optional().notEmpty().withMessage('Nombor akaun bank tidak boleh kosong'),
  body('bankbranch').optional().notEmpty().withMessage('Cawangan bank tidak boleh kosong'),
  body('ssm').optional().notEmpty().withMessage('Nombor pendaftaran SSM tidak boleh kosong'),
  body('manager').optional().notEmpty().withMessage('Nama pengurus tidak boleh kosong'),
  
  // Optional fields
  body('taxNumber').optional().isString().withMessage('Nombor cukai mestilah teks'),
  body('assist').optional().isString().withMessage('Assistant mestilah teks'),
  body('accountant').optional().isString().withMessage('Accountant mestilah teks'),
  body('technical').optional().isString().withMessage('Technical mestilah teks'),
  
  // Prefix fields - allow null and empty strings
  body('invoicePrefix').optional().custom((value) => {
    if (value === null || value === undefined || typeof value === 'string') return true;
    throw new Error('Invoice prefix mestilah teks atau null');
  }),
  body('quotePrefix').optional().custom((value) => {
    if (value === null || value === undefined || typeof value === 'string') return true;
    throw new Error('Quote prefix mestilah teks atau null');
  }),
  body('receiptPrefix').optional().custom((value) => {
    if (value === null || value === undefined || typeof value === 'string') return true;
    throw new Error('Receipt prefix mestilah teks atau null');
  }),
  body('deliveryOrderPrefix').optional().custom((value) => {
    if (value === null || value === undefined || typeof value === 'string') return true;
    throw new Error('Delivery order prefix mestilah teks atau null');
  }),
  
  // Sequence fields - allow empty strings and convert to 0
  body('invoiceSeq').optional().custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    const num = parseInt(value);
    if (isNaN(num) || num < 0) throw new Error('Invoice sequence mestilah nombor positif');
    return true;
  }),
  body('quoteSeq').optional().custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    const num = parseInt(value);
    if (isNaN(num) || num < 0) throw new Error('Quote sequence mestilah nombor positif');
    return true;
  }),
  body('receiptSeq').optional().custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    const num = parseInt(value);
    if (isNaN(num) || num < 0) throw new Error('Receipt sequence mestilah nombor positif');
    return true;
  }),
  body('deliveryOrderSeq').optional().custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    const num = parseInt(value);
    if (isNaN(num) || num < 0) throw new Error('Delivery order sequence mestilah nombor positif');
    return true;
  }),
  handleValidationErrors
];

// GET /api/v1/companies - Dapatkan semua syarikat
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { label: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { manager: { contains: search, mode: 'insensitive' } },
        { ssm: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.company.count({ where })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    success(res, {
      companies,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Senarai syarikat berjaya diambil');
  } catch (err) {
    console.error('Error fetching companies:', err);
    error(res, 'Ralat mengambil senarai syarikat');
  }
});

// GET /api/v1/companies/:id - Dapatkan syarikat mengikut ID
router.get('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        invoices: { take: 5, orderBy: { createdAt: 'desc' } },
        receipts: { take: 5, orderBy: { createdAt: 'desc' } },
        quotes: { take: 5, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!company) {
      return notFound(res, 'Syarikat tidak ditemui');
    }

    success(res, company, 'Syarikat berjaya diambil');
  } catch (err) {
    console.error('Error fetching company:', err);
    error(res, 'Ralat mengambil syarikat');
  }
});

// POST /api/v1/companies - Cipta syarikat baru
router.post('/', createCompanyValidation, async (req, res) => {
  try {
    const { 
      name, label, address, phone, email, taxNumber,
      bankholder, bankname, bankacc, bankbranch,
      ssm, manager, assist, accountant, technical,
      // Prefix and Sequence fields
      invoicePrefix, quotePrefix, receiptPrefix, deliveryOrderPrefix,
      invoiceSeq, quoteSeq, receiptSeq, deliveryOrderSeq
    } = req.body;

    // Check if company with same name already exists
    const existingCompany = await prisma.company.findFirst({
      where: { name }
    });

    if (existingCompany) {
      return conflict(res, 'Syarikat dengan nama ini sudah wujud');
    }

    const company = await prisma.company.create({
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
        // Prefix and Sequence fields
        invoicePrefix,
        quotePrefix,
        receiptPrefix,
        deliveryOrderPrefix,
        invoiceSeq,
        quoteSeq,
        receiptSeq,
        deliveryOrderSeq
      }
    });

    success(res, company, 'Syarikat berjaya dicipta', 201);
  } catch (err) {
    console.error('Error creating company:', err);
    error(res, 'Ralat mencipta syarikat');
  }
});

// PUT /api/v1/companies/:id - Kemaskini syarikat
router.put('/:id', updateCompanyValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, label, address, phone, email, taxNumber,
      bankholder, bankname, bankacc, bankbranch,
      ssm, manager, assist, accountant, technical,
      // Prefix and Sequence fields
      invoicePrefix, quotePrefix, receiptPrefix, deliveryOrderPrefix,
      invoiceSeq, quoteSeq, receiptSeq, deliveryOrderSeq
    } = req.body;

    // Convert empty strings to 0 for sequence numbers
    const processedData = {
      ...(name && { name }),
      ...(label !== undefined && { label }),
      ...(address !== undefined && { address }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(taxNumber !== undefined && { taxNumber }),
      ...(bankholder !== undefined && { bankholder }),
      ...(bankname !== undefined && { bankname }),
      ...(bankacc !== undefined && { bankacc }),
      ...(bankbranch !== undefined && { bankbranch }),
      ...(ssm !== undefined && { ssm }),
      ...(manager !== undefined && { manager }),
      ...(assist !== undefined && { assist }),
      ...(accountant !== undefined && { accountant }),
      ...(technical !== undefined && { technical }),
      // Prefix and Sequence fields
      ...(invoicePrefix !== undefined && { invoicePrefix }),
      ...(quotePrefix !== undefined && { quotePrefix }),
      ...(receiptPrefix !== undefined && { receiptPrefix }),
      ...(deliveryOrderPrefix !== undefined && { deliveryOrderPrefix }),
      ...(invoiceSeq !== undefined && { invoiceSeq: invoiceSeq === '' ? 0 : parseInt(invoiceSeq) }),
      ...(quoteSeq !== undefined && { quoteSeq: quoteSeq === '' ? 0 : parseInt(quoteSeq) }),
      ...(receiptSeq !== undefined && { receiptSeq: receiptSeq === '' ? 0 : parseInt(receiptSeq) }),
      ...(deliveryOrderSeq !== undefined && { deliveryOrderSeq: deliveryOrderSeq === '' ? 0 : parseInt(deliveryOrderSeq) })
    };


    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id }
    });

    if (!existingCompany) {
      return notFound(res, 'Syarikat tidak ditemui');
    }

    // Check if another company with same name exists (excluding current company)
    if (name && name !== existingCompany.name) {
      const duplicateCompany = await prisma.company.findFirst({
        where: { 
          name,
          id: { not: id }
        }
      });

      if (duplicateCompany) {
        return conflict(res, 'Syarikat dengan nama ini sudah wujud');
      }
    }

    const company = await prisma.company.update({
      where: { id },
      data: processedData
    });

    success(res, company, 'Syarikat berjaya dikemaskini');
  } catch (err) {
    console.error('Error updating company:', err);
    error(res, 'Ralat mengemaskini syarikat');
  }
});

// DELETE /api/v1/companies/:id - Padam syarikat
router.delete('/:id', [
  param('id').isString().withMessage('ID tidak sah'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
      include: {
        invoices: true,
        receipts: true,
        quotes: true,
        deliveryOrders: true
      }
    });

    if (!existingCompany) {
      return notFound(res, 'Syarikat tidak ditemui');
    }

    // Count related records
    const invoiceCount = existingCompany.invoices.length;
    const receiptCount = existingCompany.receipts.length;
    const quoteCount = existingCompany.quotes.length;
    const deliveryOrderCount = existingCompany.deliveryOrders.length;

    const totalRelatedRecords = invoiceCount + receiptCount + quoteCount + deliveryOrderCount;

    if (totalRelatedRecords > 0) {
      let relatedDataMessage = `Cannot delete company "${existingCompany.name}". This company is being used in:\n`;
      if (invoiceCount > 0) { relatedDataMessage += `- ${invoiceCount} invoice(s)\n`; }
      if (receiptCount > 0) { relatedDataMessage += `- ${receiptCount} receipt(s)\n`; }
      if (quoteCount > 0) { relatedDataMessage += `- ${quoteCount} quote(s)\n`; }
      if (deliveryOrderCount > 0) { relatedDataMessage += `- ${deliveryOrderCount} delivery order(s)\n`; }
      relatedDataMessage += `\nTotal: ${totalRelatedRecords} record(s). Please remove or reassign these records before deleting the company.`;
      return badRequest(res, relatedDataMessage);
    }

    await prisma.company.delete({
      where: { id }
    });

    success(res, null, 'Syarikat berjaya dipadam');
  } catch (err) {
    console.error('Error deleting company:', err);
    error(res, 'Ralat memadam syarikat');
  }
});

// GET /api/v1/companies/test-update/:id - Test update company
router.get('/test-update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Testing update for company ID:', id);
    
    const testData = {
      invoicePrefix: 'INV',
      quotePrefix: 'QT',
      receiptPrefix: 'RCP',
      deliveryOrderPrefix: 'DO',
      invoiceSeq: 1,
      quoteSeq: 1,
      receiptSeq: 1,
      deliveryOrderSeq: 1
    };
    
    console.log('Test data:', testData);
    
    const company = await prisma.company.update({
      where: { id },
      data: testData
    });
    
    success(res, company, 'Test update berjaya');
  } catch (err) {
    console.error('Test update error:', err);
    error(res, 'Test update gagal: ' + err.message);
  }
});

// GET /api/v1/companies/prefixes/total - Dapatkan total prefix semua company
router.get('/prefixes/total', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        label: true,
        invoicePrefix: true,
        quotePrefix: true,
        receiptPrefix: true,
        deliveryOrderPrefix: true,
        invoiceSeq: true,
        quoteSeq: true,
        receiptSeq: true,
        deliveryOrderSeq: true
      }
    });

    const currentYear = new Date().getFullYear();
    
    const prefixTotals = companies.map(company => {
      const formatPrefix = (prefix, seq) => {
        if (!prefix) return `${seq + 1}`;
        const hasYearCode = prefix.includes('[yyyy]') || prefix.includes('[yy]') || prefix.includes('[year]');
        if (hasYearCode) {
          const formattedPrefix = prefix
            .replace('[yyyy]', currentYear.toString())
            .replace('[yy]', currentYear.toString().slice(-2))
            .replace('[year]', currentYear.toString());
          return `${formattedPrefix}${(seq + 1).toString().padStart(4, '0')}`;
        }
        return `${prefix}${currentYear}${(seq + 1).toString().padStart(4, '0')}`;
      };

      return {
        id: company.id,
        name: company.name,
        label: company.label,
        prefixes: {
          invoice: {
            prefix: company.invoicePrefix || 'N/A',
            sequence: company.invoiceSeq || 0,
            nextNumber: formatPrefix(company.invoicePrefix, company.invoiceSeq)
          },
          quote: {
            prefix: company.quotePrefix || 'N/A',
            sequence: company.quoteSeq || 0,
            nextNumber: formatPrefix(company.quotePrefix, company.quoteSeq)
          },
          receipt: {
            prefix: company.receiptPrefix || 'N/A',
            sequence: company.receiptSeq || 0,
            nextNumber: formatPrefix(company.receiptPrefix, company.receiptSeq)
          },
          deliveryOrder: {
            prefix: company.deliveryOrderPrefix || 'N/A',
            sequence: company.deliveryOrderSeq || 0,
            nextNumber: formatPrefix(company.deliveryOrderPrefix, company.deliveryOrderSeq)
          }
        }
      };
    });

    // Calculate overall totals
    const overallTotals = {
      totalCompanies: companies.length,
      totalInvoices: companies.reduce((sum, c) => sum + (c.invoiceSeq || 0), 0),
      totalQuotes: companies.reduce((sum, c) => sum + (c.quoteSeq || 0), 0),
      totalReceipts: companies.reduce((sum, c) => sum + (c.receiptSeq || 0), 0),
      totalDeliveryOrders: companies.reduce((sum, c) => sum + (c.deliveryOrderSeq || 0), 0),
      currentYear
    };

    success(res, {
      companies: prefixTotals,
      totals: overallTotals
    }, 'Total prefix company berjaya diambil');

  } catch (err) {
    console.error('Error getting company prefix totals:', err);
    error(res, 'Ralat mengambil total prefix company');
  }
});

module.exports = router;
