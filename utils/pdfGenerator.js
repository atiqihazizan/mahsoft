const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')
const { promisify } = require('util')
const os = require('os')
const prisma = require('./prisma')
const { generateHTML, generateReceiptHTML } = require('./pdfTemplate')

const execAsync = promisify(exec)

const STORAGE_DIR = path.join(__dirname, '..', 'storage', 'app', 'public')
const LOGO_PATH = path.join(__dirname, '..', 'public', 'logo', 'logo.png')

const WKHTMLTOPDF = (() => {
  const candidates = [
    'wkhtmltopdf',
    '/usr/local/bin/wkhtmltopdf',
    path.join(os.homedir(), '.local', 'bin', 'wkhtmltopdf'),
    '/usr/bin/wkhtmltopdf'
  ]
  for (const c of candidates) {
    try {
      if (fs.existsSync(c) || c === 'wkhtmltopdf') return c
    } catch (e) {}
  }
  return 'wkhtmltopdf'
})()

// Konfigurasi setiap jenis dokumen: model Prisma, folder storage & saiz kertas wkhtmltopdf
const DOC_CONFIG = {
  INVOICE: { model: 'invoice', dir: 'invoices', pageSize: 'A4' },
  QUOTATION: { model: 'quote', dir: 'quotes', pageSize: 'A4' },
  RECEIPT: { model: 'receipt', dir: 'receipts', pageSize: 'A4' }
}

const getDocConfig = (docType) => {
  const config = DOC_CONFIG[docType]
  if (!config) throw new Error(`Unsupported document type: ${docType}`)
  return config
}

const getDocDir = (docType) => {
  return path.join(STORAGE_DIR, getDocConfig(docType).dir)
}

const getPdfPath = (docType, id) => {
  return path.join(getDocDir(docType), `${id}.pdf`)
}

const getPdfRelativePath = (docType, id) => {
  return `/storage/${getDocConfig(docType).dir}/${id}.pdf`
}

const needsRegeneration = async (docType, id) => {
  const { model } = getDocConfig(docType)
  const doc = await prisma[model].findUnique({
    where: { id },
    select: { updatedAt: true, pdfGeneratedAt: true, pdfPath: true }
  })
  if (!doc) return true
  if (!doc.pdfPath || !doc.pdfGeneratedAt) return true

  const fullPath = path.join(STORAGE_DIR, doc.pdfPath.replace('/storage/', ''))
  if (!fs.existsSync(fullPath)) return true

  return new Date(doc.updatedAt) > new Date(doc.pdfGeneratedAt)
}

const loadLogoData = () => {
  try {
    if (fs.existsSync(LOGO_PATH)) {
      const ext = path.extname(LOGO_PATH).slice(1)
      const base64 = fs.readFileSync(LOGO_PATH).toString('base64')
      return `data:image/${ext};base64,${base64}`
    }
  } catch (e) {}
  return ''
}


const generatePdf = async (docType, id) => {
  const { model, pageSize } = getDocConfig(docType)

  const include = docType === 'RECEIPT'
    ? { company: true, customer: true, payments: { orderBy: { createdAt: 'desc' } } }
    : { company: true, customer: true }

  let doc = await prisma[model].findUnique({
    where: { id },
    include
  })

  if (!doc) throw new Error(`${docType} not found`)

  const bank = doc.company?.bank || {}
  const logoData = loadLogoData()

  const html = docType === 'RECEIPT'
    ? generateReceiptHTML({
        company: { ...doc.company, registration: doc.company?.ssm },
        logoData,
        customer: doc.customer,
        documentNumber: doc.receiptNumber,
        date: doc.date,
        items: doc.items || [],
        subtotal: Number(doc.subtotal) || 0,
        discountPercent: Number(doc.discountPercent) || 0,
        discountAmount: Number(doc.discountAmount) || 0,
        discountLabel: doc.discountLabel,
        tax: Number(doc.taxAmount) || 0,
        total: Number(doc.total) || 0,
        payments: doc.payments || [],
        issuedBy: doc.issuedBy || doc.company?.manager,
        notes: doc.notes
      })
    : generateHTML({
        documentType: docType,
        company: { ...doc.company, registration: doc.company?.ssm },
        logoData,
        customer: doc.customer,
        documentNumber: docType === 'INVOICE' ? doc.invoiceNumber : doc.quoteNumber,
        date: doc.date,
        validUntil: docType === 'INVOICE' ? doc.dueDate : doc.validUntil,
        items: doc.items || [],
        subtotal: Number(doc.subtotal) || 0,
        discountPercent: Number(doc.discountPercent) || 0,
        discountAmount: Number(doc.discountAmount) || 0,
        discountLabel: doc.discountLabel,
        tax: Number(doc.taxAmount) || 0,
        total: Number(doc.total) || 0,
        paidAmount: docType === 'INVOICE' ? (Number(doc.paidAmount) || 0) : 0,
        bank,
        issuedBy: doc.issuedBy,
        notes: doc.notes
      })

  const pdfDir = getDocDir(docType)
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true })
  }

  const pdfPath = getPdfPath(docType, id)

  const tmpHtml = path.join(os.tmpdir(), `pdfgen-${id}.html`)
  fs.writeFileSync(tmpHtml, html, 'utf-8')

  // Resit guna saiz A5 (lebih ringkas berbanding invois/quotation A4) dengan margin lebih kecil
  const margins = pageSize === 'A5'
    ? { top: '10mm', bottom: '10mm', left: '12mm', right: '12mm' }
    : { top: '15mm', bottom: '15mm', left: '20mm', right: '20mm' }

  try {
    await execAsync(
      `"${WKHTMLTOPDF}" ` +
      `--encoding UTF-8 ` +
      `--page-size ${pageSize} ` +
      `--margin-top ${margins.top} ` +
      `--margin-bottom ${margins.bottom} ` +
      `--margin-left ${margins.left} ` +
      `--margin-right ${margins.right} ` +
      `--dpi 96 ` +
      `--zoom 1.0 ` +
      `--disable-smart-shrinking ` +
      `--enable-local-file-access ` +
      `--javascript-delay 500 ` +
      `--no-stop-slow-scripts ` +
      `"${tmpHtml}" "${pdfPath}"`,
      { timeout: 3000 }
    )
  } finally {
    try { fs.unlinkSync(tmpHtml) } catch (e) {}
  }

  const relativePath = getPdfRelativePath(docType, id)
  await prisma[model].update({
    where: { id },
    data: {
      pdfPath: relativePath,
      pdfGeneratedAt: new Date()
    }
  })

  return relativePath
}

module.exports = { generatePdf, needsRegeneration, getPdfRelativePath, getPdfPath }
