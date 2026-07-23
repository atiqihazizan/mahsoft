const path = require('path')
const fs = require('fs')

const FONT_PATH = path.join(__dirname, '..', 'public', 'fonts', 'Audiowide-Regular.ttf')
const AUDIOWIDE_FONT_SRC = fs.existsSync(FONT_PATH) ? `file://${FONT_PATH}` : ''

function getFontFace(fontSrc) {
  const src = fontSrc || AUDIOWIDE_FONT_SRC
  if (!src) return ''
  return `<style>@font-face{font-family:'Audiowide';font-style:normal;font-weight:400;src:url('${src}') format('truetype');}</style>`
}

module.exports = { getFontFace, AUDIOWIDE_DATA_URI: AUDIOWIDE_FONT_SRC }
