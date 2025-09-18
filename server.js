const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
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

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString()
  });
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
