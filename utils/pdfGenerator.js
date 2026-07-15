const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')
const { promisify } = require('util')
const os = require('os')
const prisma = require('./prisma')
const { generateHTML } = require('./pdfTemplate')

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
  }

  const FONTS_PATH = path.join(__dirname, '..', 'public', 'fonts')
  const fontPath = path.join(FONTS_PATH, 'Audiowide-Regular.ttf')
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
    notes: doc.notes,
    audiowideFontPath: fs.existsSync(fontPath) ? fontPath : ''
  })

  const pdfDir = getDocDir(docType)
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true })
  }

  const pdfPath = getPdfPath(docType, id)

  const tmpHtml = path.join(os.tmpdir(), `pdfgen-${id}.html`)
  fs.writeFileSync(tmpHtml, html, 'utf-8')

  try {
    await execAsync(
      `"${WKHTMLTOPDF}" ` +
      `--encoding UTF-8 ` +
      `--page-size A4 ` +
      `--margin-top 15mm ` +
      `--margin-bottom 15mm ` +
      `--margin-left 20mm ` +
      `--margin-right 20mm ` +
      `--dpi 96 ` +
      `--zoom 1.0 ` +
      `--disable-smart-shrinking ` +
      `--enable-local-file-access ` +
      `"${tmpHtml}" "${pdfPath}"`,
      { timeout: 30000 }
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
