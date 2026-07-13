const encodeText = (text) => encodeURIComponent(text)

const generateWaLink = (phone, message) => {
  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('0')) cleaned = '60' + cleaned.slice(1)
  if (cleaned.length < 10) return null
  return `https://wa.me/${cleaned}?text=${encodeText(message)}`
}

module.exports = { generateWaLink }
