# Assets Folder

Folder ini mengandungi semua aset statik untuk aplikasi frontend.

## Struktur Folder

```
assets/
├── fonts/           # Font files
│   ├── Audiowide-Regular.ttf
│   └── Roboto-Regular.ttf
├── logo/            # Logo files
│   └── logo.png
└── react.svg        # React logo
```

## Font

### Audiowide
- **File**: `fonts/Audiowide-Regular.ttf`
- **Penggunaan**: Header dan title yang memerlukan font yang menonjol
- **CSS Class**: `.font-audiowide`

### Roboto
- **File**: `fonts/Roboto-Regular.ttf`
- **Penggunaan**: Font utama untuk content dan body text
- **CSS Class**: Default font family

## Logo

### Mahsoft Logo
- **File**: `logo/logo.png`
- **Penggunaan**: Logo syarikat dalam header dan print preview
- **Format**: PNG dengan background transparent

## Cara Penggunaan

### Import Font dalam CSS
```css
@font-face {
  font-family: 'audiowide';
  src: url('../assets/fonts/Audiowide-Regular.ttf');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### Import Logo dalam React
```jsx
import logoImage from '../assets/logo/logo.png'

// Penggunaan
<img src={logoImage} alt="Mahsoft Logo" />
```

## Nota Penting

- Semua font menggunakan `font-display: swap` untuk performance yang lebih baik
- Logo menggunakan format PNG untuk kualiti yang baik
- Path relatif digunakan untuk kemudahan maintenance
