const prisma = require('./prisma');

/**
 * Generate invoice number using company sequence
 * @param {string} companyId - Company ID
 * @returns {Promise<string>} Generated invoice number
 */
async function generateInvoiceNumber(companyId) {
  const company = await prisma.company.findUnique({
    where: { id: companyId }
  });

  if (!company) {
    throw new Error('Company not found');
  }

  const currentYear = new Date().getFullYear();
  const prefix = company.invoicePrefix || 'INV';
  const nextNumber = company.invoiceSeq + 1;

  // Update company sequence
  await prisma.company.update({
    where: { id: companyId },
    data: { invoiceSeq: nextNumber }
  });

  return `${prefix}${currentYear}${nextNumber.toString().padStart(4, '0')}`;
}

/**
 * Generate quote number using company sequence
 * @param {string} companyId - Company ID
 * @returns {Promise<string>} Generated quote number
 */
async function generateQuoteNumber(companyId) {
  const company = await prisma.company.findUnique({
    where: { id: companyId }
  });

  if (!company) {
    throw new Error('Company not found');
  }

  const currentYear = new Date().getFullYear();
  const prefix = company.quotePrefix || 'QT';
  const nextNumber = company.quoteSeq + 1;

  // Update company sequence
  await prisma.company.update({
    where: { id: companyId },
    data: { quoteSeq: nextNumber }
  });

  return `${prefix}${currentYear}${nextNumber.toString().padStart(4, '0')}`;
}

/**
 * Generate receipt number using company sequence
 * @param {string} companyId - Company ID
 * @returns {Promise<string>} Generated receipt number
 */
async function generateReceiptNumber(companyId) {
  const company = await prisma.company.findUnique({
    where: { id: companyId }
  });

  if (!company) {
    throw new Error('Company not found');
  }

  const currentYear = new Date().getFullYear();
  const prefix = company.receiptPrefix || 'RCP';
  const nextNumber = company.receiptSeq + 1;

  // Update company sequence
  await prisma.company.update({
    where: { id: companyId },
    data: { receiptSeq: nextNumber }
  });

  return `${prefix}${currentYear}${nextNumber.toString().padStart(4, '0')}`;
}

/**
 * Generate delivery order number using company sequence
 * @param {string} companyId - Company ID
 * @returns {Promise<string>} Generated delivery order number
 */
async function generateDeliveryOrderNumber(companyId) {
  const company = await prisma.company.findUnique({
    where: { id: companyId }
  });

  if (!company) {
    throw new Error('Company not found');
  }

  const currentYear = new Date().getFullYear();
  const prefix = company.deliveryOrderPrefix || 'DO';
  const nextNumber = company.deliveryOrderSeq + 1;

  // Update company sequence
  await prisma.company.update({
    where: { id: companyId },
    data: { deliveryOrderSeq: nextNumber }
  });

  return `${prefix}${currentYear}${nextNumber.toString().padStart(4, '0')}`;
}

/**
 * Get current sequence numbers for a company
 * @param {string} companyId - Company ID
 * @returns {Promise<Object>} Current sequences
 */
async function getCompanySequences(companyId) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      invoiceSeq: true,
      quoteSeq: true,
      receiptSeq: true,
      deliveryOrderSeq: true,
      invoicePrefix: true,
      quotePrefix: true,
      receiptPrefix: true,
      deliveryOrderPrefix: true
    }
  });

  if (!company) {
    throw new Error('Company not found');
  }

  return company;
}

module.exports = {
  generateInvoiceNumber,
  generateQuoteNumber,
  generateReceiptNumber,
  generateDeliveryOrderNumber,
  getCompanySequences
};
