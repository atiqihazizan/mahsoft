const { PrismaClient } = require('@prisma/client');
const invoices = require('../data/invoices');

const prisma = new PrismaClient();

async function seedInvoices() {
  console.log('🧾 Seeding invoices...');
  
  // Clear existing invoices before inserting new ones
  try {
    await prisma.payment.deleteMany({});
    await prisma.debtor.deleteMany({});
    await prisma.deliveryOrder.deleteMany({});
    await prisma.invoice.deleteMany({});
    console.log('🧹 Cleared invoices, payments, debtors, and delivery orders');
  } catch (clearErr) {
    console.error('Failed to clear related tables before seeding invoices:', clearErr);
  }

  // Get first company, user, and customer for invoices
  const company = await prisma.company.findFirst();
  const user = await prisma.user.findFirst();
  const customer = await prisma.customer.findMany();
  
  if (!company || !user || !customer) {
    console.log('❌ Company, user, or customer not found. Please seed them first.');
    return;
  }
  
  // Create all invoices with items
  for (const invoiceData of invoices) {
    // Cari customer berdasarkan ID atau nama
    const customerForInvoice = await prisma.customer.findFirst({
      where: { tempId: parseInt(invoiceData.customerId)}
    });
    
    if (!customerForInvoice) {
      console.warn(`⚠️  Customer with ID ${invoiceData.customerId} not found for invoice ${invoiceData.invoiceNumber}`);
      continue;
    }
    
    const companyForInvoice = await prisma.company.findFirst({
      where: { tempId: parseInt(invoiceData.companyId)}
    });
    
    if (!companyForInvoice) {
      console.warn(`⚠️  Company with ID ${invoiceData.companyId} not found for invoice ${invoiceData.invoiceNumber}`);
      continue;
    }
    
    // Extract items from invoiceData
    const { items, ...invoiceFields } = invoiceData;
    
    // Check if invoice exists first
    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNumber: invoiceData.invoiceNumber }
    });

    let invoice;
    if (existingInvoice) {
      // Update existing invoice
      invoice = await prisma.invoice.update({
        where: { invoiceNumber: invoiceData.invoiceNumber },
        data: {
          ...invoiceFields,
          items: items || [],
          companyId: companyForInvoice.id,
          userId: user.id,
          customerId: customerForInvoice.id
        }
      });
    } else {
      // Create new invoice
      invoice = await prisma.invoice.create({
        data: {
          ...invoiceFields,
          items: items || [],
          companyId: companyForInvoice.id,
          userId: user.id,
          customerId: customerForInvoice.id
        }
      });
    }
  }
  
  console.log(`✅ ${invoices.length} invoices created with items`);
}

module.exports = seedInvoices;