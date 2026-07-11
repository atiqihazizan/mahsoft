const prisma = require('./prisma');

function formatPrefixWithYear(prefix, currentYear) {
  if (!prefix || prefix.trim() === '') return '';
  
  if (prefix.includes('[yyyy]')) {
    return prefix.replace('[yyyy]', currentYear.toString());
  } else if (prefix.includes('[yy]')) {
    return prefix.replace('[yy]', currentYear.toString().slice(-2));
  } else if (prefix.includes('[year]')) {
    return prefix.replace('[year]', currentYear.toString());
  }
  
  return prefix;
}

function buildNumber(prefix, seq, currentYear) {
  const formattedPrefix = formatPrefixWithYear(prefix, currentYear);
  
  if (!formattedPrefix) {
    return seq.toString().padStart(4, '0');
  }
  
  const hasYearCode = prefix.includes('[yyyy]') || prefix.includes('[yy]') || prefix.includes('[year]');
  
  if (hasYearCode) {
    return `${formattedPrefix}${seq.toString().padStart(4, '0')}`;
  } else {
    return `${formattedPrefix}${currentYear}${seq.toString().padStart(4, '0')}`;
  }
}

async function generateSequenceNumber(companyId, field) {
  const currentYear = new Date().getFullYear();

  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.findUnique({
      where: { id: companyId },
      select: {
        invoicePrefix: true, quotePrefix: true, receiptPrefix: true, deliveryOrderPrefix: true,
        invoiceSeq: true, quoteSeq: true, receiptSeq: true, deliveryOrderSeq: true
      }
    });

    if (!company) {
      throw new Error('Company not found');
    }

    const prefixMap = {
      invoice: 'invoicePrefix', quote: 'quotePrefix', receipt: 'receiptPrefix', deliveryOrder: 'deliveryOrderPrefix',
      invoiceSeq: 'invoiceSeq', quoteSeq: 'quoteSeq', receiptSeq: 'receiptSeq', deliveryOrderSeq: 'deliveryOrderSeq'
    };

    const prefix = company[prefixMap[field]] || '';
    const nextSeq = company[prefixMap[field + 'Seq']] + 1;

    await tx.company.update({
      where: { id: companyId },
      data: { [prefixMap[field + 'Seq']]: nextSeq }
    });

    return { prefix, seq: nextSeq, currentYear };
  });

  return buildNumber(result.prefix, result.seq, result.currentYear);
}

async function generateInvoiceNumber(companyId) {
  return generateSequenceNumber(companyId, 'invoice');
}

async function generateQuoteNumber(companyId) {
  return generateSequenceNumber(companyId, 'quote');
}

async function generateReceiptNumber(companyId) {
  return generateSequenceNumber(companyId, 'receipt');
}

async function generateDeliveryOrderNumber(companyId) {
  return generateSequenceNumber(companyId, 'deliveryOrder');
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
