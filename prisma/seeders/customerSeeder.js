const { PrismaClient } = require('@prisma/client');
const customers = require('../data/customers');

const prisma = new PrismaClient();

async function seedCustomers() {
  console.log('👤 Seeding customers...');
  
  for (let i = 0; i < customers.length; i++) {
    const customerData = customers[i];
    // Map the data to match Prisma schema
    const mappedData = {
      tempId: i + 1,
      name: customerData.name.toUpperCase(),
      short: customerData.short.toUpperCase(),
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address,
      taxNumber: customerData.taxNumber,
      attn: customerData.contactPerson,
      // Note: code and contactPerson are not stored as they're not in the schema
    };
    
    // Check if customer exists by name
    const existingCustomer = await prisma.customer.findFirst({
      where: { name: customerData.name }
    });

    if (existingCustomer) {
      await prisma.customer.update({
        where: { id: existingCustomer.id },
        data: mappedData
      });
    } else {
      await prisma.customer.create({
        data: mappedData
      });
    }
  }
  
  console.log(`✅ ${customers.length} customers seeded`);
}

module.exports = seedCustomers;
