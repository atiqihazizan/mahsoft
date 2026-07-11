const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:5001", "https://invoice.mahsites.com", "https://invoice.mahsites.net"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:", "https:", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting (longgarkan ketika development untuk elak 429 ketika StrictMode)
const isDev = process.env.NODE_ENV !== 'production'
const limiter = rateLimit({
  windowMs: isDev ? 60 * 1000 : 15 * 60 * 1000,
  max: isDev ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Terlalu banyak permintaan dari IP ini, sila cuba lagi kemudian.'
});
app.use('/api', limiter);

// Routes
app.use('/api/v1/setup', require('./routes/setup'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/companies', require('./routes/companies'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/customers', require('./routes/customers'));
app.use('/api/v1/suppliers', require('./routes/suppliers'));
app.use('/api/v1/quotes', require('./routes/quotes'));
app.use('/api/v1/invoices', require('./routes/invoices'));
app.use('/api/v1/receipts', require('./routes/receipts'));
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/debtors', require('./routes/debtors'));
app.use('/api/v1/delivery-orders', require('./routes/deliveryOrders'));
app.use('/api/v1/outstanding', require('./routes/outstanding'));
app.use('/api/v1/dashboard', require('./routes/dashboard'));

// Serve static files from public directory
app.use(express.static('public'));

// Serve static files from public directory with /public/ prefix
app.use('/public', express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all non-API routes (SPA routing)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      error: 'API endpoint tidak ditemui',
      message: `Route ${req.method} ${req.originalUrl} tidak wujud`
    });
  }

  // express.static gagal bagi path ini — jangan balas JSON (browser sangka CSS ialah JSON)
  const looksLikeStaticAsset =
    req.path.startsWith('/assets/') ||
    req.path.startsWith('/fonts/') ||
    /\.(js|mjs|css|png|jpg|jpeg|gif|svg|ico|ttf|woff2?|eot|otf|map|webp)$/i.test(req.path);
  if (looksLikeStaticAsset) {
    return res.status(404).type('text/plain').send('Not found');
  }

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint tidak ditemui',
    message: `Route ${req.method} ${req.originalUrl} tidak wujud`
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(error.status || 500).json({
    error: 'Ralat dalaman server',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Sesuatu tidak kena'
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
