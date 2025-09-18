const { PrismaClient } = require('@prisma/client');
const suppliers = require('../data/suppliers');

const prisma = new PrismaClient();

async function seedSuppliers() {
  console.log('🏭 Seeding suppliers...');
  
  for (const supplierData of suppliers) {
    // Check if supplier exists by email
    const email = supplierData.email || 'no-email-' + supplierData.name.replace(/\s+/g, '-').toLowerCase();
    const existingSupplier = await prisma.supplier.findFirst({
      where: { email: email }
    });

    if (existingSupplier) {
      await prisma.supplier.update({
        where: { id: existingSupplier.id },
        data: supplierData
      });
    } else {
      await prisma.supplier.create({
        data: supplierData
      });
    }
  }
  
  console.log(`✅ ${suppliers.length} suppliers seeded`);
}

module.exports = seedSuppliers;
