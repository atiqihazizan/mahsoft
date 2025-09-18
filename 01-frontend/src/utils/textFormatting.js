/**
 * Text Formatting Utilities
 * Collection of utility functions for text formatting and manipulation
 */

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation (default: 20)
 * @param {string} suffix - Suffix to add when truncated (default: '...')
 * @returns {string} - Truncated text with suffix if needed
 */
export const truncateText = (text, maxLength = 20, suffix = '...') => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}${suffix}`
}

/**
 * Format text with conditional truncation
 * @param {string} value - The value to format
 * @param {number} maxLength - Maximum length before truncation (default: 20)
 * @returns {string} - Formatted text
 */
export const formatText = (value, maxLength = 20) => {
  return truncateText(value, maxLength)
}

/**
 * Capitalize first letter of each word
 * @param {string} text - The text to capitalize
 * @returns {string} - Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return ''
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Convert text to title case
 * @param {string} text - The text to convert
 * @returns {string} - Title case text
 */
export const toTitleCase = (text) => {
  if (!text) return ''
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Remove extra whitespace and normalize text
 * @param {string} text - The text to normalize
 * @returns {string} - Normalized text
 */
export const normalizeText = (text) => {
  if (!text) return ''
  return text.trim().replace(/\s+/g, ' ')
}

/**
 * Format phone number
 * @param {string} phone - The phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

/**
 * Format email with truncation
 * @param {string} email - The email to format
 * @param {number} maxLength - Maximum length before truncation (default: 30)
 * @returns {string} - Formatted email
 */
export const formatEmail = (email, maxLength = 30) => {
  if (!email) return ''
  if (email.length <= maxLength) return email
  
  const [localPart, domain] = email.split('@')
  if (!domain) return truncateText(email, maxLength)
  
  const maxLocalLength = maxLength - domain.length - 1 // -1 for @
  if (maxLocalLength <= 0) return truncateText(email, maxLength)
  
  return `${truncateText(localPart, maxLocalLength)}@${domain}`
}

/**
 * Format name with proper capitalization and truncation
 * @param {string} name - The name to format
 * @param {number} maxLength - Maximum length before truncation (default: 20)
 * @returns {string} - Formatted name
 */
export const formatName = (name, maxLength = 20) => {
  if (!name) return ''
  const capitalized = capitalizeWords(name)
  return truncateText(capitalized, maxLength)
}

/**
 * Format address with truncation
 * @param {string} address - The address to format
 * @param {number} maxLength - Maximum length before truncation (default: 30)
 * @returns {string} - Formatted address
 */
export const formatAddress = (address, maxLength = 30) => {
  if (!address) return ''
  return truncateText(normalizeText(address), maxLength)
}

/**
 * Format description with truncation and line breaks
 * @param {string} description - The description to format
 * @param {number} maxLength - Maximum length before truncation (default: 50)
 * @returns {string} - Formatted description
 */
export const formatDescription = (description, maxLength = 50) => {
  if (!description) return ''
  return truncateText(normalizeText(description), maxLength)
}

// Default export with commonly used functions
export default {
  truncateText,
  formatText,
  capitalizeWords,
  toTitleCase,
  normalizeText,
  formatPhoneNumber,
  formatEmail,
  formatName,
  formatAddress,
  formatDescription
}
