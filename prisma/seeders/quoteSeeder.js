const { PrismaClient } = require('@prisma/client');
const quotations = require('../data/quotation');

const prisma = new PrismaClient();

async function seedQuotes() {
  console.log('📋 Seeding quotes...');
  
  // Get first company, user, and customer for quotes
  const company = await prisma.company.findFirst();
  const user = await prisma.user.findFirst();
  const customer = await prisma.customer.findMany();
  
  if (!company || !user || !customer) {
    console.log('❌ Company, user, or customer not found. Please seed them first.');
    return;
  }
  
  // Create all quotes with items
  for (const quoteData of quotations) {
    // Cari customer berdasarkan tempId
    const customerForQuote = await prisma.customer.findFirst({
      where: { tempId: parseInt(quoteData.customerId) }
    });
    
    if (!customerForQuote) {
      console.warn(`⚠️  Customer with tempId ${quoteData.customerId} not found for quote ${quoteData.quoteNumber}`);
      continue;
    }

    const companyForQuote = await prisma.company.findFirst({
      where: { tempId: parseInt(quoteData.companyId) }
    });
    
    if (!companyForQuote) {
      console.warn(`⚠️  Company with tempId ${quoteData.companyId} not found for quote ${quoteData.quoteNumber}`);
      continue;
    }
    
    // Extract items from quoteData
    const { items, ...quoteFields } = quoteData;
    
    const quote = await prisma.quote.upsert({
      where: { quoteNumber: quoteData.quoteNumber },
      update: {
        ...quoteFields,
        items: items || [],
        companyId: companyForQuote.id,
        userId: user.id,
        customerId: customerForQuote.id
      },
      create: {
        ...quoteFields,
        items: items || [],
        companyId: companyForQuote.id,
        userId: user.id,
        customerId: customerForQuote.id
      }
    });
  }
  
  console.log(`✅ ${quotations.length} quotes created with items`);
}

module.exports = seedQuotes;
