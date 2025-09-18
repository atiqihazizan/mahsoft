# Mahsoft Frontend

Frontend untuk sistem pengurusan invois, resit & sebut harga menggunakan React.js, Vite, dan Tailwind CSS.

## Teknologi

- **React 19** - JavaScript library untuk UI
- **Vite** - Build tool dan dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting
- **React Router** - Routing SPA

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### Production Build
```bash
# Build untuk production (output ke ../public)
npm run build

# Atau gunakan script khusus
npm run build:public
```

## Routing & Layout

Router telah dikonfigurasi dalam `src/main.jsx` menggunakan `react-router-dom`:
- `/` - Redirect ke `/dashboard`
- `/login` - Halaman log masuk
- `/dashboard` - Dashboard (halaman utama)

Layout utama berada di `src/layouts/MainLayout.jsx` dengan navbar dan container.

## Auth & ProtectedRoute

- Token disimpan di `localStorage` selepas log masuk berjaya.
- `src/routes/ProtectedRoute.jsx` digunakan untuk menyekat akses tanpa token.
- Halaman `src/pages/Login.jsx` akan memanggil API `POST /api/v1/auth/login` dan menyimpan `data.token` ke `localStorage`.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build untuk production
- `npm run build:public` - Build dengan output ke public folder
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Struktur Folder

```
01-frontend/
├── src/
│   ├── main.jsx           # Router config
│   ├── index.css          # Global styles dengan Tailwind
│   ├── layouts/
│   │   └── MainLayout.jsx # Layout utama
│   ├── pages/
│   │   ├── Login.jsx      # Halaman Login
│   │   └── Dashboard.jsx  # Halaman utama (Dashboard)
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   └── components/
│       ├── Button.jsx
│       ├── Card.jsx
│       └── index.js
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## API Client & Integration

### API Client Utility
Frontend menggunakan `src/utils/apiClient.js` untuk semua API calls:

```javascript
import { authAPI, companiesAPI, invoicesAPI } from '../utils/apiClient'

// Login
const response = await authAPI.login({ username, password })

// Get companies
const companies = await companiesAPI.getAll()

// Create invoice
const invoice = await invoicesAPI.create(invoiceData)
```

### Available API Methods

#### Authentication (`authAPI`)
- `login(credentials)` - User login
- `register(userData)` - User registration
- `getCurrentUser()` - Get current user info
- `changePassword(passwordData)` - Change password
- `logout()` - Client-side logout
- `refreshToken()` - Refresh JWT token

#### Companies (`companiesAPI`)
- `getAll(params)` - Get all companies
- `getById(id)` - Get company by ID
- `create(companyData)` - Create new company
- `update(id, companyData)` - Update company
- `delete(id)` - Delete company

#### Invoices (`invoicesAPI`)
- `getAll(params)` - Get all invoices
- `getById(id)` - Get invoice by ID
- `create(invoiceData)` - Create new invoice
- `update(id, invoiceData)` - Update invoice
- `delete(id)` - Delete invoice
- `markPaid(id)` - Mark invoice as paid

#### Other APIs
- `customersAPI` - Customer management
- `quotesAPI` - Quote management
- `receiptsAPI` - Receipt management
- `dashboardAPI` - Dashboard stats

### Error Handling
- Semua API calls return `{ success: boolean, data: any, error?: string }`
- Error boundary component untuk catch React errors
- Custom hooks (`useApi`, `useAuth`) untuk state management

### Nota Integrasi Backend
- API endpoint login: `POST /api/v1/auth/login`
- Response berjaya perlu mengembalikan `{ success: true, data: { token: "..." } }`
- Semua API calls menggunakan Bearer token authentication
- Fallback data tersedia jika API gagal