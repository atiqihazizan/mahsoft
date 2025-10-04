const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest, conflict } = require('../utils/response');
const { handleValidationErrors } = require('../middleware/validation');
const { generateDeliveryOrderNumber } = require('../utils/numberGenerator');
const { authenticateToken } = require('../utils/auth');

// Validation rules
const createDeliveryOrderValidation = [
  body('companyId').notEmpty().withMessage('Company ID diperlukan'),
  body('userId').notEmpty().withMessage('User ID diperlukan'),
  body('customerId').notEmpty().withMessage('Customer ID diperlukan'),
  body('date').isISO8601().withMessage('Format tarikh tidak sah'),
  body('deliveryDate').isISO8601().withMessage('Format tarikh penghantaran tidak sah'),
  body('deliveryAddress').optional().isString().withMessage('Alamat penghantaran mestilah teks'),
  body('contactPerson').optional().isString().withMessage('Nama kontak mestilah teks'),
  body('contactPhone').optional().isMobilePhone('any').withMessage('Format telefon kontak tidak sah'),
  body('details').isArray({ min: 1 }).withMessage('Sekurang-kurangnya satu item diperlukan'),
  body('details.*.description').notEmpty().withMessage('Penerangan item diperlukan'),
  body('details.*.quantity').isNumeric().withMessage('Kuantiti mestilah nombor'),
  body('details.*.unitPrice').isNumeric().withMessage('Harga unit mestilah nombor'),
  handleValidationErrors
];

const updateDeliveryOrderValidation = [
  param('id').isString().withMessage('ID tidak sah'),
  body('date').optional().isISO8601().withMessage('Format tarikh tidak sah'),
  body('deliveryDate').optional().isISO8601().withMessage('Format tarikh penghantaran tidak sah'),
  body('status').optional().isIn(['DRAFT', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']).withMessage('Status tidak sah'),
  body('deliveryAddress').optional().isString().withMessage('Alamat penghantaran mestilah teks'),
  body('contactPerson').optional().isString().withMessage('Nama kontak mestilah teks'),
  body('contactPhone').optional().isMobilePhone('any').withMessage('Format telefon kontak tidak sah'),
  handleValidationErrors
];

// GET /api/v1/delivery-orders - Dapatkan semua delivery orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, companyId, customerId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(search && {
        OR: [
          { doNumber: { contains: search, mode: 'insensitive' } },
          { contactPerson: { contains: search, mode: 'insensitive' } },
          { customer: { name: { contains: search, mode: 'insensitive' } } }
        ]
      }),
      ...(status && { status }),
      ...(companyId && { companyId }),
      ...(customerId && { customerId })
    };

    const [deliveryOrders, total] = await Promise.all([
      prisma.deliveryOrder.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          company: {
            select: { name: true, label: true }
          },
          customer: {
            select: { name: true, email: true, phone: true }
          },
          user: {
            select: { name: true, email: true }
          },
          invoice: {
            select: { invoiceNumber: true, total: true }
          },
          details: {
            select: {
              id: true,
              description: true,
              quantity: true,
              unitPrice: true,
              amount: true,
              deliveredQty: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.deliveryOrder.count({ where })
    ]);

    success(res, {
      deliveryOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Delivery orders retrieved successfully');

  } catch (err) {
    console.error('Error getting delivery orders:', err);
    error(res, 'Ralat mendapatkan delivery orders');
  }
});

// GET /api/v1/delivery-orders/:id - Dapatkan delivery order tertentu
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryOrder = await prisma.deliveryOrder.findUnique({
      where: { id },
      include: {
        company: {
          select: { name: true, label: true, address: true, phone: true }
        },
        customer: {
          select: { name: true, email: true, phone: true, address: true }
        },
        user: {
          select: { name: true, email: true }
        },
        invoice: {
          select: { 
            invoiceNumber: true, 
            total: true, 
            date: true,
            dueDate: true
          }
        },
        details: {
          select: {
            id: true,
            description: true,
            quantity: true,
            unitPrice: true,
            amount: true,
            deliveredQty: true
          }
        }
      }
    });

    if (!deliveryOrder) {
      return notFound(res, 'Delivery order tidak dijumpai');
    }

    success(res, deliveryOrder, 'Delivery order retrieved successfully');

  } catch (err) {
    console.error('Error getting delivery order:', err);
    error(res, 'Ralat mendapatkan delivery order');
  }
});

// POST /api/v1/delivery-orders - Cipta delivery order baru
router.post('/', authenticateToken, createDeliveryOrderValidation, async (req, res) => {
  try {
    const {
      companyId,
      userId,
      customerId,
      invoiceId,
      date,
      deliveryDate,
      deliveryAddress,
      contactPerson,
      contactPhone,
      details,
      notes
    } = req.body;

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });
    if (!company) {
      return notFound(res, 'Company tidak dijumpai');
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });
    if (!customer) {
      return notFound(res, 'Customer tidak dijumpai');
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      return notFound(res, 'User tidak dijumpai');
    }

    // Check if invoice exists (if provided)
    if (invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId }
      });
      if (!invoice) {
        return notFound(res, 'Invoice tidak dijumpai');
      }
    }

    // Generate delivery order number
    const doNumber = await generateDeliveryOrderNumber(companyId);

    // Calculate totals
    let subtotal = 0;
    const processedDetails = details.map(detail => {
      const amount = parseFloat(detail.quantity) * parseFloat(detail.unitPrice);
      subtotal += amount;
      return {
        description: detail.description,
        quantity: parseFloat(detail.quantity),
        unitPrice: parseFloat(detail.unitPrice),
        amount: amount,
        deliveredQty: 0
      };
    });

    const taxAmount = subtotal * 0.06; // 6% tax
    const total = subtotal + taxAmount;

    // Create delivery order with details
    const deliveryOrder = await prisma.deliveryOrder.create({
      data: {
        doNumber,
        date: new Date(date),
        deliveryDate: new Date(deliveryDate),
        subtotal,
        taxAmount,
        total,
        deliveryAddress,
        contactPerson,
        contactPhone,
        notes,
        companyId,
        userId,
        customerId,
        invoiceId: invoiceId || null,
        details: {
          create: processedDetails
        }
      },
      include: {
        company: {
          select: { name: true, label: true }
        },
        customer: {
          select: { name: true, email: true, phone: true }
        },
        user: {
          select: { name: true, email: true }
        },
        invoice: {
          select: { invoiceNumber: true, total: true }
        },
        details: true
      }
    });

    success(res, deliveryOrder, 'Delivery order berjaya dicipta', 201);

  } catch (err) {
    console.error('Error creating delivery order:', err);
    error(res, 'Ralat mencipta delivery order');
  }
});

// PUT /api/v1/delivery-orders/:id - Kemaskini delivery order
router.put('/:id', authenticateToken, updateDeliveryOrderValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      date,
      deliveryDate,
      status,
      deliveryAddress,
      contactPerson,
      contactPhone,
      notes
    } = req.body;

    // Check if delivery order exists
    const existingDeliveryOrder = await prisma.deliveryOrder.findUnique({
      where: { id }
    });

    if (!existingDeliveryOrder) {
      return notFound(res, 'Delivery order tidak dijumpai');
    }

    const deliveryOrder = await prisma.deliveryOrder.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(deliveryDate && { deliveryDate: new Date(deliveryDate) }),
        ...(status && { status }),
        ...(deliveryAddress !== undefined && { deliveryAddress }),
        ...(contactPerson !== undefined && { contactPerson }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(notes !== undefined && { notes })
      },
      include: {
        company: {
          select: { name: true, label: true }
        },
        customer: {
          select: { name: true, email: true, phone: true }
        },
        user: {
          select: { name: true, email: true }
        },
        invoice: {
          select: { invoiceNumber: true, total: true }
        },
        details: true
      }
    });

    success(res, deliveryOrder, 'Delivery order berjaya dikemaskini');

  } catch (err) {
    console.error('Error updating delivery order:', err);
    error(res, 'Ralat mengemaskini delivery order');
  }
});

// POST /api/v1/delivery-orders/:id/update-delivery - Update delivery quantity
router.post('/:id/update-delivery', authenticateToken, [
  param('id').isString().withMessage('ID tidak sah'),
  body('details').isArray().withMessage('Details mestilah array'),
  body('details.*.id').notEmpty().withMessage('Detail ID diperlukan'),
  body('details.*.deliveredQty').isNumeric().withMessage('Delivered quantity mestilah nombor'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { details } = req.body;

    // Check if delivery order exists
    const existingDeliveryOrder = await prisma.deliveryOrder.findUnique({
      where: { id }
    });

    if (!existingDeliveryOrder) {
      return notFound(res, 'Delivery order tidak dijumpai');
    }

    // Update delivery quantities
    for (const detail of details) {
      await prisma.deliveryDetail.update({
        where: { id: detail.id },
        data: { deliveredQty: parseFloat(detail.deliveredQty) }
      });
    }

    // Check if all items are delivered
    const updatedDeliveryOrder = await prisma.deliveryOrder.findUnique({
      where: { id },
      include: { details: true }
    });

    const allDelivered = updatedDeliveryOrder.details.every(
      detail => detail.deliveredQty >= detail.quantity
    );

    // Update status to DELIVERED if all items are delivered
    if (allDelivered && updatedDeliveryOrder.status !== 'DELIVERED') {
      await prisma.deliveryOrder.update({
        where: { id },
        data: { status: 'DELIVERED' }
      });
    }

    success(res, { message: 'Delivery quantities updated successfully' }, 'Delivery quantities berjaya dikemaskini');

  } catch (err) {
    console.error('Error updating delivery quantities:', err);
    error(res, 'Ralat mengemaskini delivery quantities');
  }
});

// DELETE /api/v1/delivery-orders/:id - Padam delivery order
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if delivery order exists
    const existingDeliveryOrder = await prisma.deliveryOrder.findUnique({
      where: { id }
    });

    if (!existingDeliveryOrder) {
      return notFound(res, 'Delivery order tidak dijumpai');
    }

    // Check if delivery order can be deleted (only DRAFT status)
    if (existingDeliveryOrder.status !== 'DRAFT') {
      return badRequest(res, 'Hanya delivery order dengan status DRAFT boleh dipadam');
    }

    await prisma.deliveryOrder.delete({
      where: { id }
    });

    success(res, null, 'Delivery order berjaya dipadam');

  } catch (err) {
    console.error('Error deleting delivery order:', err);
    error(res, 'Ralat memadam delivery order');
  }
});

// GET /api/v1/delivery-orders/summary - Ringkasan delivery orders
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { companyId, status } = req.query;

    const where = {
      ...(companyId && { companyId }),
      ...(status && { status })
    };

    const [
      totalDeliveryOrders,
      draftCount,
      confirmedCount,
      inTransitCount,
      deliveredCount,
      cancelledCount
    ] = await Promise.all([
      prisma.deliveryOrder.count({ where }),
      prisma.deliveryOrder.count({ where: { ...where, status: 'DRAFT' } }),
      prisma.deliveryOrder.count({ where: { ...where, status: 'CONFIRMED' } }),
      prisma.deliveryOrder.count({ where: { ...where, status: 'IN_TRANSIT' } }),
      prisma.deliveryOrder.count({ where: { ...where, status: 'DELIVERED' } }),
      prisma.deliveryOrder.count({ where: { ...where, status: 'CANCELLED' } })
    ]);

    const summary = {
      total: totalDeliveryOrders,
      byStatus: {
        draft: draftCount,
        confirmed: confirmedCount,
        inTransit: inTransitCount,
        delivered: deliveredCount,
        cancelled: cancelledCount
      }
    };

    success(res, summary, 'Delivery orders summary retrieved successfully');

  } catch (err) {
    console.error('Error getting delivery orders summary:', err);
    error(res, 'Ralat mendapatkan delivery orders summary');
  }
});

module.exports = router;
