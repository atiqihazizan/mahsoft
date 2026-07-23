const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const DOC_CONFIG = {
  INVOICE: { dir: 'invoices', pageSize: 'A4' },
  QUOTATION: { dir: 'quotes', pageSize: 'A4' },
  RECEIPT: { dir: 'receipts', pageSize: 'A4' }
}

const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets')
const FONT_PATH = path.join(__dirname, '..', 'public', 'fonts', 'Audiowide-Regular.ttf')

const FONT_B64 = (() => {
  if (fs.existsSync(FONT_PATH)) {
    return fs.readFileSync(FONT_PATH).toString('base64')
  }
  return ''
})()

const fontTag = FONT_B64
  ? `<style>@font-face{font-family:'Audiowide';src:url('data:font/truetype;base64,${FONT_B64}') format('truetype');font-weight:normal;font-style:normal;}</style>`
  : ''

function resolveImgToBase64(html) {
  return html.replace(
    /(src\s*=\s*["'])([^"']+)(["'])/gi,
    (match, pre, url, post) => {
      if (url.startsWith('data:') || url.startsWith('http')) return match
      const absPath = path.join(PUBLIC_DIR, url.replace(/^\//, ''))
      if (fs.existsSync(absPath)) {
        const ext = path.extname(absPath).slice(1) || 'png'
        const b64 = fs.readFileSync(absPath).toString('base64')
        return `${pre}data:image/${ext};base64,${b64}${post}`
      }
      return match
    }
  )
}

async function htmlToPdf(html, docType, id) {
  const config = DOC_CONFIG[docType]
  if (!config) throw new Error(`Unsupported docType: ${docType}`)

  const pdfDir = path.join(__dirname, '..', 'storage', 'app', 'public', config.dir)
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true })

  const pdfPath = path.join(pdfDir, `${id}.pdf`)
  const relativePath = `/storage/${config.dir}/${id}.pdf`

  let tailwindCss = ''
  try {
    const cssFiles = fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.css'))
    tailwindCss = cssFiles.map(f => fs.readFileSync(path.join(ASSETS_DIR, f), 'utf-8')).join('\n')
  } catch (e) {}

  const processedHtml = resolveImgToBase64(
    html.replace('</head>', `<style>${tailwindCss}</style>${fontTag}</head>`)
  )

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setContent(processedHtml, { waitUntil: 'networkidle0' })

    const pdfOptions = config.format
      ? { width: config.format.width, height: config.format.height, printBackground: true }
      : { format: config.pageSize, printBackground: true }

    const pdfBuffer = await page.pdf({
      ...pdfOptions,
      // scale: 0.75,
      margin: { top: '10mm', bottom: '10mm', left: '12mm', right: '12mm' }
    })

    fs.writeFileSync(pdfPath, pdfBuffer)
  } finally {
    await browser.close()
  }

  return { pdfPath, relativePath }
}

module.exports = { htmlToPdf }
