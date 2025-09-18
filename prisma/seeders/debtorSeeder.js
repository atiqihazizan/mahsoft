const { PrismaClient } = require('@prisma/client');
const debtors = require('../data/debtors');

const prisma = new PrismaClient();

async function seedDebtors() {
  console.log('💰 Seeding debtors...');
  
  // Get customers and suppliers
  const customers = await prisma.customer.findMany();
  const suppliers = await prisma.supplier.findMany();
  const invoices = await prisma.invoice.findMany();
  const receipts = await prisma.receipt.findMany();
  
  if (customers.length === 0 && suppliers.length === 0) {
    console.log('❌ No customers or suppliers found. Please seed them first.');
    return;
  }
  
  for (let i = 0; i < debtors.length; i++) {
    const debtorData = debtors[i];
    const { type, ...debtorInfo } = debtorData;
    
    let customerId = null;
    let supplierId = null;
    let invoiceId = null;
    let receiptId = null;
    
    if (type === 'customer' && customers[i % customers.length]) {
      customerId = customers[i % customers.length].id;
      // Assign to invoice if available
      if (invoices[i % invoices.length]) {
        invoiceId = invoices[i % invoices.length].id;
      }
    } else if (type === 'supplier' && suppliers[i % suppliers.length]) {
      supplierId = suppliers[i % suppliers.length].id;
    }
    
    await prisma.debtor.create({
      data: {
        ...debtorInfo,
        ...(customerId && { customerId }),
        ...(supplierId && { supplierId }),
        ...(invoiceId && { invoiceId }),
        ...(receiptId && { receiptId })
      }
    });
  }
  
  console.log(`✅ ${debtors.length} debtors seeded`);
}

module.exports = seedDebtors;
