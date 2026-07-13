const express = require('express');
const router = express.Router();
const { getStatus, sendPdf } = require('../utils/whatsappClient');

// GET /api/v1/whatsapp/status - Check WhatsApp client status
router.get('/status', async (req, res) => {
  try {
    const status = getStatus();
    res.json({ success: true, data: status });
  } catch (err) {
    console.error('Error checking WhatsApp status:', err);
    res.status(500).json({ success: false, message: 'Ralat menyemak status WhatsApp' });
  }
});

// POST /api/v1/whatsapp/send - Send PDF via WhatsApp
router.post('/send', async (req, res) => {
  try {
    const { phone, pdfPath, filename, caption } = req.body;

    if (!phone) return res.status(400).json({ success: false, message: 'Nombor telefon diperlukan' });
    if (!pdfPath) return res.status(400).json({ success: false, message: 'Fail PDF diperlukan' });

    await sendPdf(phone, pdfPath, caption || '');

    res.json({ success: true, message: 'PDF berjaya dihantar melalui WhatsApp' });
  } catch (err) {
    console.error('Error sending WhatsApp PDF:', err);
    res.status(500).json({ success: false, message: err.message || 'Ralat menghantar PDF melalui WhatsApp' });
  }
});

module.exports = router;
