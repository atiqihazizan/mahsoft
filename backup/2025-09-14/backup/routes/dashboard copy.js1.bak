const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../utils/auth');
const { success, error } = require('../utils/response');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/dashboard/stats - Dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get counts for different entities
    const [
      totalCustomers,
      totalSuppliers,
      totalQuotes,
      totalInvoices,
      totalReceipts,
      totalPayments,
      totalDebtors,
      activeQuotes,
      pendingInvoices,
      paidInvoices
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.supplier.count(),
      prisma.quote.count(),
      prisma.invoice.count(),
      prisma.receipt.count(),
      prisma.payment.count(),
      prisma.debtor.count(),
      prisma.quote.count({ where: { status: 'SENT' } }),
      prisma.invoice.count({ where: { status: 'SENT' } }),
      prisma.invoice.count({ where: { status: 'PAID' } })
    ]);

    // Calculate total amounts
    const totalInvoiceAmount = await prisma.invoice.aggregate({
      _sum: { total: true }
    });

    const totalPaymentAmount = await prisma.payment.aggregate({
      _sum: { amount: true }
    });

    const totalOutstanding = await prisma.debtor.aggregate({
      _sum: { amount: true }
    });

    const stats = {
      counts: {
        customers: totalCustomers,
        suppliers: totalSuppliers,
        quotes: totalQuotes,
        invoices: totalInvoices,
        receipts: totalReceipts,
        payments: totalPayments,
        debtors: totalDebtors,
        activeQuotes,
        pendingInvoices,
        paidInvoices
      },
      amounts: {
        totalInvoiceAmount: totalInvoiceAmount._sum.total || 0,
        totalPaymentAmount: totalPaymentAmount._sum.amount || 0,
        totalOutstanding: totalOutstanding._sum.amount || 0
      }
    };

    success(res, stats, 'Dashboard statistics retrieved successfully');

  } catch (err) {
    console.error('Error getting dashboard stats:', err);
    error(res, 'Ralat mendapatkan statistik dashboard');
  }
});

// GET /api/v1/dashboard/recent-activity - Recent activity
router.get('/recent-activity', authenticateToken, async (req, res) => {
  try {
    const recentQuotes = await prisma.quote.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { name: true }
        },
        user: {
          select: { name: true }
        }
      }
    });

    const recentInvoices = await prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { name: true }
        },
        user: {
          select: { name: true }
        }
      }
    });

    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { name: true }
        }
      }
    });

    const activity = {
      quotes: recentQuotes,
      invoices: recentInvoices,
      payments: recentPayments
    };

    success(res, activity, 'Recent activity retrieved successfully');

  } catch (err) {
    console.error('Error getting recent activity:', err);
    error(res, 'Ralat mendapatkan aktiviti terkini');
  }
});

module.exports = router;
