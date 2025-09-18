const { PrismaClient } = require('@prisma/client');
const payments = require('../data/payments');

const prisma = new PrismaClient();

async function seedPayments() {
  console.log('💳 Seeding payments...');
  
  // Get first customer
  const customer = await prisma.customer.findFirst();
  if (!customer) {
    console.log('❌ Customer not found. Please seed customers first.');
    return;
  }
  
  // Get invoices and receipts
  const invoices = await prisma.invoice.findMany();
  const receipts = await prisma.receipt.findMany();
  
  if (invoices.length === 0 && receipts.length === 0) {
    console.log('❌ No invoices or receipts found. Please seed them first.');
    return;
  }
  
  for (let i = 0; i < payments.length; i++) {
    const paymentData = payments[i];
    const { type, ...paymentInfo } = paymentData;
    
    let invoiceId = null;
    let receiptId = null;
    
    if (type === 'invoice' && invoices[i % invoices.length]) {
      invoiceId = invoices[i % invoices.length].id;
    } else if (type === 'receipt' && receipts[i % receipts.length]) {
      receiptId = receipts[i % receipts.length].id;
    }
    
    await prisma.payment.create({
      data: {
        ...paymentInfo,
        customerId: customer.id,
        ...(invoiceId && { invoiceId }),
        ...(receiptId && { receiptId })
      }
    });
  }
  
  console.log(`✅ ${payments.length} payments seeded`);
}

module.exports = seedPayments;
