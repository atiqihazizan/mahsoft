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

  client.on('auth_failure', async () => {
    clientReady = false
    authListeners.forEach(fn => fn('auth_failure'))
    await resetClient()
  })

  client.on('disconnected', async (reason) => {
    clientReady = false
    authListeners.forEach(fn => fn('disconnected', reason))
    await resetClient()
  })

  client.initialize().catch(async (err) => {
    console.error('WhatsApp client failed to initialize:', err)
    await resetClient()
  })

  return client
}

const resetClient = async () => {
  const dead = client
  client = null
  qrCodeBase64 = null
  if (dead) {
    try {
      await dead.destroy()
    } catch (e) {
      // ignore teardown errors from an already-broken client
    }
  }
}

const getStatus = () => {
  getClient()
  return {
    ready: clientReady,
    hasQr: !!qrCodeBase64,
    qrCode: qrCodeBase64
  }
}

const onAuthEvent = (fn) => {
  authListeners.push(fn)
}

const waitForQrCode = (timeoutMs = 25000) => {
  return new Promise((resolve) => {
    if (qrCodeBase64) return resolve(qrCodeBase64)
    if (clientReady) return resolve(null)

    const timer = setTimeout(() => {
      cleanup()
      resolve(qrCodeBase64)
    }, timeoutMs)

    const cleanup = () => {
      clearTimeout(timer)
      const idx = authListeners.indexOf(handler)
      if (idx !== -1) authListeners.splice(idx, 1)
    }

    const handler = (event, data) => {
      if (event === 'qr') {
        cleanup()
        resolve(data)
      } else if (event === 'ready') {
        cleanup()
        resolve(null)
      }
    }

    authListeners.push(handler)
  })
}

const sendPdf = async (phone, pdfPath, caption) => {
  const c = getClient()
  if (!clientReady) throw new Error('WhatsApp client not ready')

  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('0')) cleaned = '60' + cleaned.slice(1)
  const chatId = `${cleaned}@c.us`

  const media = require('whatsapp-web.js').MessageMedia
  const base64 = fs.readFileSync(pdfPath, { encoding: 'base64' })
  const filename = path.basename(pdfPath)
  const document = new media('application/pdf', base64, filename)

  await c.sendMessage(chatId, document, { caption: caption || '' })
}

module.exports = { getClient, getStatus, onAuthEvent, sendPdf, waitForQrCode }
