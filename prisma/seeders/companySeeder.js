const { PrismaClient } = require('@prisma/client');
const companies = require('../data/companies');

const prisma = new PrismaClient();

async function seedCompanies() {
  console.log('🏢 Seeding companies...');
  
  for (let i = 0; i < companies.length; i++) {
    const companyData = companies[i];
    try {
      await prisma.company.create({
        data: {
          tempId: companyData.tempId,
          name: companyData.name.toUpperCase(),
          label: companyData.label?.toUpperCase(),
          address: companyData.address,
          phone: companyData.phone,
          email: companyData.email,
          taxNumber: companyData.taxNumber,
          bankholder: companyData.bankholder,
          bankname: companyData.bankname,
          bankacc: companyData.bankacc,
          bankbranch: companyData.bankbranch,
          ssm: companyData.ssm,
          manager: companyData.manager,
          assist: companyData.assist,
          accountant: companyData.accountant,
          technical: companyData.technical,
          invoiceSeq: companyData.invoiceSeq || 0,
          quoteSeq: companyData.quoteSeq || 0,
          receiptSeq: companyData.receiptSeq || 0,
          deliveryOrderSeq: companyData.deliveryOrderSeq || 0,
          invoicePrefix: companyData.invoicePrefix,
          quotePrefix: companyData.quotePrefix,
          receiptPrefix: companyData.receiptPrefix,
          deliveryOrderPrefix: companyData.deliveryOrderPrefix,
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`Company ${companyData.name} already exists, skipping...`);
      } else {
        throw error;
      }
    }
  }
  
  console.log(`✅ ${companies.length} companies seeded`);
}

module.exports = seedCompanies;
