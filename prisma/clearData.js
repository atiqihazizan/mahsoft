const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearAllData() {
  console.log('🗑️  Memulakan proses clear data...');
  console.log('================================');
  
  try {
    // Clear data dalam urutan yang betul untuk mengelakkan foreign key constraint
    console.log('1. Clearing delivery_details...');
    await prisma.deliveryDetail.deleteMany();
    
    console.log('2. Clearing delivery_orders...');
    await prisma.deliveryOrder.deleteMany();
    
    console.log('3. Clearing payments...');
    await prisma.payment.deleteMany();
    
    console.log('4. Clearing debtors...');
    await prisma.debtor.deleteMany();
    
    console.log('5. Clearing invoices...');
    await prisma.invoice.deleteMany();
    
    console.log('6. Clearing receipts...');
    await prisma.receipt.deleteMany();
    
    console.log('7. Clearing quotes...');
    await prisma.quote.deleteMany();
    
    console.log('8. Clearing customers...');
    await prisma.customer.deleteMany();
    
    console.log('9. Clearing suppliers...');
    await prisma.supplier.deleteMany();
    
    console.log('10. Clearing users...');
    await prisma.user.deleteMany();
    
    console.log('11. Clearing companies...');
    await prisma.company.deleteMany();
    
    console.log('================================');
    console.log('✅ Semua data telah berjaya di-clear!');
    
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
      prisma.debtor.count(),
      prisma.deliveryOrder.count(),
      prisma.deliveryDetail.count()
    ]);
    
    console.log('\n📊 Database Summary (selepas clear):');
    console.log(`Companies: ${counts[0]}`);
    console.log(`Users: ${counts[1]}`);
    console.log(`Customers: ${counts[2]}`);
    console.log(`Suppliers: ${counts[3]}`);
    console.log(`Quotes: ${counts[4]}`);
    console.log(`Invoices: ${counts[5]}`);
    console.log(`Receipts: ${counts[6]}`);
    console.log(`Payments: ${counts[7]}`);
    console.log(`Debtors: ${counts[8]}`);
    console.log(`Delivery Orders: ${counts[9]}`);
    console.log(`Delivery Details: ${counts[10]}`);
    
  } catch (error) {
    console.error('❌ Error semasa clear data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the clear data function
clearAllData()
  .catch((error) => {
    console.error('❌ Clear data failed:', error);
    process.exit(1);
  });
