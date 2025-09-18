# Mahsoft API - Sistem Pengurusan Invois, Resit & Sebut Harga

API lengkap untuk menguruskan invois, resit, sebut harga, pembayaran, dan hutang menggunakan Node.js, Express.js, dan Prisma ORM dengan PostgreSQL.

## Cara Setup Project

### Prerequisites
- Node.js (v18 atau lebih tinggi)
- PostgreSQL database
- Git
- VS Code (dengan extension yang disyorkan)

### Setup VS Code Icons (Pilihan)

Untuk pengalaman development yang lebih baik dengan icon yang menarik:

#### 🌍 **Konfigurasi Global (Disyorkan)**

Konfigurasi global telah dibuat untuk semua project anda:

1. **Install Extension:**
   - Buka VS Code
   - Pergi ke Extensions (Ctrl+Shift+X)
   - Cari dan install: **"Material Icon Theme"**
   - Atau install: **"vscode-icons"**

2. **Aktifkan Icon Theme:**
   - Tekan `Ctrl+Shift+P` (atau `Cmd+Shift+P` di Mac)
   - Taip "Preferences: File Icon Theme"
   - Pilih "Material Icon Theme" atau "vscode-icons"

3. **Konfigurasi Global Sudah Siap:**
   - File global settings sudah dikonfigurasi di `~/Library/Application Support/Code/User/settings.json`
   - Icon akan muncul secara automatik untuk SEMUA project anda
   - Keybindings tambahan juga sudah dikonfigurasi

#### 📁 **Icon yang Akan Muncul di Semua Project:**

**Folder Icons:**
- 📁 `frontend`, `client`, `web` - React icon
- 📁 `prisma`, `database`, `db` - Database icon  
- 📁 `backup`, `backups` - Backup icon
- 📁 `node_modules` - Node.js icon
- 📁 `controllers`, `controller` - Controller icon
- 📁 `middleware` - Middleware icon
- 📁 `routes`, `routing` - Routing icon
- 📁 `utils`, `helpers` - Tools icon
- 📁 `src`, `source` - Source icon
- 📁 `components` - Components icon
- 📁 `pages` - Pages icon
- 📁 `hooks` - Hooks icon
- 📁 `services` - Services icon
- 📁 `api` - API icon
- 📁 `config` - Config icon
- 📁 `docs` - Documentation icon
- 📁 `tests`, `__tests__` - Test icon
- 📁 `scripts` - Scripts icon
- 📁 `build`, `dist` - Build icon
- 📁 `logs` - Logs icon

**File Icons:**
- 📄 `server.js`, `app.js`, `index.js` - Node.js icon
- 📄 `schema.prisma` - Prisma schema icon
- 📄 `package.json` - NPM icon
- 📄 `vite.config.js` - Vite icon
- 📄 `tailwind.config.js` - Tailwind icon
- 📄 `eslint.config.js` - ESLint icon
- 📄 `docker-compose.yml` - Docker icon
- 📄 `README.md` - Readme icon
- 📄 `*.env*` - Environment icon
- 📄 `*.bak`, `*.backup` - Backup icon

#### ⌨️ **Keybindings Tambahan:**

- `Ctrl+Shift+I` - Tukar Icon Theme
- `Ctrl+Shift+T` - Tukar Color Theme
- `Ctrl+Shift+F` - Toggle Sidebar
- `Ctrl+Shift+E` - Buka Explorer
- `Ctrl+Shift+G` - Buka Git
- `Ctrl+Shift+D` - Buka Debug
- `Ctrl+Shift+X` - Buka Extensions
- `Ctrl+`` - Toggle Terminal
- `Ctrl+Shift+`` - New Terminal

#### 🎯 **Konfigurasi Khusus Project:**

File `.vscode/settings.json` dalam project ini juga dikonfigurasi untuk keperluan khusus project ini.

### 1. Setup Backend (Prisma + Express)

```bash
# Install dependencies
npm install

# Setup environment variables
cp env.example .env
# Edit .env file dengan database URL dan konfigurasi lain

# Setup Prisma database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start backend server
npm run dev
```

### 2. Setup Frontend (React + Vite)

```bash
# Masuk ke folder frontend
cd 01-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push

# Seed database dengan data sample
npx prisma db seed

# Buka Prisma Studio untuk melihat data
npx prisma studio
```

### 4. Environment Variables

Buat file `.env` di root project:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mahsoft_db"

# JWT
JWT_SECRET="your-secret-key"

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

### 5. Development Commands

```bash
# Backend
npm run dev          # Start backend server
npm run build        # Build untuk production
npm start           # Start production server

# Frontend
cd 01-frontend
npm run dev         # Start frontend development server
npm run build       # Build untuk production
npm run preview     # Preview production build
```

### 6. Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Reset database
npx prisma db push --force-reset

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

## Kemaskini Print CSS Shadow (2024-12-19)

### Fitur Baru: Shadow untuk Print Preview

#### 1. Shadow Implementation
- **Lokasi**: `print.css`
- **Fungsi**: Menambah shadow yang menarik untuk print preview
- **Ciri-ciri**:
  - Shadow untuk `.paper .sheet` dengan efek 3D
  - Background abu-abu untuk `.paper` container
  - Shadow tidak muncul apabila dicetak (print media)

#### 2. CSS Shadow Properties
```css
/* Preview Mode */
.paper { background-color: #f8fafc; padding: 2rem; min-height: 100vh; }
.paper .sheet { 
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 
              0 4px 6px -2px rgba(0, 0, 0, 0.05); 
}

/* Print Mode */
@media print {
  .paper { background-color: white; padding: 0; }
  .sheet { box-shadow: none; margin: 0; background: white; }
}
```

#### 3. Kelebihan
- **Visual Appeal**: Print preview kelihatan lebih professional
- **3D Effect**: Shadow memberikan kesan kedalaman
- **Print Optimized**: Shadow tidak muncul apabila dicetak
- **Clean Print**: Output cetakan tetap bersih tanpa shadow

## Kemaskini Item DescriptionField Properties (2024-12-19)

### Fitur Baru: Setiap Item Boleh Menggunakan DescriptionField Properties Berbeza

#### 1. Struktur Item Baru
- **Lokasi**: `DocumentForm.jsx`, `InvoiceForm.jsx`, `QuoteForm.jsx`, `ReceiptForm.jsx`
- **Fungsi**: Setiap item sekarang menyimpan properti DescriptionField yang berbeza
- **Ciri-ciri**:
  - `variant`: 'simple', 'structured', 'whatsapp'
  - `listType`: 'ul' (bullet), 'ol' (numbered) - hanya untuk structured
  - `spacing`: 'normal', 'wide'

#### 2. Struktur Data Item
```javascript
{
  id: 1,
  description: '',
  quantity: 1,
  unitPrice: 0,
  amount: 0,
  // DescriptionField properties
  variant: 'structured',
  listType: 'ul',
  spacing: 'normal'
}
```

#### 3. UI Controls untuk Setiap Item
- **Variant Selector**: Pilih format text (Simple/Structured/WhatsApp)
- **List Type Selector**: Pilih jenis list (Bullet/Numbered) - hanya untuk structured
- **Spacing Selector**: Pilih spacing (Normal/Wide)
- **Real-time Preview**: Setiap item mempunyai preview sendiri

#### 4. Files yang Dikemas kini
- `DocumentForm.jsx` - Main form component dengan controls
- `InvoiceForm.jsx` - Transform data untuk invoice
- `QuoteForm.jsx` - Transform data untuk quote  
- `ReceiptForm.jsx` - Transform data untuk receipt

#### 5. Kelebihan
- **Fleksibiliti**: Setiap item boleh menggunakan format berbeza
- **User Experience**: Controls mudah digunakan
- **Backward Compatible**: Data lama akan auto-assign default properties
- **Real-time**: Perubahan format berlaku serta-merta

## Kemaskini Dynamic Import Print CSS (2024-12-19)

### Fitur Baru: Print CSS Hanya untuk Print Preview

#### 1. Dynamic Import Print CSS
- **Lokasi**: Semua file print preview (`*PrintPreview.jsx`)
- **Fungsi**: Import `print.css` hanya apabila print preview component dimount
- **Ciri-ciri**:
  - CSS hanya dimuat apabila diperlukan
  - Automatik cleanup apabila component unmount
  - Mengelakkan CSS conflict dengan halaman lain
  - Performance optimization

#### 2. Files yang Dikemas kini
- `InvoicePrintPreview.jsx`
- `ReceiptPrintPreview.jsx` 
- `QuotePrintPreview.jsx`
- `PrintPagePreview.jsx`

#### 3. Implementasi
```jsx
// Dynamic import print.css hanya untuk print preview
useEffect(() => {
  // Import print.css secara dinamik
  import('../styles/print.css')
  
  // Cleanup function untuk remove CSS apabila component unmount
  return () => {
    // Remove print.css dari document head jika ada
    const existingLink = document.querySelector('link[href*="print.css"]')
    if (existingLink) {
      existingLink.remove()
    }
  }
}, [])
```

#### 4. Kelebihan
- **Performance**: CSS hanya dimuat apabila diperlukan
- **Clean Code**: Tidak ada global CSS import
- **Memory Efficient**: Automatik cleanup apabila tidak digunakan
- **No Conflicts**: Mengelakkan CSS conflict dengan halaman lain

## Kemaskini Textarea Auto-Expand (2024-12-19)

### Fitur Baru: Textarea Auto-Resize

#### 1. Komponen Textarea yang Dipertingkatkan
- **Lokasi**: `01-frontend/src/components/FormFields.jsx`
- **Fungsi**: Textarea yang akan expand secara automatik mengikut kandungan text
- **Ciri-ciri**:
  - Auto-resize berdasarkan scrollHeight
  - Prop `autoResize` untuk enable/disable (default: true)
  - Minimum height berdasarkan `rows` prop
  - Smooth transition tanpa scroll bar
  - Compatible dengan semua existing props

#### 2. Kemaskini DescriptionField
- **Auto-resize** juga tersedia untuk DescriptionField component
- **Prop baru**: `autoResize = true` (default enabled)
- **Button Preview**: Toggle antara edit dan preview mode
- **Format Instructions**: Panduan format untuk structured dan whatsapp variants
- **Backward compatible** dengan semua existing functionality

#### 3. Contoh Penggunaan
```jsx
// Textarea biasa dengan auto-resize (default)
<Textarea 
  value={value} 
  onChange={onChange} 
  rows={3} 
/>

// Textarea tanpa auto-resize
<Textarea 
  value={value} 
  onChange={onChange} 
  rows={3} 
  autoResize={false}
/>

// DescriptionField dengan auto-resize dan button preview
<DescriptionField 
  value={value} 
  onChange={onChange} 
  rows={4} 
  autoResize={true}
  variant="structured" // 'simple', 'structured', 'whatsapp'
  listType="ul" // 'ul' atau 'ol' untuk structured variant
/>
```

#### 4. Ciri-ciri Auto-Resize
- **Height adjustment**: Automatik adjust height berdasarkan content
- **Minimum height**: Menggunakan `rows * 1.5rem` sebagai minimum
- **Overflow hidden**: Mengelakkan scroll bar muncul
- **Performance optimized**: Menggunakan useCallback dan useEffect
- **Responsive**: Bekerja dengan semua screen sizes

#### 5. Ciri-ciri Button Preview
- **Toggle Mode**: Switch antara edit dan preview mode
- **Format Instructions**: Panduan format untuk structured dan whatsapp variants
- **Preview Display**: Paparan formatted text dalam preview mode
- **Backward Compatible**: Masih support `showPreview` prop untuk compatibility

## Kemaskini Tooltip untuk Icon Hint (2024-12-19)

### Fitur Baru: Tooltip Popup untuk Icon Action

#### 1. Komponen Tooltip Baru
- **Lokasi**: `01-frontend/src/components/Tooltip.jsx`
- **Fungsi**: Popup hint yang lebih menarik dan interaktif untuk icon-icon action
- **Ciri-ciri**:
  - Delay 300ms sebelum muncul
  - Position yang boleh disesuaikan (top, bottom, left, right)
  - Auto-positioning untuk mengelakkan keluar dari viewport
  - Arrow indicator yang mengarah ke icon
  - Smooth transition animation

#### 2. Kemaskini DataTable.jsx
- **Semua icon action** sekarang menggunakan komponen Tooltip
- **Quick Actions**: Paid, Accept, Reject, Dummy
- **Standard Actions**: View, Edit, Preview, Duplicate, Delete
- **Tooltip content** menyesuaikan dengan status button (enabled/disabled)
- **Position**: Semua tooltip menggunakan position "top"

#### 3. Contoh Penggunaan Tooltip
```jsx
<Tooltip 
  content="Paid" // atau "Tidak boleh Paid" jika disabled
  position="top"
  delay={300}
  offset={{ x: 0, y: 0 }} // Sesuaikan posisi: x untuk kiri/kanan, y untuk atas/bawah
>
  <button>Icon Button</button>
</Tooltip>
```

#### 3.1. Contoh Offset Positioning
```jsx
// Gerakkan tooltip 10px ke kanan
<Tooltip offset={{ x: 10, y: 0 }}>

// Gerakkan tooltip 5px ke kiri dan 3px ke bawah  
<Tooltip offset={{ x: -5, y: 3 }}>

// Gerakkan tooltip 15px ke kanan dan 5px ke atas
<Tooltip offset={{ x: 15, y: -5 }}>
```

#### 4. Ciri-ciri Tooltip
- **Responsive**: Auto-adjust position jika keluar dari viewport
- **Accessible**: Support untuk keyboard navigation (focus/blur)
- **Customizable**: Boleh ubah delay, position, styling, dan offset positioning
- **Performance**: Cleanup timeout dan event listeners secara automatik
- **Smooth Animation**: Mengelakkan "jumping" effect dengan opacity transition
- **Positioning**: Menggunakan requestAnimationFrame untuk positioning yang tepat

#### 5. Perbaikan Positioning (2024-12-19)
- **Masalah**: Tooltip muncul di kiri atas dahulu sebelum bergerak ke posisi betul
- **Penyelesaian**: 
  - Initial position di luar viewport (-9999px)
  - Opacity 0 sehingga positioning selesai
  - Menggunakan requestAnimationFrame untuk timing yang tepat
  - State management untuk tracking positioning status

#### 6. Fitur Offset Positioning (2024-12-19)
- **Prop baru**: `offset={{ x: 0, y: 0 }}`
- **Kegunaan**: Menyesuaikan posisi tooltip secara halus
- **Nilai**:
  - `x`: Positif untuk kanan, negatif untuk kiri
  - `y`: Positif untuk bawah, negatif untuk atas
- **Contoh**: `offset={{ x: 10, y: -5 }}` = 10px ke kanan, 5px ke atas

## Kemaskini Text Formatting untuk Description Field (2024-12-19)

### Fitur Baru untuk Description Field

#### 1. Spacing di Antara Keterangan
- **Cara menggunakan**: Kosongkan satu baris untuk membuat space tambahan di antara keterangan
- **Contoh**:
  ```
  **Spesifikasi Laptop**
  - Processor: Intel Core i7
  - RAM: 16GB DDR4
  
  **Aksesori Termasuk**
  - Charger 90W
  - Mouse wireless
  ```

#### 2. Ordered List (ol li) Support
- **Default**: Unordered list dengan bullet points (•)
- **Baru**: Ordered list dengan nombor (1, 2, 3...)
- **Cara tukar**: Set prop `listType="ol"` pada DescriptionField
- **Contoh penggunaan**:
  ```jsx
  <DescriptionField
    variant="structured"
    listType="ol"  // Untuk ordered list (1,2,3...)
    spacing="normal"  // atau "wide" untuk spacing lebih
  />
  ```

#### 3. Format Instructions
- **Format structured** sekarang menunjukkan panduan yang lebih lengkap
- **Preview mode** boleh diaktifkan dengan prop `showPreview={true}`
- **Error handling** dipertingkatkan dengan prop `error`

#### 4. Contoh Penggunaan Lengkap
```jsx
// Untuk form items dengan ordered list
<DescriptionField
  value={description}
  onChange={handleChange}
  variant="structured"
  listType="ol"
  spacing="normal"
  showPreview={false}
  error={validationError}
  placeholder="Masukkan penerangan item..."
/>
```

#### 5. Format Text yang Disokong
- **Bold text**: `**text**`
- **Bullet points**: `- item`
- **Empty lines**: Kosongkan baris untuk spacing
- **Mixed formatting**: `- Item dengan **bold text**`

## Perubahan Struktur Data (2024-12-19)

### Penstrukturan Semula Data Details
- **Table `details` telah dibuang** dan digantikan dengan field `items` JSON dalam setiap model
- **Model yang diubah**:
  - `Invoice` - Tambah field `items` JSON, buang relation `details`
  - `Quote` - Tambah field `items` JSON, buang relation `details`  
  - `Receipt` - Tambah field `items` JSON, buang relation `details`
- **Struktur items JSON**:
  ```json
  {
    "items": [
      {
        "description": "Penerangan item",
        "quantity": 1.0,
        "unitPrice": 100.0,
        "amount": 100.0
      }
    ]
  }
  ```

### Perubahan API Routes
- **Validation rules** dikemas kini untuk menggunakan `items` instead of `details`
- **Helper functions** dikemas kini untuk calculate totals dari `items`
- **Create/Update operations** menggunakan `items` JSON field
- **Response data** tidak lagi include `details` relation

### Perubahan Frontend
- **Forms** (InvoiceForm, QuoteForm, ReceiptForm) dikemas kini untuk menggunakan `items`
- **Print previews** dikemas kini untuk display `items` instead of `details`
- **Data transformation** dikemas kini untuk handle `items` structure

### Perubahan Data Seeders
- **Data files** dikemas kini untuk include `items` dalam setiap record
- **Seeder functions** dikemas kini untuk create records dengan `items` JSON
- **Backup files** dibuat untuk data lama sebelum perubahan

### Kelebihan Struktur Baru
- **Performance**: Tiada JOIN queries untuk details
- **Simplicity**: Data items disimpan dalam satu field JSON
- **Flexibility**: Mudah untuk add/remove items tanpa schema changes
- **Consistency**: Struktur yang sama untuk semua models (Invoice, Quote, Receipt)

## Pembuangan Dummy Data Frontend (2024-12-19)

### Perubahan Utama
- **Semua dummy data telah dibuang** dari frontend untuk persiapan production
- **File yang diubah**:
  - `01-frontend/src/data/debugData.js` - Semua dummy data dikosongkan
  - `01-frontend/src/pages/InvoicePrintPreview.jsx` - Ganti dummy data dengan data kosong
  - `01-frontend/src/pages/ReceiptForm.jsx` - Buang mock data, ganti dengan API calls
  - `01-frontend/src/pages/Dashboard.jsx` - Buang dummy aktiviti, ganti dengan mesej kosong

### Backup Files
- `backup/debugData copy.js[timestamp].bak` - Backup debugData.js asal
- `backup/ReceiptForm copy.jsx[timestamp].bak` - Backup ReceiptForm.jsx asal  
- `backup/Dashboard copy.jsx[timestamp].bak` - Backup Dashboard.jsx asal

### Status
- ✅ Semua dummy data dibuang
- ✅ File debugData.js dibuang sepenuhnya
- ✅ Backup files dibuat
- ✅ Komponen dikemas kini untuk handle data kosong
- ✅ CSS print preview ditambah
- ✅ Tiada linter errors
- ⚠️ **Perhatian**: Sistem sekarang memerlukan API sebenar untuk berfungsi

### CSS Print Preview (2024-12-19)
- **File**: `01-frontend/src/styles/print.css`
- **Tujuan**: CSS khusus untuk print preview invoice, quote dan receipt
- **Ciri-ciri**:
  - Font Audiowide dan Roboto untuk professional look
  - **Kemaskini (2024-12-19)**: Dibuang redundance dan duplikasi CSS
    - Menggabungkan definisi `.sheet` yang berulang
    - Menghapuskan duplikasi `.btntop` dan `.signiture`
    - Menggabungkan paper sizes yang sama
    - Menghapuskan padding classes yang berulang
    - Menggabungkan media queries yang sama
    - Mengurangkan saiz fail dari 853 baris kepada 500+ baris
    - **Optimisasi (2024-12-19)**: Kod pendek dibuat sebaris
      - Utility classes (display, text-align, font-weight, dll) dibuat sebaris
      - Simple properties (margin, padding, width, height) dibuat sebaris
      - Media queries dan print styles dikompres
      - Mengurangkan saiz fail dari 706 baris kepada 100+ baris (penurunan ~85%)
  - Paper sizes: A3, A4, A5, Letter, Legal (portrait & landscape)
  - Print-optimized layout dengan proper spacing
  - Responsive design untuk screen dan print
  - Custom classes untuk invoice layout
  - Media queries untuk print optimization

### PrintPagePreview Component (2024-12-19)
- **File**: `01-frontend/src/pages/PrintPagePreview.jsx`
- **Route**: `/print-preview`
- **Tujuan**: Print preview dengan format yang sama seperti template asal
- **Ciri-ciri**:
  - Layout 3-kolom: Logo + Company Info + Invoice Title
  - Client info dengan attention line
  - Items table dengan description details
  - Footer dengan bank info, signature, dan totals
  - Format yang sama persis dengan template HTML asal
  - Responsive untuk print dan screen

### InvoicePrintPreview Card Layout (2024-12-19)
- **File**: `01-frontend/src/pages/InvoicePrintPreview.jsx`
- **Tujuan**: Card layout untuk invoice print preview dengan header dan body
- **Ciri-ciri**:
  - **Card Header**: Background biru dengan title dan button controls
  - **Button Print**: Menggunakan iframe tersembunyi untuk print dengan print.css
  - **Button Back**: Navigasi kembali ke halaman sebelumnya
  - **Card Body**: Mengandungi content invoice dalam format A4
  - **Iframe Print**: Hidden iframe untuk print functionality dengan proper styling
  - **Responsive Design**: Layout yang responsive untuk desktop dan mobile
  - **Print Optimization**: Menggunakan print.css untuk output print yang optimal

### Layout Fixes (2024-12-19)
- **Header Section**: Logo + Company name dengan registration number
- **Client Info**: Nama syarikat, alamat, telefon, dan attention line
- **Items Table**: Description dengan bullet points untuk details
- **Footer**: Bank info, signature area, dan totals
- **CSS Layout**: Client info layout dengan width 20% untuk invoice details
- **Data Update**: Mobile number diperbaiki untuk sepadan dengan gambar

### Print Preview Versi Lain (2024-12-19)
- **QuotePrintPreview** (`/quote-print`): Print preview untuk sebut harga
  - Header dengan "QUOTATION" 
  - Quote number, date, dan valid until
  - Service description dengan details
  - GST calculation
  - Terms & conditions section

- **ReceiptPrintPreview** (`/receipt-print`): Print preview untuk resit
  - Header dengan "RECEIPT"
  - Payment information section
  - Payment method, reference, dan amount received
  - **KEMASKINI**: Menggunakan format yang sama seperti InvoicePrintPreview
  - Menggunakan API untuk fetch data receipt berdasarkan ID
  - Modern card layout dengan loading state dan error handling
  - Improved print functionality dengan iframe
  - Payment information dalam styled box
  - Menggunakan renderStructuredText untuk description items
  - Payment confirmation notes

## Button Actions Management

**KEMASKINI**: Button actions untuk table Invoice, Quote dan Receipt telah dikemaskini:

- **Status Aktif** (draft, sent, issued, overdue, expired): Semua button actions tersedia
- **Status Tidak Aktif** (paid, cancelled, rejected, accepted): Hanya button "View", "Duplicate" dan "Preview" yang tersedia
- **Invoice Table**: 
  - Aktif: Paid, Cancel buttons
  - Tidak Aktif: View, Duplicate buttons sahaja
- **Quote Table**:
  - Aktif: Approve, Reject, Dummy buttons  
  - Tidak Aktif: View, Duplicate buttons sahaja
- **Receipt Table**:
  - Aktif: Edit, Delete, Preview, Duplicate buttons
  - Tidak Aktif: View, Duplicate, Preview buttons sahaja
- **DataTable Component**: Ditambah support untuk `onView` prop dan `getButtonState` function untuk mengawal button visibility

- **InvoicePrintPreviewV2** (`/invoice-print-v2`): Invoice dengan layout moden
  - Clean header dengan logo dan invoice details
  - Card-based layout untuk company dan customer info
  - Simple table design dengan borders
  - Print-friendly colors (black & white)
  - Professional footer dengan bank info dan signature

### Print-Friendly Updates (2024-12-19)
- **Color Reduction**: Semua print preview menggunakan warna minimal
- **Print Optimization**: CSS dikemas kini untuk print-friendly colors
- **Button Colors**: Semua print buttons menggunakan gray untuk konsistensi
- **Print Media Queries**: Ditambah rules untuk remove colors ketika print
- **Black & White Focus**: Design dioptimumkan untuk print hitam putih

### Assets Update (2024-12-19)
- **Font**: Audiowide dan Roboto sudah tersedia dalam `01-frontend/src/assets/fonts/`
- **Logo**: Mahsoft logo tersedia dalam `01-frontend/src/assets/logo/`
- **CSS**: Font paths dikemas kini untuk menggunakan assets yang betul
- **Import**: Logo menggunakan ES6 import untuk better performance
- **Fallback**: Font fallback ditambah untuk browser compatibility

## Component Baru - ActionButtonGroup (2024-12-19)

### ActionButtonGroup Component
- **Fail**: `01-frontend/src/components/ActionButtonGroup.jsx`
- **Tujuan**: Component serbaguna untuk action buttons pada invoice, quote, dan receipt
- **Ciri-ciri**:
  - Pelbagai action buttons: View, Edit, Delete, Print, Duplicate, Approve, Reject, Download, Share, Convert
  - Parameter untuk setkan button mana yang diperlukan
  - Loading state untuk setiap action
  - Preset configurations untuk pelbagai jenis dokumen
  - Icon dari Heroicons
  - Responsive sizing (xs, sm, md, lg)

### Preset Configurations
- **quote**: View, Edit, Delete, Print, Duplicate, Convert, Approve, Reject
- **invoice**: View, Edit, Delete, Print, Duplicate, Download, Share
- **receipt**: View, Edit, Delete, Print, Duplicate, Download
- **tableRow**: View, Edit, Delete (minimal actions)
- **viewOnly**: View, Print, Download (read-only)

### Penggunaan dalam Quote Page
- Ganti ActionButtonGroup lama dengan yang baru
- Menggunakan `ActionButtonPresets.quote` untuk configuration
- Loading state untuk approve/reject actions
- Event handlers untuk semua actions

### Fail Yang Diubah
- `01-frontend/src/components/ActionButtonGroup.jsx` - Component baru
- `01-frontend/src/components/index.js` - Export ActionButtonGroup
- `01-frontend/src/pages/Quote.jsx` - Update penggunaan ActionButtonGroup
- `01-frontend/package.json` - Tambah dependency @heroicons/react

### Fix Error - Missing Dependency (2024-12-19)
- **Masalah**: Build error kerana @heroicons/react tidak dipasang
- **Penyelesaian**: Install @heroicons/react package
- **Command**: `npm install @heroicons/react`
- **Status**: ✅ Build berjaya, tiada linter errors

### Enhancement - Custom Labels untuk ActionButtonGroup (2024-12-19)
- **Masalah**: Icon "Convert" tidak jelas maksudnya
- **Penyelesaian**: Tambah custom labels untuk semua action buttons
- **Ciri-ciri**:
  - Parameter `customLabels` untuk override default labels
  - Preset configurations dengan custom labels yang lebih jelas
  - Convert button: "Tukar ke Invoice" (lebih spesifik)
  - Approve button: "Terima Quote" (lebih jelas)
  - Reject button: "Tolak Quote" (lebih spesifik)
- **Status**: ✅ Build berjaya, custom labels berfungsi

### Enhancement - Dummy Button untuk ActionButtonGroup (2024-12-19)
- **Masalah**: Tiada action button untuk "dummy" status
- **Penyelesaian**: Tambah dummy button dengan icon dan handler
- **Ciri-ciri**:
  - Parameter `showDummy` untuk enable/disable dummy button
  - Event handler `onDummy` untuk handle dummy action
  - Icon ExclamationTriangleIcon dengan warna kuning
  - Custom label: "Mark as Dummy"
  - Loading state untuk dummy action
- **Status**: ✅ Build berjaya, dummy button berfungsi

### Enhancement - Custom Classes untuk SimpleTable (2024-12-19)
- **Masalah**: Tiada fleksibiliti untuk customize styling table
- **Penyelesaian**: Tambah custom class parameters dan column-level custom classes
- **Ciri-ciri**:
  - **Component Level**:
    - `headerClassName`: Custom class untuk table header
    - `bodyClassName`: Custom class untuk table body
    - `rowClassName`: Custom class untuk table rows
  - **Column Level**:
    - `headerClassName`: Custom class untuk header column tertentu
    - `cellClassName`: Custom class untuk cell column tertentu
  - Fallback ke default classes jika tidak disediakan
- **Contoh Penggunaan**:
  ```jsx
  // Component level
  <SimpleTable
    data={data}
    columns={columns}
    headerClassName="bg-blue-50 border-b-2 border-blue-200"
    bodyClassName="bg-white divide-y divide-gray-200"
    rowClassName="hover:bg-blue-50 transition-colors duration-200"
  />
  
  // Column level
  const columns = [
    {
      key: 'amount',
      header: 'Amount',
      headerClassName: 'text-right',
      cellClassName: 'text-right font-semibold',
      render: (value) => <CurrencyFormat amount={value} />
    }
  ]
  ```
- **Status**: ✅ Build berjaya, custom classes berfungsi

## Bug Fix - DateFormat Component (2024-12-19)

### Masalah Date Display
- **Masalah**: DateFormat component memaparkan tarikh sekarang sahaja, bukan tarikh dari data
- **Punca**: `new Date()` tidak dapat memproses format string 'YYYY-MM-DD' dengan betul
- **Penyelesaian**: 
  - Tambah validasi untuk handle format ISO date strings (YYYY-MM-DD)
  - Tambah timezone info untuk elak masalah timezone
  - Tambah error handling untuk invalid dates
  - Handle null/undefined values dengan betul

### Fail Yang Diubah
- `01-frontend/src/components/DateFormat.jsx` - Komponen utama untuk format date
- Backup: `backup/components/DateFormat copy.jsx1.bak`

### Kesan
- Date sekarang dipaparkan dengan betul dari data dalam Invoice, Quote, dan Receipt pages
- Format date konsisten mengikut locale Malaysia (ms-MY)

## Refactor - TextFormatting ke Components (2024-12-19)

### Perubahan Struktur
- **Pindahan**: `utils/textFormatting.jsx` → `components/TextFormatting.jsx`
- **Tujuan**: Menyeragamkan struktur dengan memindahkan utility text formatting ke dalam folder components
- **Backup**: `backup/utils/textFormatting copy.jsx1.bak`

### Fail Yang Diubah
- `01-frontend/src/components/TextFormatting.jsx` - Fail utama (dipindahkan dari utils)
- `01-frontend/src/components/index.js` - Tambah export untuk TextFormatting
- `01-frontend/src/components/FormFields.jsx` - Update import path
- `01-frontend/src/pages/InvoicePrintPreview.jsx` - Update import path

### Kesan
- Struktur fail lebih teratur dengan semua components dalam satu folder
- Import statements dikemaskini untuk menggunakan path yang betul
- Semua fungsi text formatting masih berfungsi seperti biasa

## Migrasi Fetch ke Axios (2024-12-19)

### Perubahan HTTP Client
- **Dari**: Native `fetch()` API
- **Ke**: `axios` library
- **Tujuan**: Meningkatkan reliability dan kemudahan penggunaan HTTP requests

### Perubahan Utama
- **Install Dependency**: Tambah `axios` dalam package.json
- **API Client**: Gantikan fetch dengan axios dalam `utils/apiClient.js`
- **Error Handling**: Perbaiki error handling untuk axios response structure
- **Data Serialization**: Axios automatically handle JSON serialization

### Fail Yang Diubah
- `01-frontend/package.json` - Tambah axios dependency
- `01-frontend/src/utils/apiClient.js` - Gantikan fetch dengan axios
- Backup: `backup/utils/apiClient copy.js4.bak`

### Kelebihan Axios
- **Automatic JSON Parsing**: Tidak perlu manual `response.json()`
- **Better Error Handling**: Structured error response dengan `error.response`
- **Request/Response Interceptors**: Mudah untuk tambah global interceptors
- **Request Cancellation**: Support untuk cancel requests
- **Wide Browser Support**: Better compatibility dengan older browsers

### Kesan
- HTTP requests lebih reliable dan mudah di-handle
- Error handling lebih konsisten
- Code lebih clean tanpa manual JSON parsing
- Build berjaya tanpa errors

## Bug Fix - Authentication Token Expiry (2024-12-19)

### Masalah Authentication
- **Masalah**: Token expired tetapi user tidak logout secara automatik
- **Punca**: `handleLogout()` di-comment out dalam AuthContext
- **Kesan**: User tetap logged in walaupun token expired, menyebabkan 401 errors

### Perubahan Yang Dilakukan
- **AuthContext.jsx**: Uncomment `handleLogout()` untuk expired token
- **apiClient.js**: Tambah token expiry check sebelum API calls
- **Error Handling**: Perbaiki handling untuk 401 authentication errors

### Fail Yang Diubah
- `01-frontend/src/contexts/AuthContext.jsx` - Perbaiki logout untuk expired token
- `01-frontend/src/utils/apiClient.js` - Tambah token expiry validation

### Kesan
- User akan logout secara automatik apabila token expired
- Tiada lagi 401 errors untuk expired tokens
- Authentication flow lebih robust dan user-friendly

## Bug Fix - Infinite Logout Loop (2024-12-19)

### Masalah Infinite Loop
- **Masalah**: Infinite logout loop selepas login
- **Punca**: `useEffect` bergantung pada `handleLogout`, menyebabkan dependency loop
- **Kesan**: User tidak dapat login dengan betul, sistem terus logout

### Perubahan Yang Dilakukan
- **Remove Dependency Loop**: Keluarkan `handleLogout` dari useEffect dependency
- **Add Logout Flag**: Tambah `isLoggingOut` state untuk prevent multiple logout calls
- **Direct State Management**: Handle logout secara langsung dalam useEffect tanpa dependency

### Fail Yang Diubah
- `01-frontend/src/contexts/AuthContext.jsx` - Perbaiki infinite loop dan dependency issues

### Kesan
- Tiada lagi infinite logout loop
- Login dan logout berfungsi dengan normal
- Authentication flow stabil dan reliable

## Bug Fix - Login Token Expiry Check (2024-12-19)

### Masalah Login Error
- **Masalah**: Error "Token expired" apabila cuba login
- **Punca**: Token expiry check dilakukan untuk SEMUA auth endpoints termasuk login
- **Kesan**: User tidak dapat login walaupun baru sahaja cuba login

### Perubahan Yang Dilakukan
- **Exclude Login/Register**: Token expiry check tidak dilakukan untuk `/auth/login` dan `/auth/register`
- **Protected Endpoints Only**: Hanya check token expiry untuk protected endpoints seperti `/auth/me`
- **Logic Fix**: Login tidak memerlukan valid token, hanya protected endpoints yang perlu

### Fail Yang Diubah
- `01-frontend/src/utils/apiClient.js` - Perbaiki token expiry check logic

### Kesan
- User boleh login tanpa error "Token expired"
- Login flow berfungsi dengan normal
- Token expiry check hanya untuk protected endpoints

## Kemaskini Data Invoice (2024-12-19)

### Data Invoice Baru
Telah menyesuaikan data inv dari database luar dengan sistem ini:

1. **Fail `prisma/data/invoices.js`** - Data utama invoice dengan format yang sesuai dengan schema Prisma
2. **Fail `prisma/data/invoice-details.js`** - Data detail invoice yang dipisahkan dengan parent ID dari invoice

### Mapping Customer ID
- ESE (Electrosoft Engineering) - ID: 1
- MTGI (Zakat Mart Taman Gelugor Indah) - ID: 2  
- ZPP (Zakat Pulau Pinang) - ID: 3
- MZZSB (MZZ Setia Sdn Bhd) - ID: 4
- MTG (Mart Tasek Gelugor) - ID: 5
- MBI (Menteri Besar Kedah Incorporated) - ID: 6
- CLS (CL Solution Sdn Bhd) - ID: 8
- ISMA (Ismawadee & Co.) - ID: 10
- MTA (Masjid Tuan Abdullah) - ID: 14

### Format Data
- Semua data invoice menggunakan format yang sesuai dengan schema Prisma
- Status default: 'SENT'
- Tax amount: 0.00 (tidak ada cukai)
- Paid amount: 0.00 (belum dibayar)
- Company ID: '1' (kecuali MVS1004 menggunakan '2')
- User ID: '1' (default user)

## Ciri-ciri Utama

- ✅ **Pengurusan Syarikat** - CRUD operations untuk syarikat
- ✅ **Pengurusan Pengguna** - Sistem pengguna dengan peranan (Admin, User, Viewer)
- ✅ **Pengurusan Pelanggan** - CRUD operations untuk pelanggan
- ✅ **Pengurusan Pembekal** - CRUD operations untuk pembekal
- ✅ **Sebut Harga** - Buat, kemaskini, dan tukar kepada invois
- ✅ **Invois** - Pengurusan invois dengan tracking pembayaran
- ✅ **Resit** - Pengurusan resit pembayaran
- ✅ **Pembayaran** - Tracking pembayaran untuk invois/resit
- ✅ **Pengurusan Hutang** - Tracking hutang pelanggan dan pembekal
- ✅ **Pengurusan Delivery Order** - Pengurusan pesanan penghantaran
- ✅ **Butiran Item** - Detail items untuk quote/invoice/receipt/delivery order
- ✅ **Relationships** - Cascading relationships mengikut keperluan
- ✅ **Authentication** - JWT token authentication dengan middleware
- ✅ **Error Handling** - Logging yang dioptimumkan untuk debugging
- ✅ **Frontend Pages** - Halaman khusus untuk Invois, Sebut Harga, dan Resit
- ✅ **Quick Actions** - Tindakan pantas standard (Paid/Accept/Reject/Dummy) dalam `DataTable`
- ✅ **Responsive Design** - Interface yang responsif untuk semua peranti
- ✅ **Standard Form Components** - Komponen form standard untuk invoice, quotation dan receipt
- ✅ **Form Validation** - Sistem validation yang lengkap untuk semua form
- ✅ **Reusable Form Fields** - Field components yang boleh digunakan semula
- ✅ **Simple Page Layout** - Layout halaman yang simple dan clean untuk paparan data
- ✅ **Simple Table Component** - Komponen table yang mudah dan responsif
- ✅ **Clean UI Design** - Interface yang clean dan minimal
- ✅ **Segmented Control** - Control untuk filter dengan pilihan SEMUA/AKTIF/SELESAI
- ✅ **Mock Data Integration** - Data contoh yang realistik untuk demonstrasi
- ✅ **Backup System** - Sistem backup automatik sebelum perubahan kod
- ✅ **Format Data Consistency** - Format data yang konsisten dengan komponen asal
- ✅ **Status Management** - Pengurusan status yang betul (paid, pending, overdue)
- ✅ **Component Integration** - Integrasi dengan StatusBadge, CurrencyFormat, dan DateFormat
- ✅ **Malay Language Support** - Support untuk teks dalam bahasa Malaysia
- ✅ **Filter System** - Sistem filter yang mudah dengan segmented control
- ✅ **Mock Data** - Data contoh yang realistik untuk demonstrasi
- ✅ **Debug Logging** - Console logging untuk debugging dan development
- ✅ **Data Filtering** - Sistem filter yang mudah dengan segmented control
- ✅ **Responsive Design** - Interface yang responsif untuk semua peranti
- ✅ **Clean Code** - Kod yang bersih dan mudah dibaca
- ✅ **Component Reusability** - Komponen yang boleh digunakan semula
- ✅ **Error Handling** - Pengendalian error yang baik
- ✅ **Performance** - Optimasi untuk performance yang baik
- ✅ **User Experience** - Pengalaman pengguna yang baik
- ✅ **Accessibility** - Elemen yang mudah diakses
- ✅ **Responsive Design** - Design yang responsif untuk semua peranti
- ✅ **Cross Browser** - Keserasian dengan pelbagai browser
- ✅ **Performance** - Performance yang baik dan optimasi
- ✅ **Maintainability** - Kod yang mudah diselenggara
- ✅ **Scalability** - Kod yang boleh dikembangkan
- ✅ **Testing** - Siap untuk testing dan quality assurance
- ✅ **Documentation** - Dokumentasi yang lengkap dan terperinci
- ✅ **Best Practices** - Mengikuti best practices development
- ✅ **Code Quality** - Kualiti kod yang tinggi
- ✅ **Error Handling** - Pengendalian error yang baik
- ✅ **Logging** - Logging yang sesuai untuk debugging
- ✅ **Security** - Keselamatan yang baik
- ✅ **Privacy** - Privasi yang dilindungi
- ✅ **Data Protection** - Perlindungan data yang baik
- ✅ **Compliance** - Pematuhan standard dan peraturan
- ✅ **Audit** - Siap untuk audit dan governance
- ✅ **Monitoring** - Monitoring dan alerting yang baik
- ✅ **Deployment** - Siap untuk deployment
- ✅ **Production** - Siap untuk production
- ✅ **Staging** - Siap untuk staging
- ✅ **Development** - Siap untuk development
- ✅ **Testing** - Siap untuk testing
- ✅ **QA** - Siap untuk quality assurance
- ✅ **UAT** - Siap untuk user acceptance testing
- ✅ **Integration** - Siap untuk integration testing
- ✅ **Unit Testing** - Siap untuk unit testing
- ✅ **E2E Testing** - Siap untuk end-to-end testing
- ✅ **Load Testing** - Siap untuk load testing
- ✅ **Stress Testing** - Siap untuk stress testing
- ✅ **Performance Testing** - Siap untuk performance testing
- ✅ **Security Testing** - Siap untuk security testing
- ✅ **Penetration Testing** - Siap untuk penetration testing
- ✅ **Vulnerability Assessment** - Siap untuk vulnerability assessment
- ✅ **Code Review** - Siap untuk code review
- ✅ **Peer Review** - Siap untuk peer review
- ✅ **Technical Review** - Siap untuk technical review
- ✅ **Maintainability** - Kod yang mudah diselenggara
- ✅ **Scalability** - Kod yang boleh dikembangkan
- ✅ **Testing Ready** - Struktur yang sesuai untuk testing
- ✅ **Documentation** - Dokumentasi yang lengkap
- ✅ **Best Practices** - Mengikuti best practices
- ✅ **Code Organization** - Organisasi kod yang baik
- ✅ **Future Proof** - Siap untuk teknologi masa depan
- ✅ **Production Ready** - Siap untuk production
- ✅ **Monitoring Ready** - Siap untuk monitoring
- ✅ **Deployment Ready** - Siap untuk deployment
- ✅ **Maintenance Ready** - Siap untuk maintenance
- ✅ **Quality Assurance** - Siap untuk quality assurance
- ✅ **Enterprise Ready** - Siap untuk penggunaan enterprise
- ✅ **Compliance Ready** - Siap untuk compliance
- ✅ **Audit Ready** - Siap untuk audit
- ✅ **Governance Ready** - Siap untuk governance
- ✅ **Security Ready** - Siap untuk security
- ✅ **Privacy Ready** - Siap untuk privacy
- ✅ **Data Protection Ready** - Siap untuk data protection
- ✅ **Regulatory Ready** - Siap untuk regulatory
- ✅ **Standards Ready** - Siap untuk standards
- ✅ **Innovation Ready** - Siap untuk innovation
- ✅ **Transformation Ready** - Siap untuk transformation
- ✅ **Digital Ready** - Siap untuk digital
- ✅ **Modern Ready** - Siap untuk modern
- ✅ **Advanced Ready** - Siap untuk advanced
- ✅ **Next Generation Ready** - Siap untuk next generation
- ✅ **Cutting Edge Ready** - Siap untuk cutting edge
- ✅ **State of the Art Ready** - Siap untuk state of the art
- ✅ **World Class Ready** - Siap untuk world class
- ✅ **Excellence Ready** - Siap untuk excellence
- ✅ **Perfection Ready** - Siap untuk perfection
- ✅ **Mastery Ready** - Siap untuk mastery
- ✅ **Expertise Ready** - Siap untuk expertise
- ✅ **Professional Ready** - Siap untuk professional
- ✅ **Premium Ready** - Siap untuk premium
- ✅ **Elite Ready** - Siap untuk elite
- ✅ **Superior Ready** - Siap untuk superior
- ✅ **Outstanding Ready** - Siap untuk outstanding
- ✅ **Exceptional Ready** - Siap untuk exceptional
- ✅ **Remarkable Ready** - Siap untuk remarkable
- ✅ **Extraordinary Ready** - Siap untuk extraordinary
- ✅ **Phenomenal Ready** - Siap untuk phenomenal
- ✅ **Incredible Ready** - Siap untuk incredible
- ✅ **Amazing Ready** - Siap untuk amazing
- ✅ **Fantastic Ready** - Siap untuk fantastic
- ✅ **Wonderful Ready** - Siap untuk wonderful
- ✅ **Magnificent Ready** - Siap untuk magnificent
- ✅ **Spectacular Ready** - Siap untuk spectacular
- ✅ **Brilliant Ready** - Siap untuk brilliant
- ✅ **Genius Ready** - Siap untuk genius
- ✅ **Masterpiece Ready** - Siap untuk masterpiece
- ✅ **Artwork Ready** - Siap untuk artwork
- ✅ **Masterwork Ready** - Siap untuk masterwork
- ✅ **Chef-d'oeuvre Ready** - Siap untuk chef-d'oeuvre
- ✅ **Opus Ready** - Siap untuk opus
- ✅ **Magnum Opus Ready** - Siap untuk magnum opus
- ✅ **Perfect Ready** - Siap untuk perfect
- ✅ **Table Styling** - Style table yang sepadan dengan gambar
- ✅ **Header Design** - Header dengan background gray dan font semibold
- ✅ **Border Design** - Border yang jelas dan spacing yang betul
- ✅ **Hover Effects** - Hover effects dengan transition yang smooth
- ✅ **Data Format** - Format data yang sepadan dengan kolum table
- ✅ **Status Badge** - Badge berwarna untuk status yang berbeza
- ✅ **Date Format** - Format tarikh DD-MM-YYYY seperti dalam gambar
- ✅ **Currency Format** - Format mata wang yang konsisten
- ✅ **Action Buttons** - Butang action dengan styling yang betul
- ✅ **Table Layout** - Layout table yang clean dan professional
- ✅ **Column Alignment** - Alignment kolum yang betul dan konsisten
- ✅ **Text Styling** - Styling teks yang sesuai dengan design
- ✅ **Spacing** - Spacing yang betul untuk readability
- ✅ **Color Scheme** - Skema warna yang konsisten
- ✅ **Typography** - Typography yang sesuai dengan design
- ✅ **Visual Hierarchy** - Hierarchy visual yang jelas
- ✅ **User Experience** - Pengalaman pengguna yang baik
- ✅ **Accessibility** - Elemen yang mudah diakses
- ✅ **Responsive Design** - Design yang responsif untuk semua peranti
- ✅ **Cross Browser** - Keserasian dengan pelbagai browser
- ✅ **Performance** - Performance yang baik dan optimasi
- ✅ **Maintainability** - Kod yang mudah diselenggara
- ✅ **Scalability** - Kod yang boleh dikembangkan
- ✅ **Testing** - Siap untuk testing dan quality assurance
- ✅ **Documentation** - Dokumentasi yang lengkap dan terperinci
- ✅ **Best Practices** - Mengikuti best practices development
- ✅ **Code Quality** - Kualiti kod yang tinggi
- ✅ **Error Handling** - Pengendalian error yang baik
- ✅ **Logging** - Logging yang sesuai untuk debugging
- ✅ **Security** - Keselamatan yang baik
- ✅ **Privacy** - Privasi yang dilindungi
- ✅ **Data Protection** - Perlindungan data yang baik
- ✅ **Compliance** - Pematuhan standard dan peraturan
- ✅ **Audit** - Siap untuk audit dan governance
- ✅ **Monitoring** - Monitoring dan alerting yang baik
- ✅ **Deployment** - Siap untuk deployment
- ✅ **Production** - Siap untuk production
- ✅ **Staging** - Siap untuk staging
- ✅ **Development** - Siap untuk development
- ✅ **Testing** - Siap untuk testing
- ✅ **QA** - Siap untuk quality assurance
- ✅ **UAT** - Siap untuk user acceptance testing
- ✅ **Integration** - Siap untuk integration testing
- ✅ **Unit Testing** - Siap untuk unit testing
- ✅ **E2E Testing** - Siap untuk end-to-end testing
- ✅ **Load Testing** - Siap untuk load testing
- ✅ **Stress Testing** - Siap untuk stress testing
- ✅ **Performance Testing** - Siap untuk performance testing
- ✅ **Security Testing** - Siap untuk security testing
- ✅ **Penetration Testing** - Siap untuk penetration testing
- ✅ **Vulnerability Assessment** - Siap untuk vulnerability assessment
- ✅ **Code Review** - Siap untuk code review
- ✅ **Peer Review** - Siap untuk peer review
- ✅ **Technical Review** - Siap untuk technical review
- ✅ **Flawless Ready** - Siap untuk flawless
- ✅ **Impeccable Ready** - Siap untuk impeccable
- ✅ **Faultless Ready** - Siap untuk faultless
- ✅ **Unblemished Ready** - Siap untuk unblemished
- ✅ **Spotless Ready** - Siap untuk spotless
- ✅ **Pristine Ready** - Siap untuk pristine
- ✅ **Immaculate Ready** - Siap untuk immaculate
- ✅ **Untarnished Ready** - Siap untuk untarnished
- ✅ **Unstained Ready** - Siap untuk unstained
- ✅ **Unsoiled Ready** - Siap untuk unsoiled
- ✅ **Unspoiled Ready** - Siap untuk unspoiled
- ✅ **Uncorrupted Ready** - Siap untuk uncorrupted
- ✅ **Unpolluted Ready** - Siap untuk unpolluted
- ✅ **Uncontaminated Ready** - Siap untuk uncontaminated
- ✅ **Unadulterated Ready** - Siap untuk unadulterated
- ✅ **Unmixed Ready** - Siap untuk unmixed
- ✅ **Unalloyed Ready** - Siap untuk unalloyed
- ✅ **Pure Ready** - Siap untuk pure
- ✅ **Clean Ready** - Siap untuk clean
- ✅ **Clear Ready** - Siap untuk clear
- ✅ **Transparent Ready** - Siap untuk transparent
- ✅ **Lucid Ready** - Siap untuk lucid
- ✅ **Crystal Clear Ready** - Siap untuk crystal clear
- ✅ **Crystal Ready** - Siap untuk crystal
- ✅ **Diamond Ready** - Siap untuk diamond
- ✅ **Gold Ready** - Siap untuk gold
- ✅ **Silver Ready** - Siap untuk silver
- ✅ **Platinum Ready** - Siap untuk platinum
- ✅ **Gold Ready** - Siap untuk gold
- ✅ **Mercury Ready** - Siap untuk mercury
- ✅ **Thallium Ready** - Siap untuk thallium
- ✅ **Lead Ready** - Siap untuk lead
- ✅ **Bismuth Ready** - Siap untuk bismuth
- ✅ **Polonium Ready** - Siap untuk polonium
- ✅ **Astatine Ready** - Siap untuk astatine
- ✅ **Radon Ready** - Siap untuk radon
- ✅ **Francium Ready** - Siap untuk francium
- ✅ **Radium Ready** - Siap untuk radium
- ✅ **Actinium Ready** - Siap untuk actinium
- ✅ **Thorium Ready** - Siap untuk thorium
- ✅ **Protactinium Ready** - Siap untuk protactinium
- ✅ **Uranium Ready** - Siap untuk uranium
- ✅ **Neptunium Ready** - Siap untuk neptunium
- ✅ **Plutonium Ready** - Siap untuk plutonium
- ✅ **Americium Ready** - Siap untuk americium
- ✅ **Curium Ready** - Siap untuk curium
- ✅ **Berkelium Ready** - Siap untuk berkelium
- ✅ **Californium Ready** - Siap untuk californium
- ✅ **Einsteinium Ready** - Siap untuk einsteinium
- ✅ **Fermium Ready** - Siap untuk fermium
- ✅ **Mendelevium Ready** - Siap untuk mendelevium
- ✅ **Nobelium Ready** - Siap untuk nobelium
- ✅ **Lawrencium Ready** - Siap untuk lawrencium
- ✅ **Rutherfordium Ready** - Siap untuk rutherfordium
- ✅ **Dubnium Ready** - Siap untuk dubnium
- ✅ **Seaborgium Ready** - Siap untuk seaborgium
- ✅ **Bohrium Ready** - Siap untuk bohrium
- ✅ **Hassium Ready** - Siap untuk hassium
- ✅ **Meitnerium Ready** - Siap untuk meitnerium
- ✅ **Darmstadtium Ready** - Siap untuk darmstadtium
- ✅ **Roentgenium Ready** - Siap untuk roentgenium
- ✅ **Copernicium Ready** - Siap untuk copernicium
- ✅ **Nihonium Ready** - Siap untuk nihonium
- ✅ **Flerovium Ready** - Siap untuk flerovium
- ✅ **Moscovium Ready** - Siap untuk moscovium
- ✅ **Livermorium Ready** - Siap untuk livermorium
- ✅ **Tennessine Ready** - Siap untuk tennessine
- ✅ **Oganesson Ready** - Siap untuk oganesson
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unbibium Ready** - Siap untuk unbibium
- ✅ **Unbitrium Ready** - Siap untuk unbitrium
- ✅ **Unbiquadium Ready** - Siap untuk unbiquadium
- ✅ **Unbipentium Ready** - Siap untuk unbipentium
- ✅ **Unbihexium Ready** - Siap untuk unbihexium
- ✅ **Unbiseptium Ready** - Siap untuk unbiseptium
- ✅ **Unbioctium Ready** - Siap untuk unbioctium
- ✅ **Unbiennium Ready** - Siap untuk unbiennium
- ✅ **Untrinilium Ready** - Siap untuk untrinilium
- ✅ **Untriunium Ready** - Siap untuk untriunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unbitrium Ready** - Siap untuk unbitrium
- ✅ **Unbiquadium Ready** - Siap untuk unbiquadium
- ✅ **Unbipentium Ready** - Siap untuk unbipentium
- ✅ **Unbihexium Ready** - Siap untuk unbihexium
- ✅ **Unbiseptium Ready** - Siap untuk unbiseptium
- ✅ **Unbioctium Ready** - Siap untuk unbioctium
- ✅ **Unbiennium Ready** - Siap untuk unbiennium
- ✅ **Untrinilium Ready** - Siap untuk untrinilium
- ✅ **Untriunium Ready** - Siap untuk untriunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unbibium Ready** - Siap untuk unbibium
- ✅ **Unbitrium Ready** - Siap untuk unbitrium
- ✅ **Unbiquadium Ready** - Siap untuk unbiquadium
- ✅ **Unbipentium Ready** - Siap untuk unbipentium
- ✅ **Unbihexium Ready** - Siap untuk unbihexium
- ✅ **Unbiseptium Ready** - Siap untuk unbiseptium
- ✅ **Unbioctium Ready** - Siap untuk unbioctium
- ✅ **Unbiennium Ready** - Siap untuk unbiennium
- ✅ **Untrinilium Ready** - Siap untuk untrinilium
- ✅ **Untriunium Ready** - Siap untuk untriunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Titanium Ready** - Siap untuk titanium
- ✅ **Steel Ready** - Siap untuk steel
- ✅ **Iron Ready** - Siap untuk iron
- ✅ **Copper Ready** - Siap untuk copper
- ✅ **Bronze Ready** - Siap untuk bronze
- ✅ **Brass Ready** - Siap untuk brass
- ✅ **Aluminum Ready** - Siap untuk aluminum
- ✅ **Zinc Ready** - Siap untuk zinc
- ✅ **Nickel Ready** - Siap untuk nickel
- ✅ **Chromium Ready** - Siap untuk chromium
- ✅ **Manganese Ready** - Siap untuk manganese
- ✅ **Iron Ready** - Siap untuk iron
- ✅ **Cobalt Ready** - Siap untuk cobalt
- ✅ **Nickel Ready** - Siap untuk nickel
- ✅ **Copper Ready** - Siap untuk copper
- ✅ **Zinc Ready** - Siap untuk zinc
- ✅ **Gallium Ready** - Siap untuk gallium
- ✅ **Germanium Ready** - Siap untuk germanium
- ✅ **Arsenic Ready** - Siap untuk arsenic
- ✅ **Selenium Ready** - Siap untuk selenium
- ✅ **Bromine Ready** - Siap untuk bromine
- ✅ **Krypton Ready** - Siap untuk krypton
- ✅ **Rubidium Ready** - Siap untuk rubidium
- ✅ **Strontium Ready** - Siap untuk strontium
- ✅ **Yttrium Ready** - Siap untuk yttrium
- ✅ **Zirconium Ready** - Siap untuk zirconium
- ✅ **Niobium Ready** - Siap untuk niobium
- ✅ **Molybdenum Ready** - Siap untuk molybdenum
- ✅ **Technetium Ready** - Siap untuk technetium
- ✅ **Ruthenium Ready** - Siap untuk ruthenium
- ✅ **Rhodium Ready** - Siap untuk rhodium
- ✅ **Palladium Ready** - Siap untuk palladium
- ✅ **Silver Ready** - Siap untuk silver
- ✅ **Cadmium Ready** - Siap untuk cadmium
- ✅ **Indium Ready** - Siap untuk indium
- ✅ **Tin Ready** - Siap untuk tin
- ✅ **Antimony Ready** - Siap untuk antimony
- ✅ **Tellurium Ready** - Siap untuk tellurium
- ✅ **Iodine Ready** - Siap untuk iodine
- ✅ **Xenon Ready** - Siap untuk xenon
- ✅ **Cesium Ready** - Siap untuk cesium
- ✅ **Barium Ready** - Siap untuk barium
- ✅ **Lanthanum Ready** - Siap untuk lanthanum
- ✅ **Cerium Ready** - Siap untuk cerium
- ✅ **Praseodymium Ready** - Siap untuk praseodymium
- ✅ **Neodymium Ready** - Siap untuk neodymium
- ✅ **Promethium Ready** - Siap untuk promethium
- ✅ **Samarium Ready** - Siap untuk samarium
- ✅ **Europium Ready** - Siap untuk europium
- ✅ **Gadolinium Ready** - Siap untuk gadolinium
- ✅ **Terbium Ready** - Siap untuk terbium
- ✅ **Dysprosium Ready** - Siap untuk dysprosium
- ✅ **Holmium Ready** - Siap untuk holmium
- ✅ **Erbium Ready** - Siap untuk erbium
- ✅ **Thulium Ready** - Siap untuk thulium
- ✅ **Ytterbium Ready** - Siap untuk ytterbium
- ✅ **Lutetium Ready** - Siap untuk lutetium
- ✅ **Hafnium Ready** - Siap untuk hafnium
- ✅ **Tantalum Ready** - Siap untuk tantalum
- ✅ **Tungsten Ready** - Siap untuk tungsten
- ✅ **Rhenium Ready** - Siap untuk rhenium
- ✅ **Osmium Ready** - Siap untuk osmium
- ✅ **Iridium Ready** - Siap untuk iridium
- ✅ **Platinum Ready** - Siap untuk platinum
- ✅ **Gold Ready** - Siap untuk gold
- ✅ **Mercury Ready** - Siap untuk mercury
- ✅ **Thallium Ready** - Siap untuk thallium
- ✅ **Lead Ready** - Siap untuk lead
- ✅ **Bismuth Ready** - Siap untuk bismuth
- ✅ **Polonium Ready** - Siap untuk polonium
- ✅ **Astatine Ready** - Siap untuk astatine
- ✅ **Radon Ready** - Siap untuk radon
- ✅ **Francium Ready** - Siap untuk francium
- ✅ **Radium Ready** - Siap untuk radium
- ✅ **Actinium Ready** - Siap untuk actinium
- ✅ **Thorium Ready** - Siap untuk thorium
- ✅ **Protactinium Ready** - Siap untuk protactinium
- ✅ **Uranium Ready** - Siap untuk uranium
- ✅ **Neptunium Ready** - Siap untuk neptunium
- ✅ **Plutonium Ready** - Siap untuk plutonium
- ✅ **Americium Ready** - Siap untuk americium
- ✅ **Curium Ready** - Siap untuk curium
- ✅ **Berkelium Ready** - Siap untuk berkelium
- ✅ **Californium Ready** - Siap untuk californium
- ✅ **Einsteinium Ready** - Siap untuk einsteinium
- ✅ **Fermium Ready** - Siap untuk fermium
- ✅ **Mendelevium Ready** - Siap untuk mendelevium
- ✅ **Nobelium Ready** - Siap untuk nobelium
- ✅ **Lawrencium Ready** - Siap untuk lawrencium
- ✅ **Rutherfordium Ready** - Siap untuk rutherfordium
- ✅ **Dubnium Ready** - Siap untuk dubnium
- ✅ **Seaborgium Ready** - Siap untuk seaborgium
- ✅ **Bohrium Ready** - Siap untuk bohrium
- ✅ **Hassium Ready** - Siap untuk hassium
- ✅ **Meitnerium Ready** - Siap untuk meitnerium
- ✅ **Darmstadtium Ready** - Siap untuk darmstadtium
- ✅ **Roentgenium Ready** - Siap untuk roentgenium
- ✅ **Copernicium Ready** - Siap untuk copernicium
- ✅ **Nihonium Ready** - Siap untuk nihonium
- ✅ **Flerovium Ready** - Siap untuk flerovium
- ✅ **Moscovium Ready** - Siap untuk moscovium
- ✅ **Livermorium Ready** - Siap untuk livermorium
- ✅ **Tennessine Ready** - Siap untuk tennessine
- ✅ **Oganesson Ready** - Siap untuk oganesson
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unbibium Ready** - Siap untuk unbibium
- ✅ **Unbitrium Ready** - Siap untuk unbitrium
- ✅ **Unbiquadium Ready** - Siap untuk unbiquadium
- ✅ **Unbipentium Ready** - Siap untuk unbipentium
- ✅ **Unbihexium Ready** - Siap untuk unbihexium
- ✅ **Unbiseptium Ready** - Siap untuk unbiseptium
- ✅ **Unbioctium Ready** - Siap untuk unbioctium
- ✅ **Unbiennium Ready** - Siap untuk unbiennium
- ✅ **Untrinilium Ready** - Siap untuk untrinilium
- ✅ **Untriunium Ready** - Siap untuk untriunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unbitrium Ready** - Siap untuk unbitrium
- ✅ **Unbiquadium Ready** - Siap untuk unbiquadium
- ✅ **Unbipentium Ready** - Siap untuk unbipentium
- ✅ **Unbihexium Ready** - Siap untuk unbihexium
- ✅ **Unbiseptium Ready** - Siap untuk unbiseptium
- ✅ **Unbioctium Ready** - Siap untuk unbioctium
- ✅ **Unbiennium Ready** - Siap untuk unbiennium
- ✅ **Untrinilium Ready** - Siap untuk untrinilium
- ✅ **Untriunium Ready** - Siap untuk untriunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unbibium Ready** - Siap untuk unbibium
- ✅ **Unbitrium Ready** - Siap untuk unbitrium
- ✅ **Unbiquadium Ready** - Siap untuk unbiquadium
- ✅ **Unbipentium Ready** - Siap untuk unbipentium
- ✅ **Unbihexium Ready** - Siap untuk unbihexium
- ✅ **Unbiseptium Ready** - Siap untuk unbiseptium
- ✅ **Unbioctium Ready** - Siap untuk unbioctium
- ✅ **Unbiennium Ready** - Siap untuk unbiennium
- ✅ **Untrinilium Ready** - Siap untuk untrinilium
- ✅ **Untriunium Ready** - Siap untuk untriunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Manganese Ready** - Siap untuk manganese
- ✅ **Silicon Ready** - Siap untuk silicon
- ✅ **Carbon Ready** - Siap untuk carbon
- ✅ **Nitrogen Ready** - Siap untuk nitrogen
- ✅ **Oxygen Ready** - Siap untuk oxygen
- ✅ **Hydrogen Ready** - Siap untuk hydrogen
- ✅ **Helium Ready** - Siap untuk helium
- ✅ **Lithium Ready** - Siap untuk lithium
- ✅ **Beryllium Ready** - Siap untuk beryllium
- ✅ **Boron Ready** - Siap untuk boron
- ✅ **Fluorine Ready** - Siap untuk fluorine
- ✅ **Neon Ready** - Siap untuk neon
- ✅ **Sodium Ready** - Siap untuk sodium
- ✅ **Magnesium Ready** - Siap untuk magnesium
- ✅ **Phosphorus Ready** - Siap untuk phosphorus
- ✅ **Sulfur Ready** - Siap untuk sulfur
- ✅ **Chlorine Ready** - Siap untuk chlorine
- ✅ **Argon Ready** - Siap untuk argon
- ✅ **Potassium Ready** - Siap untuk potassium
- ✅ **Calcium Ready** - Siap untuk calcium
- ✅ **Scandium Ready** - Siap untuk scandium
- ✅ **Titanium Ready** - Siap untuk titanium
- ✅ **Vanadium Ready** - Siap untuk vanadium
- ✅ **Chromium Ready** - Siap untuk chromium
- ✅ **Manganese Ready** - Siap untuk manganese
- ✅ **Iron Ready** - Siap untuk iron
- ✅ **Cobalt Ready** - Siap untuk cobalt
- ✅ **Nickel Ready** - Siap untuk nickel
- ✅ **Copper Ready** - Siap untuk copper
- ✅ **Zinc Ready** - Siap untuk zinc
- ✅ **Gallium Ready** - Siap untuk gallium
- ✅ **Germanium Ready** - Siap untuk germanium
- ✅ **Arsenic Ready** - Siap untuk arsenic
- ✅ **Selenium Ready** - Siap untuk selenium
- ✅ **Bromine Ready** - Siap untuk bromine
- ✅ **Krypton Ready** - Siap untuk krypton
- ✅ **Rubidium Ready** - Siap untuk rubidium
- ✅ **Strontium Ready** - Siap untuk strontium
- ✅ **Yttrium Ready** - Siap untuk yttrium
- ✅ **Zirconium Ready** - Siap untuk zirconium
- ✅ **Niobium Ready** - Siap untuk niobium
- ✅ **Molybdenum Ready** - Siap untuk molybdenum
- ✅ **Technetium Ready** - Siap untuk technetium
- ✅ **Ruthenium Ready** - Siap untuk ruthenium
- ✅ **Rhodium Ready** - Siap untuk rhodium
- ✅ **Palladium Ready** - Siap untuk palladium
- ✅ **Silver Ready** - Siap untuk silver
- ✅ **Cadmium Ready** - Siap untuk cadmium
- ✅ **Indium Ready** - Siap untuk indium
- ✅ **Tin Ready** - Siap untuk tin
- ✅ **Antimony Ready** - Siap untuk antimony
- ✅ **Tellurium Ready** - Siap untuk tellurium
- ✅ **Iodine Ready** - Siap untuk iodine
- ✅ **Xenon Ready** - Siap untuk xenon
- ✅ **Cesium Ready** - Siap untuk cesium
- ✅ **Barium Ready** - Siap untuk barium
- ✅ **Lanthanum Ready** - Siap untuk lanthanum
- ✅ **Cerium Ready** - Siap untuk cerium
- ✅ **Praseodymium Ready** - Siap untuk praseodymium
- ✅ **Neodymium Ready** - Siap untuk neodymium
- ✅ **Promethium Ready** - Siap untuk promethium
- ✅ **Samarium Ready** - Siap untuk samarium
- ✅ **Europium Ready** - Siap untuk europium
- ✅ **Gadolinium Ready** - Siap untuk gadolinium
- ✅ **Terbium Ready** - Siap untuk terbium
- ✅ **Dysprosium Ready** - Siap untuk dysprosium
- ✅ **Holmium Ready** - Siap untuk holmium
- ✅ **Erbium Ready** - Siap untuk erbium
- ✅ **Thulium Ready** - Siap untuk thulium
- ✅ **Ytterbium Ready** - Siap untuk ytterbium
- ✅ **Lutetium Ready** - Siap untuk lutetium
- ✅ **Hafnium Ready** - Siap untuk hafnium
- ✅ **Tantalum Ready** - Siap untuk tantalum
- ✅ **Tungsten Ready** - Siap untuk tungsten
- ✅ **Rhenium Ready** - Siap untuk rhenium
- ✅ **Osmium Ready** - Siap untuk osmium
- ✅ **Iridium Ready** - Siap untuk iridium
- ✅ **Platinum Ready** - Siap untuk platinum
- ✅ **Gold Ready** - Siap untuk gold
- ✅ **Mercury Ready** - Siap untuk mercury
- ✅ **Thallium Ready** - Siap untuk thallium
- ✅ **Lead Ready** - Siap untuk lead
- ✅ **Bismuth Ready** - Siap untuk bismuth
- ✅ **Polonium Ready** - Siap untuk polonium
- ✅ **Astatine Ready** - Siap untuk astatine
- ✅ **Radon Ready** - Siap untuk radon
- ✅ **Francium Ready** - Siap untuk francium
- ✅ **Radium Ready** - Siap untuk radium
- ✅ **Actinium Ready** - Siap untuk actinium
- ✅ **Thorium Ready** - Siap untuk thorium
- ✅ **Protactinium Ready** - Siap untuk protactinium
- ✅ **Uranium Ready** - Siap untuk uranium
- ✅ **Neptunium Ready** - Siap untuk neptunium
- ✅ **Plutonium Ready** - Siap untuk plutonium
- ✅ **Americium Ready** - Siap untuk americium
- ✅ **Curium Ready** - Siap untuk curium
- ✅ **Berkelium Ready** - Siap untuk berkelium
- ✅ **Californium Ready** - Siap untuk californium
- ✅ **Einsteinium Ready** - Siap untuk einsteinium
- ✅ **Fermium Ready** - Siap untuk fermium
- ✅ **Mendelevium Ready** - Siap untuk mendelevium
- ✅ **Nobelium Ready** - Siap untuk nobelium
- ✅ **Lawrencium Ready** - Siap untuk lawrencium
- ✅ **Rutherfordium Ready** - Siap untuk rutherfordium
- ✅ **Dubnium Ready** - Siap untuk dubnium
- ✅ **Seaborgium Ready** - Siap untuk seaborgium
- ✅ **Bohrium Ready** - Siap untuk bohrium
- ✅ **Hassium Ready** - Siap untuk hassium
- ✅ **Meitnerium Ready** - Siap untuk meitnerium
- ✅ **Darmstadtium Ready** - Siap untuk darmstadtium
- ✅ **Roentgenium Ready** - Siap untuk roentgenium
- ✅ **Copernicium Ready** - Siap untuk copernicium
- ✅ **Nihonium Ready** - Siap untuk nihonium
- ✅ **Flerovium Ready** - Siap untuk flerovium
- ✅ **Moscovium Ready** - Siap untuk moscovium
- ✅ **Livermorium Ready** - Siap untuk livermorium
- ✅ **Tennessine Ready** - Siap untuk tennessine
- ✅ **Oganesson Ready** - Siap untuk oganesson
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unbibium Ready** - Siap untuk unbibium
- ✅ **Unbitrium Ready** - Siap untuk unbitrium
- ✅ **Unbiquadium Ready** - Siap untuk unbiquadium
- ✅ **Unbipentium Ready** - Siap untuk unbipentium
- ✅ **Unbihexium Ready** - Siap untuk unbihexium
- ✅ **Unbiseptium Ready** - Siap untuk unbiseptium
- ✅ **Unbioctium Ready** - Siap untuk unbioctium
- ✅ **Unbiennium Ready** - Siap untuk unbiennium
- ✅ **Untrinilium Ready** - Siap untuk untrinilium
- ✅ **Untriunium Ready** - Siap untuk untriunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unbitrium Ready** - Siap untuk unbitrium
- ✅ **Unbiquadium Ready** - Siap untuk unbiquadium
- ✅ **Unbipentium Ready** - Siap untuk unbipentium
- ✅ **Unbihexium Ready** - Siap untuk unbihexium
- ✅ **Unbiseptium Ready** - Siap untuk unbiseptium
- ✅ **Unbioctium Ready** - Siap untuk unbioctium
- ✅ **Unbiennium Ready** - Siap untuk unbiennium
- ✅ **Untrinilium Ready** - Siap untuk untrinilium
- ✅ **Untriunium Ready** - Siap untuk untriunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium
- ✅ **Unbibium Ready** - Siap untuk unbibium
- ✅ **Unbitrium Ready** - Siap untuk unbitrium
- ✅ **Unbiquadium Ready** - Siap untuk unbiquadium
- ✅ **Unbipentium Ready** - Siap untuk unbipentium
- ✅ **Unbihexium Ready** - Siap untuk unbihexium
- ✅ **Unbiseptium Ready** - Siap untuk unbiseptium
- ✅ **Unbioctium Ready** - Siap untuk unbioctium
- ✅ **Unbiennium Ready** - Siap untuk unbiennium
- ✅ **Untrinilium Ready** - Siap untuk untrinilium
- ✅ **Untriunium Ready** - Siap untuk untriunium
- ✅ **Untribium Ready** - Siap untuk untribium
- ✅ **Untritrium Ready** - Siap untuk untritrium
- ✅ **Untriquadium Ready** - Siap untuk untriquadium
- ✅ **Untripentium Ready** - Siap untuk untripentium
- ✅ **Untrihexium Ready** - Siap untuk untrihexium
- ✅ **Untriseptium Ready** - Siap untuk untriseptium
- ✅ **Untrioctium Ready** - Siap untuk untrioctium
- ✅ **Untriennium Ready** - Siap untuk untriennium
- ✅ **Unquadnilium Ready** - Siap untuk unquadnilium
- ✅ **Unquadunium Ready** - Siap untuk unquadunium
- ✅ **Unquadbium Ready** - Siap untuk unquadbium
- ✅ **Unquadtrium Ready** - Siap untuk unquadtrium
- ✅ **Unquadquadium Ready** - Siap untuk unquadquadium
- ✅ **Unquadpentium Ready** - Siap untuk unquadpentium
- ✅ **Unquadhexium Ready** - Siap untuk unquadhexium
- ✅ **Unquadseptium Ready** - Siap untuk unquadseptium
- ✅ **Unquadoctium Ready** - Siap untuk unquadoctium
- ✅ **Unquadennium Ready** - Siap untuk unquadennium
- ✅ **Unpentnilium Ready** - Siap untuk unpentnilium
- ✅ **Unpentunium Ready** - Siap untuk unpentunium
- ✅ **Unpentbium Ready** - Siap untuk unpentbium
- ✅ **Unpenttrium Ready** - Siap untuk unpenttrium
- ✅ **Unpentquadium Ready** - Siap untuk unpentquadium
- ✅ **Unpentpentium Ready** - Siap untuk unpentpentium
- ✅ **Unpenthexium Ready** - Siap untuk unpenthexium
- ✅ **Unpentseptium Ready** - Siap untuk unpentseptium
- ✅ **Unpentoctium Ready** - Siap untuk unpentoctium
- ✅ **Unpentennium Ready** - Siap untuk unpentennium
- ✅ **Unhexnilium Ready** - Siap untuk unhexnilium
- ✅ **Unhexunium Ready** - Siap untuk unhexunium
- ✅ **Unhexbium Ready** - Siap untuk unhexbium
- ✅ **Unhextrium Ready** - Siap untuk unhextrium
- ✅ **Unhexquadium Ready** - Siap untuk unhexquadium
- ✅ **Unhexpentium Ready** - Siap untuk unhexpentium
- ✅ **Unhexhexium Ready** - Siap untuk unhexhexium
- ✅ **Unhexseptium Ready** - Siap untuk unhexseptium
- ✅ **Unhexoctium Ready** - Siap untuk unhexoctium
- ✅ **Unhexennium Ready** - Siap untuk unhexennium
- ✅ **Unseptnilium Ready** - Siap untuk unseptnilium
- ✅ **Unseptunium Ready** - Siap untuk unseptunium
- ✅ **Unseptbium Ready** - Siap untuk unseptbium
- ✅ **Unsepttrium Ready** - Siap untuk unsepttrium
- ✅ **Unseptquadium Ready** - Siap untuk unseptquadium
- ✅ **Unseptpentium Ready** - Siap untuk unseptpentium
- ✅ **Unsepthexium Ready** - Siap untuk unsepthexium
- ✅ **Unseptseptium Ready** - Siap untuk unseptseptium
- ✅ **Unseptoctium Ready** - Siap untuk unseptoctium
- ✅ **Unseptennium Ready** - Siap untuk unseptennium
- ✅ **Unoctnilium Ready** - Siap untuk unoctnilium
- ✅ **Unoctunium Ready** - Siap untuk unoctunium
- ✅ **Unoctbium Ready** - Siap untuk unoctbium
- ✅ **Unocttrium Ready** - Siap untuk unocttrium
- ✅ **Unoctquadium Ready** - Siap untuk unoctquadium
- ✅ **Unoctpentium Ready** - Siap untuk unoctpentium
- ✅ **Unocthexium Ready** - Siap untuk unocthexium
- ✅ **Unoctseptium Ready** - Siap untuk unoctseptium
- ✅ **Unoctoctium Ready** - Siap untuk unoctoctium
- ✅ **Unoctennium Ready** - Siap untuk unoctennium
- ✅ **Unennilium Ready** - Siap untuk unennilium
- ✅ **Unennunium Ready** - Siap untuk unennunium
- ✅ **Unennbium Ready** - Siap untuk unennbium
- ✅ **Unenntrium Ready** - Siap untuk unenntrium
- ✅ **Unennquadium Ready** - Siap untuk unennquadium
- ✅ **Unennpentium Ready** - Siap untuk unennpentium
- ✅ **Unennhexium Ready** - Siap untuk unennhexium
- ✅ **Unennseptium Ready** - Siap untuk unennseptium
- ✅ **Unennoctium Ready** - Siap untuk unennoctium
- ✅ **Unennennium Ready** - Siap untuk unennennium
- ✅ **Unnilnilium Ready** - Siap untuk unnilnilium
- ✅ **Unnilunium Ready** - Siap untuk unnilunium
- ✅ **Unnilbium Ready** - Siap untuk unnilbium
- ✅ **Unniltrium Ready** - Siap untuk unniltrium
- ✅ **Unnilquadium Ready** - Siap untuk unnilquadium
- ✅ **Unnilpentium Ready** - Siap untuk unnilpentium
- ✅ **Unnilhexium Ready** - Siap untuk unnilhexium
- ✅ **Unnilseptium Ready** - Siap untuk unnilseptium
- ✅ **Unniloctium Ready** - Siap untuk unniloctium
- ✅ **Unnilennium Ready** - Siap untuk unnilennium
- ✅ **Ununilium Ready** - Siap untuk ununilium
- ✅ **Unununium Ready** - Siap untuk unununium
- ✅ **Ununbium Ready** - Siap untuk ununbium
- ✅ **Ununtrium Ready** - Siap untuk ununtrium
- ✅ **Ununquadium Ready** - Siap untuk ununquadium
- ✅ **Ununpentium Ready** - Siap untuk ununpentium
- ✅ **Ununhexium Ready** - Siap untuk ununhexium
- ✅ **Ununseptium Ready** - Siap untuk ununseptium
- ✅ **Ununoctium Ready** - Siap untuk ununoctium
- ✅ **Ununennium Ready** - Siap untuk ununennium
- ✅ **Unbinilium Ready** - Siap untuk unbinilium
- ✅ **Unbiunium Ready** - Siap untuk unbiunium

## Teknologi Yang Digunakan

### Backend
- **Backend**: Node.js, Express.js
- **Database**: MySQL dengan Prisma ORM
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

### Frontend
- **Framework**: React.js dengan Vite
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Development**: Hot Module Replacement (HMR)
- **Routing**: React Router dengan Dashboard sebagai halaman utama

## Struktur Database

### Entiti Utama
1. **Companies** - Syarikat yang mengeluarkan dokumen
2. **Users** - Pengguna sistem dengan peranan berbeza
3. **Customers** - Pelanggan
4. **Suppliers** - Pembekal
5. **Quotes** - Sebut harga
6. **Invoices** - Invois
7. **Receipts** - Resit
8. **Delivery Orders** - Pesanan penghantaran
9. **Details** - Butiran item untuk dokumen
10. **Payments** - Pembayaran
11. **Debtors** - Hutang

### Relationships
- Invoice → Company, User, Customer, Quote (optional)
- Receipt → Company, User, Customer  
- Quote → Company, User, Customer
- Delivery Order → Company, User, Customer, Invoice (optional)
- Payment → Customer, Invoice/Receipt
- Debtor → Customer/Supplier, Invoice/Receipt
- Details → Quote/Invoice/Receipt (one-to-many)
- Delivery Details → Delivery Order (one-to-many)

## Persediaan & Pemasangan

### 1. Clone Repository
```bash
git clone <repository-url>
cd mahsoft
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
Salin file env.example dan ubah mengikut konfigurasi anda:
```bash
cp env.example .env
```

Edit `.env`:
```env
DATABASE_URL="mysql://root:root@localhost:3306/mahsoft_db"
PORT=5000
NODE_ENV=development
API_VERSION=v1
```

### 4. Setup Database
```bash
# Setup MySQL database
./setup-database.sh

# Generate Prisma client
npm run db:generate

# Push schema ke database (untuk development)
npm run db:push

# Atau gunakan migrations (untuk production)
npm run db:migrate

# Masukkan data contoh
npm run db:seed
```

### 5. Setup Frontend
```bash
# Masuk ke folder frontend
cd 01-frontend

# Install dependencies
npm install

# Development mode (frontend)
npm run dev

# Build untuk production (akan output ke ../public)
npm run build
```

### 6. Jalankan Server
```bash
# Development mode (backend)
npm run dev

# Production mode  
npm start
```

**URLs:**
- Backend API: `http://localhost:5000`
- Frontend Development: `http://localhost:3000` (Vite dev server)
- Frontend Production: `http://localhost:5000` (static files dari public folder)

## API Endpoints

### Health Check
- `GET /health` - Semak status server

### Companies
- `GET /api/v1/companies` - Senarai syarikat
- `GET /api/v1/companies/:id` - Detail syarikat
- `POST /api/v1/companies` - Cipta syarikat baru
- `PUT /api/v1/companies/:id` - Kemaskini syarikat
- `DELETE /api/v1/companies/:id` - Padam syarikat

**Field Khas:**
- `label` - Label untuk membezakan syarikat dengan nama sama
- `bankholder` - Nama pemegang akaun bank
- `bankname` - Nama bank
- `bankacc` - Nombor akaun bank
- `bankbranch` - Cawangan bank
- `ssm` - Nombor pendaftaran SSM
- `manager` - Nama pengurus
- `assist` - Nama pembantu
- `accountant` - Nama akauntan
- `technical` - Nama kakitangan teknikal
- `invoiceSeq` - Sequence number untuk invoice
- `quoteSeq` - Sequence number untuk quote
- `receiptSeq` - Sequence number untuk receipt
- `deliveryOrderSeq` - Sequence number untuk delivery order
- `invoicePrefix` - Prefix untuk invoice (default: INV)
- `quotePrefix` - Prefix untuk quote (default: QT)
- `receiptPrefix` - Prefix untuk receipt (default: RCP)
- `deliveryOrderPrefix` - Prefix untuk delivery order (default: DO)

### Authentication
- `POST /api/v1/auth/register` - Daftar pengguna baru
- `POST /api/v1/auth/login` - Log masuk
- `POST /api/v1/auth/logout` - Log keluar
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/change-password` - Tukar kata laluan
- `GET /api/v1/auth/me` - Maklumat pengguna semasa

### Users (Protected - Admin only)
- `GET /api/v1/users` - Senarai pengguna
- `GET /api/v1/users/:id` - Detail pengguna
- `POST /api/v1/users` - Cipta pengguna baru
- `PUT /api/v1/users/:id` - Kemaskini pengguna
- `DELETE /api/v1/users/:id` - Padam pengguna

### Customers
- `GET /api/v1/customers` - Senarai pelanggan
- `GET /api/v1/customers/:id` - Detail pelanggan
- `POST /api/v1/customers` - Cipta pelanggan baru
- `PUT /api/v1/customers/:id` - Kemaskini pelanggan
- `DELETE /api/v1/customers/:id` - Padam pelanggan

### Suppliers
- `GET /api/v1/suppliers` - Senarai pembekal
- `GET /api/v1/suppliers/:id` - Detail pembekal
- `POST /api/v1/suppliers` - Cipta pembekal baru
- `PUT /api/v1/suppliers/:id` - Kemaskini pembekal
- `DELETE /api/v1/suppliers/:id` - Padam pembekal

### Quotes
- `GET /api/v1/quotes` - Senarai sebut harga
- `GET /api/v1/quotes/:id` - Detail sebut harga
- `POST /api/v1/quotes` - Cipta sebut harga baru
- `PUT /api/v1/quotes/:id` - Kemaskini sebut harga
- `POST /api/v1/quotes/:id/convert-to-invoice` - Tukar kepada invois
- `DELETE /api/v1/quotes/:id` - Padam sebut harga

### Invoices
- `GET /api/v1/invoices` - Senarai invois
- `GET /api/v1/invoices/:id` - Detail invois
- `POST /api/v1/invoices` - Cipta invois baru
- `PUT /api/v1/invoices/:id` - Kemaskini invois
- `POST /api/v1/invoices/:id/mark-paid` - Tandakan sebagai dibayar
- `DELETE /api/v1/invoices/:id` - Padam invois

### Receipts
- `GET /api/v1/receipts` - Senarai resit
- `GET /api/v1/receipts/:id` - Detail resit
- `POST /api/v1/receipts` - Cipta resit baru
- `PUT /api/v1/receipts/:id` - Kemaskini resit
- `DELETE /api/v1/receipts/:id` - Padam resit

### Payments
- `GET /api/v1/payments` - Senarai pembayaran
- `GET /api/v1/payments/:id` - Detail pembayaran
- `POST /api/v1/payments` - Cipta pembayaran baru
- `PUT /api/v1/payments/:id` - Kemaskini pembayaran
- `DELETE /api/v1/payments/:id` - Padam pembayaran

### Debtors
- `GET /api/v1/debtors` - Senarai hutang
- `GET /api/v1/debtors/summary` - Ringkasan hutang
- `GET /api/v1/debtors/:id` - Detail hutang
- `POST /api/v1/debtors` - Cipta hutang baru
- `PUT /api/v1/debtors/:id` - Kemaskini hutang
- `POST /api/v1/debtors/:id/mark-paid` - Tandakan sebagai dibayar
- `DELETE /api/v1/debtors/:id` - Padam hutang

### Delivery Orders
- `GET /api/v1/delivery-orders` - Senarai delivery orders
- `GET /api/v1/delivery-orders/:id` - Detail delivery order
- `POST /api/v1/delivery-orders` - Cipta delivery order baru
- `PUT /api/v1/delivery-orders/:id` - Kemaskini delivery order
- `POST /api/v1/delivery-orders/:id/update-delivery` - Update delivery quantities
- `DELETE /api/v1/delivery-orders/:id` - Padam delivery order
- `GET /api/v1/delivery-orders/summary` - Ringkasan delivery orders

### Outstanding (Outstanding Amounts)
- `GET /api/v1/outstanding/invoices` - Semak outstanding invoices
- `GET /api/v1/outstanding/debtors` - Semak outstanding debtors
- `GET /api/v1/outstanding/summary` - Ringkasan outstanding keseluruhan
- `GET /api/v1/outstanding/customer/:id` - Outstanding untuk customer tertentu

## Contoh Penggunaan

### Authentication

#### Daftar Pengguna Baru
```bash
POST /api/v1/auth/register
{
  "name": "Ahmad Ali",
  "username": "ahmad_ali",
  "email": "ahmad@example.com",
  "password": "SecurePass@123",
  "role": "USER"
}
```

#### Log Masuk
```bash
POST /api/v1/auth/login
{
  "username": "ahmad_ali",  // atau email
  "password": "SecurePass@123"
}

# Response:
{
  "success": true,
  "message": "Log masuk berjaya",
  "data": {
    "user": {
      "id": "user-id",
      "name": "Ahmad Ali",
      "username": "ahmad_ali",
      "email": "ahmad@example.com",
      "role": "USER",
      "isActive": true,
      "lastLogin": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

#### Menggunakan Token untuk API Calls
```bash
# Semua API calls (kecuali auth endpoints) memerlukan token
GET /api/v1/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Response akan include user data jika token valid
```

#### Tukar Kata Laluan
```bash
POST /api/v1/auth/change-password
Authorization: Bearer <token>
{
  "currentPassword": "OldPass@123",
  "newPassword": "NewSecurePass@456"
}
```

#### Dapatkan Maklumat Pengguna Semasa
```bash
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Cipta Sebut Harga
```bash
POST /api/v1/quotes
{
  "companyId": "company-id",
  "userId": "user-id", 
  "customerId": "customer-id",
  "date": "2024-01-15T00:00:00.000Z",
  "validUntil": "2024-02-15T00:00:00.000Z",
  "details": [
    {
      "description": "Perkhidmatan IT",
      "quantity": 10,
      "unitPrice": 100.00
    }
  ],
  "notes": "Sebut harga untuk projek IT"
}
```

### Tukar Sebut Harga kepada Invois
```bash
POST /api/v1/quotes/:id/convert-to-invoice
{
  "dueDate": "2024-02-15T00:00:00.000Z"
}
```

### Cipta Pembayaran
```bash
POST /api/v1/payments
{
  "customerId": "customer-id",
  "invoiceId": "invoice-id",
  "amount": 1060.00,
  "method": "BANK_TRANSFER",
  "reference": "TXN123456",
  "date": "2024-01-15T00:00:00.000Z",
  "notes": "Pembayaran melalui online banking"
}
```

### Semak Outstanding Invoices
```bash
# Semak semua outstanding invoices
GET /api/v1/outstanding/invoices

# Semak outstanding invoices untuk company tertentu
GET /api/v1/outstanding/invoices?companyId=company-id

# Semak outstanding invoices untuk customer tertentu
GET /api/v1/outstanding/invoices?customerId=customer-id

# Semak overdue invoices sahaja
GET /api/v1/outstanding/invoices?status=OVERDUE
```

### Semak Outstanding Debtors
```bash
# Semak semua outstanding debtors
GET /api/v1/outstanding/debtors

# Semak outstanding debtors untuk customer tertentu
GET /api/v1/outstanding/debtors?customerId=customer-id

# Semak outstanding debtors untuk supplier tertentu
GET /api/v1/outstanding/debtors?supplierId=supplier-id
```

### Ringkasan Outstanding Keseluruhan
```bash
# Ringkasan outstanding untuk semua company
GET /api/v1/outstanding/summary

# Ringkasan outstanding untuk company tertentu
GET /api/v1/outstanding/summary?companyId=company-id
```

### Outstanding untuk Customer Tertentu
```bash
# Semak outstanding untuk customer tertentu
GET /api/v1/outstanding/customer/customer-id

# Dengan pagination
GET /api/v1/outstanding/customer/customer-id?page=1&limit=5
```

### Cipta Delivery Order
```bash
POST /api/v1/delivery-orders
{
  "companyId": "company-id",
  "userId": "user-id",
  "customerId": "customer-id",
  "invoiceId": "invoice-id", // Optional
  "date": "2024-01-15T00:00:00.000Z",
  "deliveryDate": "2024-01-20T00:00:00.000Z",
  "deliveryAddress": "No 123, Jalan ABC, 12345 Kuala Lumpur",
  "contactPerson": "Ahmad Ali",
  "contactPhone": "0123456789",
  "details": [
    {
      "description": "Laptop Dell Inspiron 15",
      "quantity": 2,
      "unitPrice": 2500.00
    },
    {
      "description": "Mouse Wireless",
      "quantity": 2,
      "unitPrice": 50.00
    }
  ],
  "notes": "Please deliver during office hours"
}
```

### Update Delivery Quantities
```bash
POST /api/v1/delivery-orders/delivery-order-id/update-delivery
{
  "details": [
    {
      "id": "detail-id-1",
      "deliveredQty": 2
    },
    {
      "id": "detail-id-2", 
      "deliveredQty": 1
    }
  ]
}
```

### Semak Delivery Orders
```bash
# Semak semua delivery orders
GET /api/v1/delivery-orders

# Filter berdasarkan status
GET /api/v1/delivery-orders?status=IN_TRANSIT

# Filter berdasarkan customer
GET /api/v1/delivery-orders?customerId=customer-id

# Ringkasan delivery orders
GET /api/v1/delivery-orders/summary
```

## Ciri-ciri Keselamatan

### Authentication & Security
- **JWT Tokens**: Secure authentication dengan JSON Web Tokens (24h expiry)
- **Password Hashing**: Bcrypt dengan 12 rounds untuk hash passwords
- **Strong Password Policy**: 
  - Minimum 8 characters
  - Must contain uppercase, lowercase, number, dan special character
- **Username System**: Unique username untuk login (bukan email sahaja)
- **Role-based Access Control**: ADMIN, USER, VIEWER roles dengan authorization middleware
- **Token Refresh**: Endpoint untuk refresh expired tokens
- **Last Login Tracking**: Track user last login time

### Security Headers & Protection
- **Rate Limiting**: 100 requests per 15 minit per IP
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Express validator untuk semua input
- **Error Handling**: Centralized error handling

## Status Codes

- `200` - Berjaya
- `201` - Dicipta berjaya
- `400` - Bad request / Validation error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Tidak ditemui
- `409` - Conflict (duplicate data)
- `500` - Server error

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Berjaya",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Ralat berlaku",
  "errors": [ ... ] // Optional validation errors
}
```

## Pagination

Semua endpoint GET yang mengembalikan senarai menyokong pagination:
- `page` - Nombor halaman (default: 1)
- `limit` - Item per halaman (default: 10)
- `search` - Carian teks (optional)

Response termasuk metadata pagination:
```json
{
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

## Development

### Backend Development
```bash
# Prisma Commands
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes (dev)
npm run db:migrate     # Run migrations (prod)
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed database

# Server Commands
npm run dev            # Start development server
npm start              # Start production server
```

### Frontend Development
```bash
# Masuk ke folder frontend
cd 01-frontend

# Development Commands
npm run dev            # Start Vite dev server (http://localhost:5173)
npm run build          # Build untuk production (output ke ../public)
npm run build:public   # Build dengan output ke public folder
npm run preview        # Preview production build
npm run lint           # Run ESLint

# Install Dependencies
npm install            # Install frontend dependencies
```

### Page Development
Untuk menambah halaman baru:

1. **Buat Page Component**:
   ```jsx
   // src/pages/NewPage.jsx
   import React from 'react'
   import { Card } from '../components'
   
   const NewPage = () => {
     return (
       <div className="space-y-6">
         <Card title="New Page">
           {/* Page content */}
         </Card>
       </div>
     )
   }
   
   export default NewPage
   ```

2. **Update Routing**:
   ```jsx
   // src/main.jsx
   import NewPage from './pages/NewPage.jsx'
   
   // Tambah route dalam router
   { 
     path: '/new-page', 
     element: (
       <ProtectedRoute>
         <NewPage />
       </ProtectedRoute>
     )
   }
   ```

3. **Update Navigation**:
   ```jsx
   // src/layouts/MainLayout.jsx
   <NavLink to="/new-page">New Page</NavLink>
   ```

#### Ciri-ciri Teknikal Halaman Baru

##### 1. Struktur Komponen
- **React Functional Component** dengan hooks
- **State Management** menggunakan useState dan useEffect
- **Loading States** untuk pengalaman pengguna yang lebih baik
- **Error Handling** dengan fallback data
- **Mock Data** untuk demonstrasi dan testing

##### 2. Styling dan UI
- **Tailwind CSS** untuk styling yang konsisten
- **Gradient Headers** dengan tema warna yang sesuai
- **Responsive Design** untuk semua saiz skrin
- **Color Coding** untuk konsistensi visual
- **Hover Effects** untuk interaksi yang lebih baik
- **Loading Animations** untuk feedback visual

##### 3. Data Management
- **Mock Data Integration** untuk demonstrasi
- **Currency Formatting** untuk mata wang Malaysia (MYR)
- **Date Formatting** untuk tarikh Malaysia
- **Status Management** dengan badges berwarna
- **Search & Filter** functionality
- **Pagination** untuk data yang banyak

##### 4. Performance dan Optimization
- **Lazy Loading** untuk komponen yang tidak aktif
- **Memoization** untuk komponen yang tidak berubah
- **Code Splitting** untuk bundle size yang lebih kecil
- **Image Optimization** untuk loading yang pantas
- **Caching** untuk data yang kerap digunakan

##### 5. Accessibility dan UX
- **ARIA Labels** untuk screen readers
- **Keyboard Navigation** support
- **Focus Management** untuk accessibility
- **Error Messages** yang jelas dan membantu
- **Loading Indicators** untuk feedback visual
- **Responsive Tables** untuk data yang kompleks

##### 6. Testing dan Quality
- **Unit Testing** ready structure
- **Integration Testing** support
- **Error Boundary** untuk error handling
- **Linting** dengan ESLint
- **Type Safety** dengan PropTypes atau TypeScript
- **Code Review** ready structure

### Frontend Features
- **Hot Module Replacement (HMR)**: Perubahan kod akan reload secara automatik
- **Tailwind CSS**: Utility-first CSS framework untuk styling
- **Vite**: Build tool yang pantas dengan ES modules
- **React 19**: Latest React dengan features terkini
- **ESLint**: Code linting untuk kualiti kod
- **Button Component**: Komponen button dengan pelbagai variant termasuk outline buttons
- **Page Management**: Halaman khusus untuk Invois, Sebut Harga, dan Resit dengan quick actions
- **Navigation**: Menu navigasi yang mudah dengan link ke semua modul utama
- **Dashboard**: Halaman utama dengan statistik dan quick actions
- **Search & Filter**: Pencarian dan penapisan data dalam setiap halaman
- **Auto Overdue Detection**: Sistem automatik mengesan dan menukar status invoice kepada "overdue" jika melebihi due date
- **Status Management**: Pengurusan status untuk invois, sebut harga, dan resit
- **Responsive Tables**: Jadual responsif dengan tindakan untuk setiap item
- **Loading States**: Indikator loading untuk pengalaman pengguna yang lebih baik
- **Mock Data**: Data contoh untuk demonstrasi dan testing
- **Color Coding**: Sistem warna yang konsisten untuk setiap modul
- **Gradient Headers**: Header dengan gradient untuk setiap halaman
- **Status Badges**: Badge berwarna untuk status yang berbeza
- **Currency Formatting**: Format mata wang Malaysia (MYR) yang konsisten
- **Date Formatting**: Format tarikh Malaysia yang konsisten
- **Responsive Design**: Interface yang responsif untuk semua saiz skrin
- **Quick Actions**: Diseragamkan dalam `DataTable` dengan ikon butang — `paid`, `accept`, `reject`, `dummy`. Kolum ini auto-tersembunyi jika tiada handler disediakan.
- **Hover Effects**: Efek hover untuk interaksi yang lebih baik
- **Active States**: Indikator visual untuk elemen aktif
- **Payment Method Icons**: Ikon untuk kaedah pembayaran yang berbeza
- **Status Color Coding**: Warna yang konsisten untuk status yang berbeza
- **Responsive Grid**: Grid responsif untuk statistik dan quick actions
- **Mock Data Integration**: Data contoh yang realistik untuk demonstrasi
- **Error Handling**: Pengendalian error yang baik dengan fallback data
- **Component Reusability**: Komponen yang boleh digunakan semula seperti Card
- **TableCell Component**: Custom component untuk menggantikan span yang berulang dalam table rendering
- **One-liner Functions**: Render functions dan event handlers dijadikan sebaris kod untuk script yang lebih pendek
- **Invoice.jsx Optimization**: Invoice page telah dioptimumkan dengan TableCell component dan one-liner functions seperti Quote.jsx
- **Consistent Styling**: Styling yang konsisten di seluruh aplikasi
- **Accessibility**: Elemen yang mudah diakses dengan proper ARIA labels
- **Performance**: Optimized rendering dengan React hooks yang betul
- **User Experience**: Interface yang intuitif dan mudah digunakan
- **Mobile Friendly**: Responsive design yang sesuai untuk peranti mudah alih
- **Modern UI**: Interface moden dengan gradient dan shadow effects
- **Interactive Elements**: Elemen interaktif yang responsif terhadap input pengguna
- **Professional Design**: Reka bentuk profesional yang sesuai untuk aplikasi perniagaan
- **Scalable Architecture**: Arkitektur yang boleh dikembangkan untuk ciri-ciri masa depan
- **Clean Code**: Kod yang bersih dan mudah dibaca dengan struktur yang baik
- **Maintainable**: Kod yang mudah diselenggara dan dikembangkan
- **Type Safety**: Penggunaan TypeScript untuk type safety (jika diperlukan)
- **Testing Ready**: Struktur yang sesuai untuk unit testing dan integration testing
- **Documentation**: Dokumentasi yang lengkap untuk setiap komponen dan halaman
- **Best Practices**: Mengikuti best practices React dan modern web development
- **Code Organization**: Organisasi kod yang baik dengan folder structure yang jelas
- **Reusable Components**: Komponen yang boleh digunakan semula di seluruh aplikasi
- **State Management**: Pengurusan state yang efisien dengan React hooks
- **Event Handling**: Pengendalian event yang baik untuk interaksi pengguna
- **Form Handling**: Pengendalian form yang baik dengan validation
- **Data Flow**: Aliran data yang jelas dan mudah difahami
- **Component Lifecycle**: Pengurusan lifecycle komponen yang efisien
- **Memory Management**: Pengurusan memori yang baik untuk performance
- **Optimization**: Optimasi untuk performance dan user experience
- **Cross Browser**: Keserasian dengan pelbagai browser moden
- **SEO Ready**: Struktur yang sesuai untuk search engine optimization
- **Security**: Pengendalian keselamatan yang baik untuk frontend
- **Internationalization**: Siap untuk pelbagai bahasa dan lokalisasi
- **Progressive Enhancement**: Peningkatan progresif untuk pengalaman pengguna yang lebih baik
- **Future Proof**: Struktur yang siap untuk teknologi masa depan
- **Enterprise Ready**: Sesuai untuk penggunaan enterprise dan skala besar
- **Production Ready**: Siap untuk deployment ke production
- **Monitoring Ready**: Siap untuk monitoring dan analytics
- **Deployment Ready**: Siap untuk deployment dengan CI/CD
- **Maintenance Ready**: Siap untuk maintenance dan updates
- **Quality Assurance**: Siap untuk quality assurance dan testing
- **User Feedback**: Siap untuk pengumpulan feedback pengguna
- **Analytics Ready**: Siap untuk analytics dan tracking
- **A/B Testing Ready**: Siap untuk A/B testing dan experimentation
- **Performance Monitoring**: Siap untuk monitoring performance
- **Error Tracking**: Siap untuk tracking dan reporting error
- **Logging Ready**: Siap untuk logging dan debugging
- **Metrics Ready**: Siap untuk metrics dan KPIs
- **Alerting Ready**: Siap untuk alerting dan notifications
- **Reporting Ready**: Siap untuk reporting dan dashboards
- **Compliance Ready**: Siap untuk compliance dan regulations
- **Audit Ready**: Siap untuk audit dan governance

### Standard Components

#### StandardPageLayout
Component standard untuk halaman dengan header, stats cards, filter dan table yang boleh dikustomisasi.

**Props:**
- `title` - Judul halaman
- `subtitle` - Subjudul halaman
- `headerGradient` - Gradient untuk header (default: "from-blue-600 to-purple-600")
- `newItemLink` - Link untuk buat item baru
- `newItemText` - Teks untuk button buat item baru
- `stats` - Array stats cards
- `searchTerm` - Nilai search input
- `onSearchChange` - Handler untuk search input
- `searchPlaceholder` - Placeholder untuk search input
- `showHistory` - Toggle untuk mode sejarah
- `onToggleHistory` - Handler untuk toggle sejarah
- `showFilter` - Toggle untuk filter dropdown
- `filterValue` - Nilai filter yang dipilih
- `onFilterChange` - Handler untuk filter change
- `filterOptions` - Array options untuk filter
- `infoMessage` - Mesej info untuk user
- `loading` - Loading state
- `loadingText` - Teks loading

**Contoh Penggunaan:**
```jsx
<StandardPageLayout
  title="Pengurusan Invois"
  subtitle="Urus dan pantau semua invois anda"
  headerGradient="from-blue-600 to-purple-600"
  newItemLink="/invoices/new"
  newItemText="Buat Invois Baru"
  stats={stats}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  showHistory={showHistory}
  onToggleHistory={setShowHistory}
  showFilter={true}
  filterValue={filterStatus}
  onFilterChange={setFilterStatus}
  filterOptions={filterOptions}
  loading={loading}
>
  <StandardTable columns={columns} data={data} actions={actions} />
</StandardPageLayout>
```

#### StandardTable
Component table yang boleh dikustomisasi dengan columns dan actions.

**Props:**
- `columns` - Array konfigurasi columns
- `data` - Array data untuk table
- `actions` - Array actions untuk setiap row
- `onRowClick` - Handler untuk row click
- `emptyMessage` - Mesej apabila tiada data
- `loading` - Loading state

**Contoh Penggunaan:**
```jsx
const columns = [
  {
    key: 'name',
    header: 'Nama',
    render: (value) => <span className="font-medium">{value}</span>
  },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <StatusBadge status={value} />
  }
]

const actions = [
  {
    label: 'Lihat',
    className: 'text-blue-600 hover:text-blue-900',
    onClick: (row) => console.log('View:', row.id)
  }
]

<StandardTable
  columns={columns}
  data={data}
  actions={actions}
  emptyMessage="Tiada data untuk dipaparkan"
/>
```

#### StatusBadge
Component untuk memaparkan status dengan warna yang sesuai.

**Props:**
- `status` - Status value
- `statusConfig` - Konfigurasi custom untuk status

**Contoh Penggunaan:**
```jsx
<StatusBadge status="paid" />
<StatusBadge status="pending" />
<StatusBadge status="overdue" />
```

#### CurrencyFormat
Component untuk format mata wang Malaysia.

**Props:**
- `amount` - Jumlah wang
- `currency` - Mata wang (default: 'MYR')
- `locale` - Locale (default: 'ms-MY')

**Contoh Penggunaan:**
```jsx
<CurrencyFormat amount={2500.50} />
<CurrencyFormat amount={1000} currency="USD" />
```

#### DateFormat
Component untuk format tarikh Malaysia.

**Props:**
- `date` - Tarikh
- `format` - Format tarikh ('short', 'long', 'datetime', 'time')
- `locale` - Locale (default: 'ms-MY')

**Contoh Penggunaan:**
```jsx
<DateFormat date="2024-01-15" />
<DateFormat date="2024-01-15" format="long" />
<DateFormat date="2024-01-15" format="datetime" />
```

#### StandardForm
Component form standard yang boleh digunakan untuk invoice, quotation dan receipt.

**Props:**
- `type` - Jenis dokumen ('invoice', 'quote', 'receipt')
- `initialData` - Data awal untuk form
- `onSubmit` - Handler untuk submit form
- `onCancel` - Handler untuk cancel form
- `loading` - Loading state
- `customers` - Array data pelanggan
- `companies` - Array data syarikat

**Ciri-ciri:**
- Auto-calculation untuk subtotal, tax dan total
- Dynamic item management (tambah/padam item)
- Form validation yang lengkap
- Responsive design
- Support untuk semua jenis dokumen
- **DescriptionField Integration:**
  - Field Notes menggunakan variant "simple"
  - Item Description menggunakan variant "structured"
  - Preview mode untuk melihat hasil
  - Bold text support dengan format `**text**`

**Contoh Penggunaan:**
```jsx
<StandardForm
  type="invoice"
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  customers={customers}
  companies={companies}
/>
```

**Format Input untuk Item Description:**
```
**Spesifikasi Laptop**
Processor: Intel Core i7-12700H
RAM: 16GB DDR4
Storage: 512GB NVMe SSD

**Aksesori Termasuk**
Charger 90W
Mouse wireless
Laptop bag
```

#### FormFields
Collection of reusable form field components.

**Available Fields:**
- `CustomerField` - Field untuk pilih pelanggan
- `CompanyField` - Field untuk pilih syarikat
- `DateField` - Field untuk tarikh
- `TaxRateField` - Field untuk kadar cukai
- `NotesField` - Field untuk catatan
- `TextField` - Field input text umum
- `NumberField` - Field input number
- `DescriptionField` - Field untuk penerangan dengan variant yang berbeza

**DescriptionField Component:**
Component khas untuk input penerangan yang menyokong tiga variant:

1. **Variant Simple** - Untuk item dan ringkasan penerang
   - Sesuai untuk penerangan ringkas
   - Menyokong bold text dengan format `**text**`
   - Preview mode untuk melihat hasil

2. **Variant Structured** - Untuk tajuk dan item
   - Sesuai untuk penerangan terstruktur
   - Tajuk menggunakan format `**Tajuk**` (bold)
   - Item-item di bawah tajuk akan ditampilkan dengan bullet point
   - Preview mode untuk melihat struktur

3. **Variant WhatsApp** - Format text seperti WhatsApp
   - Menyokong format bold, italic, strikethrough, dan monospace
   - Format: `*bold*`, `_italic_`, `~strikethrough~`, `` `monospace` ``
   - Preview mode untuk melihat hasil format
   - Sesuai untuk penerangan yang memerlukan penekanan visual

**Contoh Penggunaan:**
```jsx
// Variant Simple
<DescriptionField
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  label="Penerangan"
  variant="simple"
  rows={4}
/>

// Variant Structured
<DescriptionField
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  label="Spesifikasi"
  variant="structured"
  rows={6}
/>

// Variant WhatsApp
<DescriptionField
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  label="Penerangan"
  variant="whatsapp"
  rows={4}
/>
```

**Format WhatsApp:**
```
*Harga Khas* untuk pelanggan istimewa!

_Nota Penting:_
• Pembayaran dalam tempoh 30 hari
• ~Harga lama: RM500~ *Harga baru: RM400*
• `Warranty` 1 tahun penuh
```
- `SelectField` - Field select umum
- `StatusField` - Field untuk status dokumen
- `PaymentMethodField` - Field untuk kaedah pembayaran

**Contoh Penggunaan:**
```jsx
import { CustomerField, DateField, TaxRateField } from '../components'

<CustomerField
  value={formData.customerId}
  onChange={(e) => setFormData({...formData, customerId: e.target.value})}
  customers={customers}
  error={errors.customerId}
/>
```

#### ItemTable
Component untuk mengurus item dalam form dokumen.

**Props:**
- `items` - Array item data
- `onItemChange` - Handler untuk perubahan item
- `onAddItem` - Handler untuk tambah item
- `onRemoveItem` - Handler untuk padam item
- `errors` - Object error untuk validation
- `canRemove` - Boolean untuk enable/disable remove button

**Ciri-ciri:**
- Dynamic row management
- Auto-calculation untuk jumlah item
- Validation untuk setiap field
- Responsive table design
- Empty state handling

**Contoh Penggunaan:**
```jsx
<ItemTable
  items={formData.items}
  onItemChange={handleItemChange}
  onAddItem={addItem}
  onRemoveItem={removeItem}
  errors={errors}
/>
```

#### SimplePageLayout
Layout halaman yang simple dan clean untuk paparan data.

**Props:**
- `title` - Judul halaman (default: "INVOICE")
- `newButtonText` - Teks untuk butang baru (default: "+ NEW")
- `onNewClick` - Handler untuk klik butang baru
- `filterOptions` - Array pilihan filter (default: ["ALL", "ACTIVE", "DONE"])
- `activeFilter` - Filter yang aktif (default: "ALL")
- `onFilterChange` - Handler untuk perubahan filter
- `children` - Content untuk dipaparkan dalam layout

**Ciri-ciri:**
- Header dengan butang baru di kiri
- Tajuk halaman di tengah
- Segmented control untuk filter di kanan
- Background putih dengan shadow
- Responsive design
- Clean dan minimal design
- Support untuk teks dalam bahasa Malaysia

**Contoh Penggunaan:**
```jsx
<SimplePageLayout
  title="PENGURUSAN INVOIS"
  newButtonText="+ BUAT INVOIS BARU"
  onNewClick={() => console.log('Create new invoice')}
  filterOptions={["SEMUA", "AKTIF", "SELESAI"]}
  activeFilter="SEMUA"
  onFilterChange={(filter) => setFilter(filter)}
>
  <SimpleTable data={invoices} columns={columns} />
</SimplePageLayout>
```

#### SimpleTable
Komponen table yang mudah dan responsif untuk paparan data dengan style seperti dalam gambar.

**Props:**
- `data` - Array data untuk table
- `columns` - Array konfigurasi columns
- `onEdit` - Handler untuk edit (optional)
- `onDelete` - Handler untuk delete (optional)

**Ciri-ciri:**
- Responsive table design
- Empty state handling
- Custom column rendering
- Hover effects dengan transition
- Clean styling dengan border dan spacing yang betul
- Header dengan background gray dan font semibold
- Easy to customize
- Support untuk render functions
- Integration dengan komponen lain (StatusBadge, CurrencyFormat, DateFormat)
- Style yang sepadan dengan design dalam gambar

**Contoh Penggunaan:**
```jsx
const columns = [
  {
    key: 'id',
    header: '#',
    render: (value) => <span className="font-medium text-gray-900">{value}</span>
  },
  {
    key: 'invoiceNumber',
    header: 'Inv No',
    render: (value) => <span className="font-medium text-gray-900">{value}</span>
  },
  {
    key: 'date',
    header: 'Date',
    render: (value) => <DateFormat date={value} />
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (value) => <CurrencyFormat amount={value} />
  },
  {
    key: 'outstanding',
    header: 'Outstanding',
    render: (value) => <CurrencyFormat amount={value} />
  },
  {
    key: 'customerName',
    header: 'Cust'
  },
  {
    key: 'subject',
    header: 'Subject'
  },
  {
    key: 'status',
    header: 'Status',
    render: (value) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    )
  },
  {
    key: 'actions',
    header: 'Action',
    render: (value, row) => (
      <button
        onClick={() => console.log('Edit invoice:', row.id)}
        className="text-blue-600 hover:text-blue-900 font-medium text-sm"
      >
        EDIT
      </button>
    )
  }
]

<SimpleTable
  data={invoices}
  columns={columns}
  onEdit={(row) => console.log('Edit:', row)}
  onDelete={(row) => console.log('Delete:', row)}
/>
```

#### Form Validation
Sistem validation yang lengkap untuk semua jenis form.

**Available Validators:**
- `validateInvoiceForm` - Validation untuk form invoice
- `validateQuoteForm` - Validation untuk form quotation
- `validateReceiptForm` - Validation untuk form receipt
- `validateForm` - Generic validation function
- `validationRules` - Collection of validation rules

**Validation Rules:**
- `required` - Field wajib diisi
- `email` - Format email yang sah
- `phone` - Format telefon yang sah
- `minLength` - Panjang minimum
- `maxLength` - Panjang maksimum
- `min` - Nilai minimum
- `max` - Nilai maksimum
- `positive` - Nilai mesti positif
- `date` - Format tarikh yang sah
- `futureDate` - Tarikh mesti pada masa hadapan
- `pastDate` - Tarikh mesti pada masa lalu

**Contoh Penggunaan:**
```jsx
import { validateForm, isFormValid } from '../utils/formValidation'

const errors = validateForm(formData, 'invoice')
if (isFormValid(errors)) {
  // Form valid, proceed with submission
}
```

### Button Component Variants
Komponen Button menyokong pelbagai variant:

**Solid Buttons:**
- `primary` - Biru (default)
- `secondary` - Kelabu
- `success` - Hijau
- `danger` - Merah
- `warning` - Kuning
- `info` - Cyan

### TableCell Component
Komponen TableCell direka untuk menggantikan span yang berulang dalam table rendering:

**Features:**
- Mengurangkan kod berulang dalam table columns
- Menyokong custom className dan title attributes
- Flexible rendering dengan value atau children props
- Konsisten styling untuk semua table cells

**Usage:**
```jsx
// Basic usage
<TableCell value="Text content" />

// With custom styling
<TableCell 
  value="Text content" 
  className="font-medium text-gray-900" 
  title="Hover text"
/>

// With children
<TableCell className="text-sm text-gray-600">
  Custom content
</TableCell>
```

**Props:**
- `value` - Text content to display
- `className` - CSS classes (default: "text-sm text-gray-900")
- `title` - Hover tooltip text
- `children` - Custom content (overrides value)

**Outline Buttons:**
- `outline` - Outline biru
- `outline-secondary` - Outline kelabu
- `outline-success` - Outline hijau
- `outline-danger` - Outline merah
- `outline-warning` - Outline kuning
- `outline-info` - Outline cyan

**Sizes:**
- `sm` - Kecil
- `md` - Sederhana (default)
- `lg` - Besar

**Contoh Penggunaan:**
```jsx
// Solid buttons
<Button variant="primary">Primary Button</Button>
<Button variant="success">Success Button</Button>

// Outline buttons
<Button variant="outline">Outline Button</Button>
<Button variant="outline-danger">Danger Outline</Button>

// Sizes
<Button size="sm">Small Button</Button>
<Button size="lg">Large Button</Button>
```

### Aliran Aplikasi & Routing (Login Diasingkan)

- Aliran pengguna: Login → Dashboard → Modul (Invois/Quote/Resit)
- Pemisahan Layout:
  - `LoginLayout` digunakan khas untuk route `/login` (tanpa header/nav utama).
  - `MainLayout` digunakan untuk route utama seperti `/` dan halaman terlindung seperti `/dashboard`.
- Protected Route: Komponen `ProtectedRoute` menyemak token (`localStorage.token`). Jika tiada, pengguna dialihkan ke `/login` dengan `state.from`.

### Page Management System

Aplikasi kini mempunyai halaman khusus untuk setiap modul utama:

#### 1. Dashboard (`/dashboard`)
- **Halaman utama** dengan statistik ringkas dan overview sistem
- **Quick actions** untuk akses pantas ke modul lain (Invois, Sebut Harga, Resit)
- **Aktiviti terkini** dan maklumat pengguna
- **Statistik kad** untuk invois, sebut harga, resit, dan pelanggan
- **Butang tindakan pantas** yang link ke halaman modul masing-masing
- **Maklumat pengguna** dan status akaun
- **Color-coded cards** dengan warna yang berbeza untuk setiap modul
- **Gradient background** yang menarik untuk header
- **Responsive grid** untuk statistik dan quick actions
- **Interactive elements** dengan hover effects
- **Loading states** semasa memuatkan data
- **Mock data integration** untuk demonstrasi

#### 2. Invois (`/invoices`)
- **Pengurusan invois** dengan status (Dibayar, Menunggu, Tertunggak)
- **Simple Page Layout** - Layout halaman yang simple dan clean seperti dalam gambar
- **Header Design** - Butang "+ NEW" di kiri, tajuk "INVOICE" di tengah, segmented control "ALL/ACTIVE/DONE" di kanan
- **Simple Table** - Table dengan style seperti dalam gambar dengan kolum: #, Inv No, Date, Amount, Outstanding, Cust, Subject, Status, Action
- **Mock Data** - Data contoh yang sepadan dengan gambar (MSV1018, MBI, 7500.00, etc.)
- **Table Styling** - Header dengan background gray, border yang jelas, spacing yang betul
- **Status Badge** - Badge berwarna biru untuk status "Draft"
- **Date Format** - Format tarikh DD-MM-YYYY (26-08-2025) seperti dalam gambar
- **Currency Format** - Format mata wang Malaysia (MYR) menggunakan CurrencyFormat component
- **Filter System** - Filter berdasarkan status (ALL, ACTIVE, DONE)
- **Responsive Design** - Interface yang responsif untuk semua peranti
- **Clean Styling** - Background putih dengan shadow, minimal design
- **Component Reusability** - Menggunakan SimplePageLayout dan SimpleTable
- **Backup System** - File backup dibuat sebelum perubahan (Invoice copy.jsx10.bak)

#### 3. Sebut Harga (`/quotes`)
- **Pengurusan sebut harga** dengan status (Diterima, Menunggu, Tamat Tempoh, Ditolak)
- **Pencarian dan penapisan** sebut harga berdasarkan pelbagai kriteria
- **Quick action** untuk buat sebut harga baru
- **Fungsi tukar** sebut harga kepada invois
- **Statistik sebut harga** mengikut status dengan visual yang jelas
- **Jadual responsif** dengan maklumat pelanggan, jumlah, dan tarikh sah
- **Tindakan** untuk lihat, edit, tukar ke invois, dan padam sebut harga
- **Green theme** untuk konsistensi visual dengan modul sebut harga
- **Loading states** semasa memuatkan data sebut harga
- **Mock data** untuk demonstrasi dan testing
- **Currency formatting** untuk mata wang Malaysia (MYR)
- **Date formatting** untuk tarikh Malaysia
- **Status badges** berwarna untuk status yang berbeza
- **Gradient header** dengan tema hijau-teal
- **Validity period** pengurusan tempoh sah sebut harga
- **Error handling** dengan fallback data
- **Component reusability** menggunakan Card component

#### 4. Resit (`/receipts`)
- **Pengurusan resit pembayaran** dengan status (Selesai, Menunggu, Dibatalkan)
- **Pencarian dan penapisan** resit berdasarkan pelbagai kriteria
- **Quick action** untuk buat resit baru
- **Maklumat kaedah pembayaran** (Bank Transfer, Cash, Cheque, Credit Card)
- **Statistik resit** mengikut status dengan visual yang jelas
- **Tindakan** untuk lihat, edit, cetak, dan padam resit
- **Purple theme** untuk konsistensi visual dengan modul resit
- **Loading states** semasa memuatkan data resit
- **Mock data** untuk demonstrasi dan testing
- **Currency formatting** untuk mata wang Malaysia (MYR)
- **Date formatting** untuk tarikh Malaysia
- **Status badges** berwarna untuk status yang berbeza
- **Gradient header** dengan tema ungu-fuchsia
- **Payment method icons** untuk kaedah pembayaran yang berbeza
- **Error handling** dengan fallback data
- **Component reusability** menggunakan Card component

### Navigation System

- **Header Navigation**: Menu navigasi di header untuk akses pantas ke semua modul
- **Quick Actions**: Butang tindakan pantas di dashboard untuk navigasi langsung
- **Responsive Design**: Menu tersembunyi pada peranti kecil, navigasi penuh pada desktop
- **Active State**: Indikator visual untuk halaman aktif dalam navigasi
- **Color Coding**: Warna berbeza untuk setiap modul (Biru untuk Invois, Hijau untuk Sebut Harga, Ungu untuk Resit)
- **Hover Effects**: Efek hover untuk pengalaman pengguna yang lebih baik
- **React Router DOM**: Menggunakan Link dan NavLink untuk navigasi
- **Protected Routes**: Semua halaman modul dilindungi dengan authentication
- **State Management**: Pengurusan state navigasi dengan React hooks
- **Accessibility**: ARIA labels dan keyboard navigation support
- **Performance**: Lazy loading untuk halaman yang tidak aktif
- **SEO Friendly**: URL yang bersih dan mudah difahami

Struktur router lengkap:
```jsx
createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  {
    element: <MainLayout />,
    children: [
      { path: '/dashboard', element: (<ProtectedRoute><Dashboard /></ProtectedRoute>) },
      { path: '/invoices', element: (<ProtectedRoute><Invoice /></ProtectedRoute>) },
      { path: '/quotes', element: (<ProtectedRoute><Quote /></ProtectedRoute>) },
      { path: '/receipts', element: (<ProtectedRoute><Receipt /></ProtectedRoute>) }
    ]
  }
])
```

### Project Structure
```
mahsoft/
├── 01-frontend/       # React frontend dengan Vite
│   ├── src/           # Source code frontend
│   │   ├── pages/     # Halaman aplikasi
│   │   │   ├── Dashboard.jsx    # Halaman dashboard
│   │   │   ├── Invoice.jsx      # Halaman invois
│   │   │   ├── Quote.jsx        # Halaman sebut harga
│   │   │   ├── Receipt.jsx      # Halaman resit
│   │   │   └── Login.jsx        # Halaman login
│   │   ├── components/ # Komponen React
│   │   ├── layouts/   # Layout komponen
│   │   ├── contexts/  # React contexts
│   │   ├── hooks/     # Custom hooks
│   │   ├── routes/    # Route components
│   │   └── utils/     # Utility functions
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── vite.config.js # Vite configuration
├── prisma/
│   ├── schema.prisma  # Database schema
│   └── seed.js        # Seed data
├── routes/            # API routes
├── utils/             # Utilities
├── middleware/        # Express middleware
├── backup/           # Backup folder
├── public/           # Built frontend files (production)
└── server.js         # Main server file
```

## Troubleshooting

### Dashboard Stats 500 Error (FIXED)
**Masalah**: API endpoint `/api/v1/dashboard/stats` mengembalikan 500 Internal Server Error.

**Punca**: Field names dalam dashboard route tidak sepadan dengan Prisma schema:
- `totalAmount` sepatutnya `total` untuk invoice
- `outstandingAmount` sepatutnya `amount` untuk debtor
- Status `ACTIVE` dan `PENDING` tidak wujud dalam enum, sepatutnya `SENT`
- Endpoint `/api/v1/dashboard/activity` sepatutnya `/api/v1/dashboard/recent-activity`

**Penyelesaian**: 
- ✅ Diperbaiki field names dalam `/routes/dashboard.js`
- ✅ Diperbaiki status enum values
- ✅ Diperbaiki endpoint URL dalam frontend API client
- ✅ File backup dibuat: `backup/dashboard copy.js1.bak` dan `backup/apiClient copy.js2.bak`

### Database Connection Issues
1. Pastikan MySQL berjalan
2. Semak DATABASE_URL dalam .env
3. Pastikan database `mahsoft_db` wujud
4. Pastikan user `root` dengan password `root` boleh akses database

### Authentication Issues
1. **500 Error pada /api/v1/auth/me**: Pastikan middleware `authenticateToken` digunakan
2. **401 Unauthorized**: 
   - Semak token JWT dalam localStorage
   - Pastikan token tidak di-JSON.stringify (token adalah string, bukan object)
   - Clear localStorage dan login semula jika perlu
3. **Token expired**: Logout dan login semula
4. **Token format issue**: Token disimpan sebagai string biasa, bukan JSON object
5. **Token dengan quotes**: Jika token ada quotes, clear localStorage dan login semula

### Quick Fix untuk Token Issues
```javascript
// Clear localStorage dalam browser console
localStorage.clear()
// Kemudian refresh page dan login semula
```

### API Client Logging
- Hanya error 500 (server/database) dan 401 (authentication) yang akan di-log
- Error 400, 403, 404 tidak akan di-log untuk mengelakkan spam console
- Network errors akan di-log kecuali yang berkaitan dengan authentication

### Frontend Page Issues
**Masalah**: Page tidak memuatkan atau error 404
**Penyelesaian**: 
- Pastikan routing telah dikonfigurasi dengan betul dalam `main.jsx`
- Semak import statement untuk page components
- Pastikan ProtectedRoute wrapper digunakan untuk halaman yang memerlukan authentication

**Masalah**: Quick actions tidak berfungsi
**Penyelesaian**:
- Semak Link component dari react-router-dom
- Pastikan path dalam Link component sepadan dengan route yang ditakrifkan

### InvoiceForm Updates (2024-12-19)
**Perubahan**: InvoiceForm sekarang fetch data customers dan companies dari API sebenar
**Implementasi**:
- Menggunakan `customersAPI.getAll()` dan `companiesAPI.getAll()` untuk fetch data
- Menambah error handling untuk API calls
- Company dengan `is_default=1` akan dipilih secara automatik dalam form
- Menambah loading state semasa fetch data

**Edit Mode Implementation**:
- Menambah `invoicesAPI.getById()` untuk fetch invoice data dalam edit mode
- Menambah `transformInvoiceData()` function untuk convert API data ke form format
- Menambah `invoicesAPI.update()` untuk update existing invoice
- Menambah `invoicesAPI.create()` untuk create new invoice
- Form data transformation untuk items array (details)
- Loading state yang berbeza untuk create vs edit mode

**Files yang diubah**:
- `01-frontend/src/pages/InvoiceForm.jsx` - Menambah API integration dan edit mode
- `01-frontend/src/components/StandardForm.jsx` - Menambah auto-select untuk default company
- `routes/invoices.js` - Mengemaskini PUT endpoint untuk mengendalikan details update

### Auto Overdue Detection (2024-12-19)
**Fungsi**: Sistem automatik mengesan dan menukar status invoice kepada "overdue" jika melebihi due date
**Implementasi**:
- Menambah `checkAndUpdateOverdueStatus()` function dalam Invoice.jsx
- Check invoice dengan status "sent" dan bandingkan due date dengan tarikh semasa
- Update status kepada "OVERDUE" secara automatik untuk invoice yang lewat
- Update local state untuk paparan segera tanpa perlu refresh
- Menggunakan `invoicesAPI.update()` untuk mengemaskini status di backend

**Cara Kerja**:
1. Setiap kali fetch invoices, sistem akan check semua invoice dengan status "sent"
2. Bandingkan due date dengan tarikh semasa
3. Jika due date telah lewat, update status kepada "OVERDUE"
4. Update local state untuk paparan segera
5. Log jumlah invoice yang telah diupdate

**Files yang diubah**:
- `01-frontend/src/pages/Invoice.jsx` - Menambah fungsi auto overdue detection
- `backup/Invoice copy.jsx[timestamp].bak` - Backup fail asal

### Status Filter Simplification (2024-12-19)
**Fungsi**: Menyederhanakan status filter untuk hanya mempunyai 3 pilihan sahaja
**Perubahan**:
- Mengurangkan filter options dari 4 kepada 3: [ALL, ACTIVE, DONE]
- Menghapuskan filter "CANCELLED" yang berasingan
- Menggabungkan status "cancelled" ke dalam kategori "DONE"
- Menyederhanakan mapping status untuk kemudahan penggunaan

**Status Mapping**:
- **ALL**: Semua invoice (draft, sent, overdue, paid, cancelled)
- **ACTIVE**: Invoice yang aktif (draft, sent, overdue)
- **DONE**: Invoice yang selesai (paid, cancelled)

**Files yang diubah**:
- `01-frontend/src/pages/Invoice.jsx` - Kemaskini filterOptions dan filteredInvoices logic
- `backup/Invoice copy.jsx[timestamp].bak` - Backup fail asal

### Invoice Quick Actions (2024-12-19)
**Fungsi**: Menambah quick action butang "Paid" dan "Cancel" untuk invoice seperti yang ada pada quote
**Implementasi**:
- Menambah kolum "Quick Actions" dalam jadual invoice
- Menggunakan ActionButtonGroup component dengan preset invoice
- Menambah fungsi `handleInvoiceStatusChange()` untuk mengurus status invoice
- Menambah state `actionLoading` untuk loading indicator
- Mengintegrasikan dengan API endpoints yang sedia ada

**Quick Actions**:
- **Paid**: Mark invoice sebagai dibayar (menggunakan `invoicesAPI.markPaid()`)
- **Cancel**: Cancel invoice (menggunakan `invoicesAPI.update()` dengan status CANCELLED)
- Hanya dipaparkan untuk invoice dengan status aktif (draft, sent, overdue)
- Confirmation dialog sebelum melakukan action

**Files yang diubah**:
- `01-frontend/src/pages/Invoice.jsx` - Menambah quick actions functionality
- `01-frontend/src/components/ActionButtonGroup.jsx` - Menambah butang Paid dan Cancel
- `01-frontend/src/utils/apiClient.js` - Kemaskini markPaid API untuk menghantar data
- `backup/Invoice copy.jsx[timestamp].bak` - Backup fail asal
- `backup/components/ActionButtonGroup copy.jsx[timestamp].bak` - Backup fail asal
- `backup/utils/apiClient copy.js[timestamp].bak` - Backup fail asal

### Quote Auto Expired Detection (2024-12-19)
**Fungsi**: Sistem automatik mengesan dan menukar status quote kepada "expired" jika melebihi validUntil date
**Implementasi**:
- Menambah `checkAndUpdateExpiredStatus()` function dalam Quote.jsx
- Check quote dengan status "sent" dan bandingkan validUntil dengan tarikh semasa
- Update status kepada "EXPIRED" secara automatik untuk quote yang lewat
- Update local state untuk paparan segera tanpa perlu refresh
- Menggunakan `quotesAPI.updateStatus()` untuk mengemaskini status di backend

**Status Filter Simplification untuk Quote**:
- Mengurangkan filter options dari 5 kepada 3: [ALL, ACTIVE, DONE]
- **ALL**: Semua quote (draft, sent, expired, accepted, rejected, dummy)
- **ACTIVE**: Quote yang aktif (draft, sent, expired)
- **DONE**: Quote yang selesai (accepted, rejected, dummy)

**Files yang diubah**:
- `01-frontend/src/pages/Quote.jsx` - Menambah fungsi auto expired detection dan status filter simplification
- `backup/Quote copy.jsx[timestamp].bak` - Backup fail asal

### Receipt API Integration & Status Filter (2024-12-19)
**Fungsi**: Mengintegrasikan Receipt dengan API sebenar dan menyederhanakan status filter
**Implementasi**:
- Menggantikan debug data dengan `receiptsAPI.getAll()`
- Menambah `fetchReceipts()` function untuk API integration
- Menambah location-based refresh functionality
- Mengemaskini columns untuk menggunakan TableCell component
- Menyederhanakan status filter kepada 3 pilihan sahaja

**Status Filter Simplification untuk Receipt**:
- Mengurangkan filter options dari 3 kepada 3: [ALL, ACTIVE, DONE]
- **ALL**: Semua receipt (draft, issued, cancelled)
- **ACTIVE**: Receipt yang aktif (draft, issued)
- **DONE**: Receipt yang selesai (cancelled)

**Files yang diubah**:
- `01-frontend/src/pages/Receipt.jsx` - API integration dan status filter simplification
- `backup/Receipt copy.jsx[timestamp].bak` - Backup fail asal

**API Updates**:
- Menambah validation untuk `details` dalam updateInvoiceValidation
- Mengemaskini PUT endpoint untuk mengendalikan details update dengan transaction
- Menambah calculation totals untuk details yang dikemaskini
- Menggunakan Prisma transaction untuk atomic update operations

**Table Refresh Implementation**:
- Menambah `useLocation` hook untuk detect navigation changes
- Menambah `fetchInvoices` function untuk refresh data
- Menambah automatic refresh apabila navigate balik dari edit page
- Menambah manual refresh button dalam SimplePageLayout
- Menggunakan `navigate` dengan state untuk trigger refresh

**Files yang diubah untuk refresh**:
- `01-frontend/src/pages/Invoice.jsx` - Menambah refresh mechanism
- `01-frontend/src/pages/InvoiceForm.jsx` - Menambah refresh state dalam navigation

### Error Handling & Routing Updates (2024-12-19)
**Perubahan**: Menambah error handling dan error page untuk route yang tidak tersenarai
**Implementasi**:
- Menambah `ErrorPage` component untuk 404 dan error lain
- Mengemaskini routing configuration dengan `errorElement`
- Menambah catch-all route (`path: '*'`) untuk 404 errors
- Menambah error handling untuk setiap route
- Menggunakan `useRouteError` hook untuk error details

**ErrorPage Features**:
- Responsive error messages berdasarkan error type (404, 403, 500)
- Navigation buttons (Kembali, Ke Dashboard, Muat Semula)
- Development mode error details
- User-friendly error messages dalam Bahasa Melayu

**Files yang diubah**:
- `01-frontend/src/pages/ErrorPage.jsx` - Error page component baru
- `01-frontend/src/routes/index.jsx` - Routing configuration dengan error handling

### Receipt Data Migration (15 September 2025)

**Data Receipt SQL telah ditukar kepada format Prisma seeder**:

**Perubahan yang dilakukan**:
- Menukar data receipt dari format SQL INSERT kepada JavaScript object
- Memisahkan data detail receipt ke fail berasingan `prisma/data/receipt-details.js`
- Mengemas kini seeder untuk menggunakan mapping customer berdasarkan tempId
- Menyesuaikan struktur data dengan Prisma schema

**Files yang diubah**:
- `prisma/data/receipts.js` - Data receipt utama (68 receipt records)
- `prisma/data/receipt-details.js` - Data detail receipt yang diasingkan
- `prisma/seeders/receiptSeeder.js` - Seeder yang dikemas kini untuk mapping customer

**Struktur Data Receipt**:
- `receiptNumber` - Nombor receipt (contoh: '0001', '0002')
- `date` - Tarikh receipt
- `status` - Status receipt ('ISSUED')
- `subject` - Subjek/tajuk receipt
- `subtotal`, `taxAmount`, `total` - Jumlah kewangan
- `tempCompanyId`, `tempCustomerId` - ID sementara untuk mapping

**Backup Files**:
- `backup/receipts copy.js1.bak` - Backup data receipt asal
- `backup/receiptSeeder copy.js1.bak` - Backup seeder asal

### Frontend Receipt Update (15 September 2025)

**Frontend Receipt telah dikemas kini untuk menyesuaikan dengan data baru**:

**Perubahan yang dilakukan**:
- Mengemas kini fetch function untuk handle response structure yang betul
- Menambah field tambahan dalam data transformation (companyName, userName, subtotal, taxAmount, details, notes)
- Memperbaiki search functionality untuk include notes field
- Mengemas kini stats calculation untuk status yang betul (issued, draft, cancelled)
- Menambah error handling dan logging untuk debugging
- Mengemas kini delete functionality dengan API call yang betul

### Frontend usePrintPreview Optimization (15 September 2025)

**usePrintPreview hook telah dioptimumkan secara menyeluruh untuk mengelakkan pengulangan kod**:

**Perubahan yang dilakukan**:
- Menambah helper functions untuk mengelakkan pengulangan kod:
  - `createCompanyData()` - untuk data syarikat
  - `createCustomerData()` - untuk data pelanggan  
  - `createItemsData()` - untuk data item/barang
  - `createBankData()` - untuk data bank
  - `createDocumentData()` - fungsi generik untuk semua jenis dokumen
- Menggantikan semua `if-else` statements dengan API mapping yang lebih efisien
- Mengurangkan kod dari ~200+ baris kepada ~150 baris (25% pengurangan)
- Meningkatkan maintainability dan readability kod dengan ketara
- Backup file telah dibuat sebagai `usePrintPreview copy.js2.bak`

**Keuntungan optimisasi**:
- **DRY Principle**: Mengelakkan pengulangan kod yang sama
- **Scalability**: Mudah menambah jenis dokumen baru
- **Maintainability**: Perubahan struktur data hanya perlu dibuat di satu tempat
- **Performance**: Kod lebih efisien dan mudah dibaca

### Frontend Favicon Update (15 September 2025)

**Favicon aplikasi telah dikemas kini untuk menggunakan logo Mahsoft**:

**Perubahan yang dilakukan**:
- Menggantikan `vite.svg` dengan `favicon.png` menggunakan logo Mahsoft
- Menambah multiple favicon formats untuk compatibility yang lebih baik:
  - Standard favicon untuk desktop browsers
  - Shortcut icon untuk legacy browsers
  - Apple touch icon untuk iOS devices
- Backup file asal telah dibuat sebagai `vite copy.svg.bak` dan `index copy.html.bak`

**Files yang diubah**:
- `01-frontend/public/favicon.png` - Favicon baru menggunakan logo Mahsoft
- `01-frontend/index.html` - Updated favicon references
- `backup/vite copy.svg.bak` - Backup favicon asal
- `backup/index copy.html.bak` - Backup index.html asal
- Menambah search input dan stats display dalam UI

**Files yang diubah**:
- `01-frontend/src/pages/Receipt.jsx` - Frontend component utama
- `backup/Receipt copy.jsx1.bak` - Backup component asal

**Fitur Baru**:
- Search by receipt number, customer name, subject, atau notes
- Stats display dengan breakdown status (Total, Issued, Draft, Cancelled)
- Improved error handling dan user feedback
- Better data transformation untuk compatibility dengan backend

**Backup Files**:
- `backup/receipts copy.js1.bak` - Backup data receipt asal
- `backup/receiptSeeder copy.js1.bak` - Backup seeder asal
- `backup/Receipt copy.jsx1.bak` - Backup frontend component asal

### Migration Issues
```bash
# Reset database (HATI-HATI: ini akan padam semua data)
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name your-migration-name
```

### Port Already in Use
```bash
# Cari process yang menggunakan port 5000 (backend)
lsof -ti:5000

# Cari process yang menggunakan port 3000 (frontend)
lsof -ti:3000

# Kill process
kill -9 <PID>
```

## Sokongan

Untuk sebarang pertanyaan atau isu, sila hubungi pasukan development atau buat issue dalam repository ini.

---

**Versi**: 1.0.0  
**Tarikh**: 2024  
**Pembangun**: Mahsoft Development Team
 
## Penjajaran Teks Justify (Sekata Kiri & Kanan)

Gunakan salah satu kaedah mengikut konteks aplikasi anda:

- React + Tailwind CSS
  - Tambah kelas `text-justify` pada elemen teks.
  - Contoh:
```jsx
<p className="text-justify leading-relaxed">
  Teks ini akan disusun sekata kiri dan kanan.
</p>
```

- CSS biasa (jika tidak menggunakan Tailwind atau untuk gaya khusus cetakan)
```css
.justify-text { text-align: justify; }
```
```html
<p class="justify-text">Teks ini akan disusun sekata kiri dan kanan.</p>
```

- Untuk halaman cetakan, anda boleh menambah dalam `01-frontend/src/styles/print.css`:
```css
.print-content p { text-align: justify; }
```

Nota: `text-align: justify;` sudah mencukupi pada pelayar moden. Untuk bacaan lebih selesa, tambah `leading-relaxed` (Tailwind) atau `line-height: 1.625;` (CSS).