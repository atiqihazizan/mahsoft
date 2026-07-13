const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const { PDFDocument } = require('pdf-lib')
const prisma = require('./prisma')
const { generateHTML } = require('./pdfTemplate')

const STORAGE_DIR = path.join(__dirname, '..', 'storage', 'app', 'public')
const LOGO_PATH = path.join(__dirname, '..', 'public', 'logo', 'logo.png')

const getDocDir = (docType) => {
  const dir = docType === 'INVOICE' ? 'invoices' : 'quotes'
  return path.join(STORAGE_DIR, dir)
}

const getPdfPath = (docType, id) => {
  return path.join(getDocDir(docType), `${id}.pdf`)
}

const getPdfRelativePath = (docType, id) => {
  const dir = docType === 'INVOICE' ? 'invoices' : 'quotes'
  return `/storage/${dir}/${id}.pdf`
}

const needsRegeneration = async (docType, id) => {
  const model = docType === 'INVOICE' ? 'invoice' : 'quote'
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

const countPdfPages = async (pdfBuffer) => {
  const doc = await PDFDocument.load(pdfBuffer)
  return doc.getPageCount()
}

const generatePdf = async (docType, id) => {
  const model = docType === 'INVOICE' ? 'invoice' : 'quote'
  const include = {
    company: true,
    customer: true
  }

  let doc = await prisma[model].findUnique({
    where: { id },
    include
  })

  if (!doc) throw new Error(`${docType} not found`)

  const bank = doc.company?.bank || {}

  let logoData = ''
  try {
    if (fs.existsSync(LOGO_PATH)) {
      const ext = path.extname(LOGO_PATH).slice(1)
      const base64 = fs.readFileSync(LOGO_PATH).toString('base64')
      logoData = `data:image/${ext};base64,${base64}`
    }
  } catch (e) {
    // logo non-critical
  }

  const html = generateHTML({
    documentType: docType,
    company: doc.company,
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
    bank,
    issuedBy: doc.issuedBy,
    notes: doc.notes
  })

  const pdfDir = getDocDir(docType)
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true })
  }

  const pdfPath = getPdfPath(docType, id)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    // First pass: render without footer to determine page count
    const firstPassPdf = await page.pdf({
      format: 'A4',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      printBackground: true,
      displayHeaderFooter: false
    })

    const totalPages = await countPdfPages(firstPassPdf)

    if (totalPages > 1) {
      // Multi-page: render with page number footer using Puppeteer
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: `<div style="width:100%;font-size:9px;color:#666;font-family:ui-sans-serif,system-ui,sans-serif;padding:0 20mm;text-align:center">Page <span class="pageNumber"></span> of ${totalPages}</div>`
      })
    } else {
      // Single page: save without page numbers
      fs.writeFileSync(pdfPath, firstPassPdf)
    }
  } finally {
    await browser.close()
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
