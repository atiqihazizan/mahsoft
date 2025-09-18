const { PrismaClient } = require('@prisma/client');

// Import all seeders
const seedCompanies = require('./companySeeder');
const seedUsers = require('./userSeeder');
const seedCustomers = require('./customerSeeder');
const seedSuppliers = require('./supplierSeeder');
const seedQuotes = require('./quoteSeeder');
const seedInvoices = require('./invoiceSeeder');
const seedReceipts = require('./receiptSeeder');
const seedPayments = require('./paymentSeeder');
const seedDebtors = require('./debtorSeeder');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');
  console.log('================================');
  
  try {
    // Seed in order (dependencies first)
    await seedCompanies();
    await seedUsers();
    await seedCustomers();
    await seedSuppliers();
    await seedInvoices();
    await seedReceipts();
    await seedQuotes();
    // await seedPayments();
    // await seedDebtors();
    
    console.log('================================');
    console.log('🎉 All seeders completed successfully!');
    
    // Show summary
    const counts = await Promise.all([
      prisma.company.count(),
      prisma.user.count(),
      prisma.customer.count(),
      prisma.supplier.count(),
      prisma.quote.count(),
      prisma.invoice.count(),
      prisma.receipt.count(),
      prisma.payment.count(),
      prisma.debtor.count()
    ]);
    
    console.log('\n📊 Database Summary:');
    console.log(`Companies: ${counts[0]}`);
    console.log(`Users: ${counts[1]}`);
    console.log(`Customers: ${counts[2]}`);
    console.log(`Suppliers: ${counts[3]}`);
    console.log(`Quotes: ${counts[4]}`);
    console.log(`Invoices: ${counts[5]}`);
    console.log(`Receipts: ${counts[6]}`);
    console.log(`Payments: ${counts[7]}`);
    console.log(`Debtors: ${counts[8]}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run specific seeder if provided as argument
const seederName = process.argv[2];
if (seederName) {
  console.log(`🌱 Running specific seeder: ${seederName}`);
  
  const seeders = {
    companies: seedCompanies,
    users: seedUsers,
    customers: seedCustomers,
    suppliers: seedSuppliers,
    quotes: seedQuotes,
    invoices: seedInvoices,
    receipts: seedReceipts,
    payments: seedPayments,
    debtors: seedDebtors
  };
  
  if (seeders[seederName]) {
    seeders[seederName]()
      .then(() => {
        console.log(`✅ ${seederName} seeder completed`);
        process.exit(0);
      })
      .catch((error) => {
        console.error(`❌ Error in ${seederName} seeder:`, error);
        process.exit(1);
      });
  } else {
    console.error(`❌ Unknown seeder: ${seederName}`);
    console.log('Available seeders:', Object.keys(seeders).join(', '));
    process.exit(1);
  }
} else {
  // Run all seeders
  // main()
  //   .catch((error) => {
  //     console.error('❌ Seeding failed:', error);
  //     process.exit(1);
  //   });
}

module.exports = main;
