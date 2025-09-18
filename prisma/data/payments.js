module.exports = [
  {
    amount: 530.00,
    method: 'BANK_TRANSFER',
    reference: 'TXN123456789',
    date: new Date(),
    notes: 'Pembayaran melalui online banking',
    type: 'receipt' // 'invoice' or 'receipt'
  },
  {
    amount: 848.00,
    method: 'CASH',
    reference: 'CASH001',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    notes: 'Pembayaran tunai di pejabat',
    type: 'invoice'
  },
  {
    amount: 500.00,
    method: 'CHEQUE',
    reference: 'CHQ789456123',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    notes: 'Pembayaran melalui cek',
    type: 'invoice'
  },
  {
    amount: 1272.00,
    method: 'CREDIT_CARD',
    reference: 'CC987654321',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    notes: 'Pembayaran menggunakan kad kredit',
    type: 'receipt'
  }
];
