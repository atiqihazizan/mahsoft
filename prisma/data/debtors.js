module.exports = [
  {
    amount: 1832.00, // 2332 - 500 (remaining from overdue invoice)
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Overdue 5 days ago
    status: 'OVERDUE',
    notes: 'Hutang dari invois INV20240003 (sebahagian dibayar)',
    type: 'customer' // 'customer' or 'supplier'
  },
  {
    amount: 250.00,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    status: 'PENDING',
    notes: 'Hutang kepada pembekal untuk bekalan pejabat',
    type: 'supplier'
  },
  {
    amount: 1590.00,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'PENDING',
    notes: 'Hutang dari invois INV20240001',
    type: 'customer'
  },
  {
    amount: 500.00,
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Overdue 10 days ago
    status: 'OVERDUE',
    notes: 'Hutang kepada pembekal untuk perkhidmatan maintenance',
    type: 'supplier'
  }
];
