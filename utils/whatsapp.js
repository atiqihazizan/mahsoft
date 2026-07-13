const encodeText = (text) => encodeURIComponent(text)

const generateWaLink = (phone, message) => {
  const cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.length < 10) return null
  return `https://wa.me/${cleaned}?text=${encodeText(message)}`
}

module.exports = { generateWaLink }
