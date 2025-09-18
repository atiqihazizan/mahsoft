// Storage utility untuk localStorage management
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  REMEMBER_ME: 'remember_me'
}

export const storage = {
  // Set item dengan error handling
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      return false
    }
  },

  // Get item dengan error handling
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      return null
    }
  },

  // Remove item
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      return false
    }
  },

  // Clear all storage
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      return false
    }
  },

  // Token management - token is a string, not an object
  setToken: (token) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
      return true
    } catch (error) {
      return false
    }
  },
  getToken: () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      
      // Strip quotes if token was stored with JSON.stringify
      if (token && token.startsWith('"') && token.endsWith('"')) {
        const cleanToken = token.slice(1, -1)
        // Update with clean token
        localStorage.setItem(STORAGE_KEYS.TOKEN, cleanToken)
        return cleanToken
      }
      return token
    } catch (error) {
      return null
    }
  },
  removeToken: () => storage.removeItem(STORAGE_KEYS.TOKEN),

  // User management
  setUser: (user) => storage.setItem(STORAGE_KEYS.USER, user),
  getUser: () => storage.getItem(STORAGE_KEYS.USER),
  removeUser: () => storage.removeItem(STORAGE_KEYS.USER),

  // Remember me
  setRememberMe: (remember) => storage.setItem(STORAGE_KEYS.REMEMBER_ME, remember),
  getRememberMe: () => storage.getItem(STORAGE_KEYS.REMEMBER_ME),

  // Check if user is logged in
  isLoggedIn: () => {
    const token = storage.getToken()
    const user = storage.getUser()
    return !!(token && user)
  },

  // Logout - clear all auth data
  logout: () => {
    storage.removeToken()
    storage.removeUser()
    storage.removeItem(STORAGE_KEYS.REMEMBER_ME)
  }
}

export default storage
