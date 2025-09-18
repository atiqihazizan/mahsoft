const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { success, error, notFound, badRequest } = require('../utils/response');

// GET /api/v1/outstanding/invoices - Semak outstanding invoices
router.get('/invoices', async (req, res) => {
  try {
    const { companyId, customerId, status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      status: { not: 'PAID' }, // Hanya invoice yang belum dibayar penuh
      ...(companyId && { companyId }),
      ...(customerId && { customerId }),
      ...(status && { status })
    };

    // Get outstanding invoices
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
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
          payments: {
            select: { amount: true, date: true, method: true }
          }
        },
        orderBy: { dueDate: 'asc' }
      }),
      prisma.invoice.count({ where })
    ]);

    // Calculate outstanding amounts
    const invoicesWithOutstanding = invoices.map(invoice => {
      const totalPaid = invoice.payments.reduce((sum, payment) => 
        sum + parseFloat(payment.amount), 0
      );
      const outstandingAmount = parseFloat(invoice.total) - totalPaid;
      const isOverdue = new Date() > new Date(invoice.dueDate) && outstandingAmount > 0;

      return {
        ...invoice,
        totalPaid,
        outstandingAmount,
        isOverdue,
        daysOverdue: isOverdue ? 
          Math.ceil((new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24)) : 0
      };
    });

    // Calculate summary
    const totalOutstanding = invoicesWithOutstanding.reduce((sum, invoice) => 
      sum + invoice.outstandingAmount, 0
    );
    const overdueCount = invoicesWithOutstanding.filter(invoice => invoice.isOverdue).length;
    const overdueAmount = invoicesWithOutstanding
      .filter(invoice => invoice.isOverdue)
      .reduce((sum, invoice) => sum + invoice.outstandingAmount, 0);

    const summary = {
      totalInvoices: total,
      totalOutstanding,
      overdueCount,
      overdueAmount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    };

    success(res, {
      invoices: invoicesWithOutstanding,
      summary
    }, 'Outstanding invoices retrieved successfully');

  } catch (err) {
    console.error('Error getting outstanding invoices:', err);
    error(res, 'Ralat mendapatkan outstanding invoices');
  }
});

// GET /api/v1/outstanding/debtors - Semak outstanding debtors
router.get('/debtors', async (req, res) => {
  try {
    const { customerId, supplierId, status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      status: { not: 'PAID' }, // Hanya debtor yang belum dibayar
      ...(customerId && { customerId }),
      ...(supplierId && { supplierId }),
      ...(status && { status })
    };

    // Get outstanding debtors
    const [debtors, total] = await Promise.all([
      prisma.debtor.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          customer: {
            select: { name: true, email: true, phone: true }
          },
          supplier: {
            select: { name: true, email: true, phone: true }
          },
          invoice: {
            select: { 
              invoiceNumber: true, 
              total: true, 
              dueDate: true,
              company: { select: { name: true, label: true } }
            }
          },
          receipt: {
            select: { 
              receiptNumber: true, 
              total: true,
              company: { select: { name: true, label: true } }
            }
          }
        },
        orderBy: { dueDate: 'asc' }
      }),
      prisma.debtor.count({ where })
    ]);

    // Calculate outstanding amounts and overdue status
    const debtorsWithOutstanding = debtors.map(debtor => {
      const isOverdue = new Date() > new Date(debtor.dueDate) && debtor.status !== 'PAID';
      const daysOverdue = isOverdue ? 
        Math.ceil((new Date() - new Date(debtor.dueDate)) / (1000 * 60 * 60 * 24)) : 0;

      return {
        ...debtor,
        isOverdue,
        daysOverdue
      };
    });

    // Calculate summary
    const totalOutstanding = debtorsWithOutstanding.reduce((sum, debtor) => 
      sum + parseFloat(debtor.amount), 0
    );
    const overdueCount = debtorsWithOutstanding.filter(debtor => debtor.isOverdue).length;
    const overdueAmount = debtorsWithOutstanding
      .filter(debtor => debtor.isOverdue)
      .reduce((sum, debtor) => sum + parseFloat(debtor.amount), 0);

    const summary = {
      totalDebtors: total,
      totalOutstanding,
      overdueCount,
      overdueAmount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    };

    success(res, {
      debtors: debtorsWithOutstanding,
      summary
    }, 'Outstanding debtors retrieved successfully');

  } catch (err) {
    console.error('Error getting outstanding debtors:', err);
    error(res, 'Ralat mendapatkan outstanding debtors');
  }
});

// GET /api/v1/outstanding/summary - Ringkasan outstanding keseluruhan
router.get('/summary', async (req, res) => {
  try {
    const { companyId } = req.query;

    // Build where clause
    const where = companyId ? { companyId } : {};

    // Get outstanding invoices
    const outstandingInvoices = await prisma.invoice.findMany({
      where: {
        ...where,
        status: { not: 'PAID' }
      },
      include: {
        payments: {
          select: { amount: true }
        }
      }
    });

    // Get outstanding debtors
    const outstandingDebtors = await prisma.debtor.findMany({
      where: {
        ...where,
        status: { not: 'PAID' }
      }
    });

    // Calculate invoice outstanding
    const invoiceOutstanding = outstandingInvoices.map(invoice => {
      const totalPaid = invoice.payments.reduce((sum, payment) => 
        sum + parseFloat(payment.amount), 0
      );
      return parseFloat(invoice.total) - totalPaid;
    }).reduce((sum, amount) => sum + amount, 0);

    // Calculate debtor outstanding
    const debtorOutstanding = outstandingDebtors.reduce((sum, debtor) => 
      sum + parseFloat(debtor.amount), 0
    );

    // Calculate overdue amounts
    const now = new Date();
    const overdueInvoices = outstandingInvoices.filter(invoice => {
      const totalPaid = invoice.payments.reduce((sum, payment) => 
        sum + parseFloat(payment.amount), 0
      );
      const outstanding = parseFloat(invoice.total) - totalPaid;
      return now > new Date(invoice.dueDate) && outstanding > 0;
    });

    const overdueDebtors = outstandingDebtors.filter(debtor => 
      now > new Date(debtor.dueDate)
    );

    const overdueInvoiceAmount = overdueInvoices.map(invoice => {
      const totalPaid = invoice.payments.reduce((sum, payment) => 
        sum + parseFloat(payment.amount), 0
      );
      return parseFloat(invoice.total) - totalPaid;
    }).reduce((sum, amount) => sum + amount, 0);

    const overdueDebtorAmount = overdueDebtors.reduce((sum, debtor) => 
      sum + parseFloat(debtor.amount), 0
    );

    const summary = {
      invoices: {
        total: outstandingInvoices.length,
        outstandingAmount: invoiceOutstanding,
        overdueCount: overdueInvoices.length,
        overdueAmount: overdueInvoiceAmount
      },
      debtors: {
        total: outstandingDebtors.length,
        overdueCount: overdueDebtors.length,
        overdueAmount: overdueDebtorAmount
      },
      overall: {
        totalOutstanding: invoiceOutstanding + debtorOutstanding,
        totalOverdue: overdueInvoiceAmount + overdueDebtorAmount,
        totalOverdueCount: overdueInvoices.length + overdueDebtors.length
      }
    };

    success(res, summary, 'Outstanding summary retrieved successfully');

  } catch (err) {
    console.error('Error getting outstanding summary:', err);
    error(res, 'Ralat mendapatkan outstanding summary');
  }
});

// GET /api/v1/outstanding/customer/:id - Outstanding untuk customer tertentu
router.get('/customer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { name: true, email: true, phone: true }
    });

    if (!customer) {
      return notFound(res, 'Customer tidak dijumpai');
    }

    // Get outstanding invoices for this customer
    const [invoices, invoiceTotal] = await Promise.all([
      prisma.invoice.findMany({
        where: {
          customerId: id,
          status: { not: 'PAID' }
        },
        skip,
        take: parseInt(limit),
        include: {
          company: { select: { name: true, label: true } },
          payments: { select: { amount: true, date: true, method: true } }
        },
        orderBy: { dueDate: 'asc' }
      }),
      prisma.invoice.count({
        where: {
          customerId: id,
          status: { not: 'PAID' }
        }
      })
    ]);

    // Get outstanding debtors for this customer
    const [debtors, debtorTotal] = await Promise.all([
      prisma.debtor.findMany({
        where: {
          customerId: id,
          status: { not: 'PAID' }
        },
        include: {
          invoice: { 
            select: { 
              invoiceNumber: true, 
              total: true, 
              dueDate: true,
              company: { select: { name: true, label: true } }
            }
          },
          receipt: { 
            select: { 
              receiptNumber: true, 
              total: true,
              company: { select: { name: true, label: true } }
            }
          }
        },
        orderBy: { dueDate: 'asc' }
      }),
      prisma.debtor.count({
        where: {
          customerId: id,
          status: { not: 'PAID' }
        }
      })
    ]);

    // Calculate outstanding amounts
    const invoicesWithOutstanding = invoices.map(invoice => {
      const totalPaid = invoice.payments.reduce((sum, payment) => 
        sum + parseFloat(payment.amount), 0
      );
      const outstandingAmount = parseFloat(invoice.total) - totalPaid;
      const isOverdue = new Date() > new Date(invoice.dueDate) && outstandingAmount > 0;

      return {
        ...invoice,
        totalPaid,
        outstandingAmount,
        isOverdue,
        daysOverdue: isOverdue ? 
          Math.ceil((new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24)) : 0
      };
    });

    const debtorsWithOutstanding = debtors.map(debtor => {
      const isOverdue = new Date() > new Date(debtor.dueDate) && debtor.status !== 'PAID';
      const daysOverdue = isOverdue ? 
        Math.ceil((new Date() - new Date(debtor.dueDate)) / (1000 * 60 * 60 * 24)) : 0;

      return {
        ...debtor,
        isOverdue,
        daysOverdue
      };
    });

    // Calculate totals
    const totalInvoiceOutstanding = invoicesWithOutstanding.reduce((sum, invoice) => 
      sum + invoice.outstandingAmount, 0
    );
    const totalDebtorOutstanding = debtorsWithOutstanding.reduce((sum, debtor) => 
      sum + parseFloat(debtor.amount), 0
    );

    const summary = {
      customer,
      invoices: {
        data: invoicesWithOutstanding,
        total: invoiceTotal,
        outstandingAmount: totalInvoiceOutstanding,
        overdueCount: invoicesWithOutstanding.filter(inv => inv.isOverdue).length
      },
      debtors: {
        data: debtorsWithOutstanding,
        total: debtorTotal,
        outstandingAmount: totalDebtorOutstanding,
        overdueCount: debtorsWithOutstanding.filter(d => d.isOverdue).length
      },
      overall: {
        totalOutstanding: totalInvoiceOutstanding + totalDebtorOutstanding,
        currentPage: parseInt(page),
        totalPages: Math.ceil(Math.max(invoiceTotal, debtorTotal) / parseInt(limit))
      }
    };

    success(res, summary, 'Customer outstanding retrieved successfully');

  } catch (err) {
    console.error('Error getting customer outstanding:', err);
    error(res, 'Ralat mendapatkan customer outstanding');
  }
});

module.exports = router;
