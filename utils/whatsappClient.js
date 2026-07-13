const { Client, LocalAuth } = require('whatsapp-web.js')
const path = require('path')
const fs = require('fs')
const QR = require('qrcode')

const SESSION_DIR = path.join(__dirname, '..', '.wwebjs_auth')
const MEDIA_DIR = path.join(__dirname, '..', 'storage', 'whatsapp-media')

let client = null
let qrCodeBase64 = null
let clientReady = false
let authListeners = []

const getClient = () => {
  if (client) return client

  if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR, { recursive: true })
  }

  client = new Client({
    authStrategy: new LocalAuth({ dataPath: SESSION_DIR }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
  })

  client.on('qr', async (qr) => {
    clientReady = false
    qrCodeBase64 = await QR.toDataURL(qr)
    authListeners.forEach(fn => fn('qr', qrCodeBase64))
  })

  client.on('ready', () => {
    clientReady = true
    qrCodeBase64 = null
    authListeners.forEach(fn => fn('ready'))
  })

  client.on('authenticated', () => {
    authListeners.forEach(fn => fn('authenticated'))
  })

  client.on('auth_failure', () => {
    clientReady = false
    authListeners.forEach(fn => fn('auth_failure'))
  })

  client.on('disconnected', (reason) => {
    clientReady = false
    authListeners.forEach(fn => fn('disconnected', reason))
  })

  client.initialize()

  return client
}

const getStatus = () => {
  return {
    ready: clientReady,
    hasQr: !!qrCodeBase64,
    qrCode: qrCodeBase64
  }
}

const onAuthEvent = (fn) => {
  authListeners.push(fn)
}

const sendPdf = async (phone, pdfPath, caption) => {
  const c = getClient()
  if (!clientReady) throw new Error('WhatsApp client not ready')

  const cleaned = phone.replace(/[^0-9]/g, '')
  const chatId = `${cleaned}@c.us`

  const media = require('whatsapp-web.js').MessageMedia
  const base64 = fs.readFileSync(pdfPath, { encoding: 'base64' })
  const filename = path.basename(pdfPath)
  const document = new media('application/pdf', base64, filename)

  await c.sendMessage(chatId, document, { caption: caption || '' })
}

module.exports = { getClient, getStatus, onAuthEvent, sendPdf }
