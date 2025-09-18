const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest, conflict } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const createCustomerValidation = [
  body('name').notEmpty().withMessage('Customer name is required'),
  body('short').notEmpty().withMessage('Short name is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
  body('mobile').optional().isString().withMessage('Mobile must be a string'),
  body('address').optional().isString().withMessage('Address must be a string'),
  body('attn').optional().isString().withMessage('Attention must be a string'),
  body('taxNumber').optional().isString().withMessage('Tax number must be a string'),
  handleValidationErrors
];

const updateCustomerValidation = [
  param('id').isString().withMessage('Invalid ID'),
  body('name').optional().custom((value) => {
    if (value !== undefined && value !== null && value.trim() === '') {
      throw new Error('Customer name cannot be empty');
    }
    return true;
  }),
  body('short').optional().custom((value) => {
    if (value !== undefined && value !== null && value.trim() === '') {
      throw new Error('Short name cannot be empty');
    }
    return true;
  }),
  body('email').optional().custom((value) => {
    if (value && value !== null && value.trim() !== '') {
      return require('validator').isEmail(value);
    }
    return true;
  }).withMessage('Invalid email format'),
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
        // take: parseInt(limit),
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

// POST /api/v1/customers - Create new customer
router.post('/', createCustomerValidation, async (req, res) => {
  try {
    const { name, short, email, phone, mobile, address, attn, taxNumber } = req.body;

    // Check if customer with same email already exists (if email provided)
    if (email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { email }
      });

      if (existingCustomer) {
        return conflict(res, 'Customer with this email already exists');
      }
    }

    // Check if customer with same short name already exists
    const existingShortCustomer = await prisma.customer.findFirst({
      where: { short }
    });

    if (existingShortCustomer) {
      return conflict(res, 'Customer with this short name already exists');
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
        tempId: Math.floor(Math.random() * 1000000) // Generate random tempId
      }
    });

    success(res, customer, 'Customer created successfully', 201);
  } catch (err) {
    console.error('Error creating customer:', err);
    error(res, 'Error creating customer');
  }
});

// PUT /api/v1/customers/:id - Update customer
router.put('/:id', updateCustomerValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, short, email, phone, mobile, address, attn, taxNumber } = req.body;

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    });

    if (!existingCustomer) {
      return notFound(res, 'Customer not found');
    }

    // Check if another customer with same email exists (excluding current customer)
    if (email && email !== existingCustomer.email) {
      const duplicateCustomer = await prisma.customer.findFirst({
        where: { 
          email,
          id: { not: id }
        }
      });

      if (duplicateCustomer) {
        return conflict(res, 'Customer with this email already exists');
      }
    }

    // Check if another customer with same short name exists (excluding current customer)
    if (short && short !== existingCustomer.short) {
      const duplicateShortCustomer = await prisma.customer.findFirst({
        where: { 
          short,
          id: { not: id }
        }
      });

      if (duplicateShortCustomer) {
        return conflict(res, 'Customer with this short name already exists');
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

    success(res, customer, 'Customer updated successfully');
  } catch (err) {
    console.error('Error updating customer:', err);
    error(res, 'Error updating customer');
  }
});

// DELETE /api/v1/customers/:id - Delete customer
router.delete('/:id', [
  param('id').isString().withMessage('Invalid ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if customer exists
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
      return notFound(res, 'Customer not found');
    }

    // Check if customer has related records and count them
    const invoiceCount = existingCustomer.invoices.length;
    const receiptCount = existingCustomer.receipts.length;
    const quoteCount = existingCustomer.quotes.length;
    const paymentCount = existingCustomer.payments.length;
    const debtorCount = existingCustomer.debtors.length;
    
    const totalRelatedRecords = invoiceCount + receiptCount + quoteCount + paymentCount + debtorCount;

    if (totalRelatedRecords > 0) {
      // Build detailed message with counts
      let relatedDataMessage = `Cannot delete customer "${existingCustomer.name}". This customer is being used in:\n`;
      
      if (invoiceCount > 0) {
        relatedDataMessage += `- ${invoiceCount} invoice(s)\n`;
      }
      if (receiptCount > 0) {
        relatedDataMessage += `- ${receiptCount} receipt(s)\n`;
      }
      if (quoteCount > 0) {
        relatedDataMessage += `- ${quoteCount} quote(s)\n`;
      }
      if (paymentCount > 0) {
        relatedDataMessage += `- ${paymentCount} payment(s)\n`;
      }
      if (debtorCount > 0) {
        relatedDataMessage += `- ${debtorCount} debtor record(s)\n`;
      }
      
      relatedDataMessage += `\nTotal: ${totalRelatedRecords} record(s). Please remove or reassign these records before deleting the customer.`;
      
      return badRequest(res, relatedDataMessage);
    }

    await prisma.customer.delete({
      where: { id }
    });

    success(res, null, 'Customer deleted successfully');
  } catch (err) {
    console.error('Error deleting customer:', err);
    error(res, 'Error deleting customer');
  }
});

module.exports = router;
