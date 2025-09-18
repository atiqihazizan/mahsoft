const { PrismaClient } = require('@prisma/client');
const companies = require('../data/companies');

const prisma = new PrismaClient();

async function seedCompanies() {
  console.log('🏢 Seeding companies...');
  
  for (const companyData of companies) {
    // Map the data to match Prisma schema
    const mappedData = {
      name: companyData.name,
      label: companyData.label,
      address: companyData.address,
      phone: companyData.phone,
      email: companyData.email,
      taxNumber: companyData.taxNumber,
      
      // Bank details
      bankholder: companyData.bankholder,
      bankname: companyData.bankname,
      bankacc: companyData.bankacc,
      bankbranch: companyData.bankbranch,
      
      // Company details
      ssm: companyData.ssm,
      manager: companyData.manager,
      assist: companyData.assist,
      accountant: companyData.accountant,
      technical: companyData.technical,
      
      // Sequence numbers
      invoiceSeq: companyData.invoiceSeq || 0,
      quoteSeq: companyData.quoteSeq || 0,
      receiptSeq: companyData.receiptSeq || 0,
      deliveryOrderSeq: companyData.deliveryOrderSeq || 0,
      
      // Prefixes
      invoicePrefix: companyData.invoicePrefix,
      quotePrefix: companyData.quotePrefix,
      receiptPrefix: companyData.receiptPrefix,
      deliveryOrderPrefix: companyData.deliveryOrderPrefix,
      
      // Required fields
      tempId: companyData.tempId || 1,
      is_default: companyData.is_default || false
    };
    
    // Check if company exists by name and label combination
    const existingCompany = await prisma.company.findFirst({
      where: { 
        name: companyData.name,
        label: companyData.label
      }
    });

    if (existingCompany) {
      await prisma.company.update({
        where: { id: existingCompany.id },
        data: mappedData
      });
    } else {
      await prisma.company.create({
        data: mappedData
      });
    }
  }
  
  console.log(`✅ ${companies.length} companies seeded`);
}

module.exports = seedCompanies;
