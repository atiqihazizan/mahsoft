const { PrismaClient } = require('@prisma/client');
const receipts = require('../data/receipts');

const prisma = new PrismaClient();

async function seedReceipts() {
  console.log('🧾 Seeding receipts...');
  
  // Get company and user for receipts
  const company = await prisma.company.findFirst();
  const user = await prisma.user.findFirst();
  
  if (!company || !user) {
    console.log('❌ Company or user not found. Please seed them first.');
    return;
  }
  
  // Get all customers for mapping
  const customers = await prisma.customer.findMany();
  const customerMap = {};
  customers.forEach(customer => {
    customerMap[customer.tempId] = customer.id;
  });
  
  for (const receiptData of receipts) {
    // Find customer by tempId
    const customerId = customerMap[receiptData.tempCustomerId];
    if (!customerId) {
      console.log(`❌ Customer with tempId ${receiptData.tempCustomerId} not found. Skipping receipt ${receiptData.receiptNumber}`);
      continue;
    }
    
    // Extract items from receiptData
    const { items, tempCompanyId, tempCustomerId, ...cleanReceiptData } = receiptData;
    
    await prisma.receipt.upsert({
      where: { receiptNumber: receiptData.receiptNumber },
      update: {
        ...cleanReceiptData,
        items: items || [],
        companyId: company.id,
        userId: user.id,
        customerId: customerId
      },
      create: {
        ...cleanReceiptData,
        items: items || [],
        companyId: company.id,
        userId: user.id,
        customerId: customerId
      }
    });
  }
  
  console.log(`✅ ${receipts.length} receipts seeded with items`);
}

module.exports = seedReceipts;