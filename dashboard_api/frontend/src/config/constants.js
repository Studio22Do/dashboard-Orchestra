// Configuración de la aplicación
export const APP_CONFIG = {
  // URLs
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  APP_URL: process.env.REACT_APP_APP_URL || 'http://localhost:3000',
  
  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
  
  // Configuración de email
  EMAIL_VERIFICATION_REQUIRED: true,
  
  // Configuración de contraseñas
  PASSWORD_MIN_LENGTH: 6,
  
  // Configuración de notificaciones
  NOTIFICATION_DURATION: 5000,
  
  // Rutas
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_EMAIL: '/verify-email',
    DASHBOARD: '/',
    PROFILE: '/profile',
  }
};

// Validaciones
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MIN_LENGTH: 2,
  PASSWORD_MIN_LENGTH: 6,
};

// Mensajes
export const MESSAGES = {
  SUCCESS: {
    REGISTRATION: '¡Registro exitoso! Revisa tu correo para verificar tu cuenta.',
    LOGIN: '¡Inicio de sesión exitoso!',
    EMAIL_VERIFIED: '¡Email verificado exitosamente!',
    EMAIL_RESENT: 'Email de verificación reenviado. Revisa tu bandeja de entrada.',
    GOOGLE_AUTH: '¡Autenticación con Google exitosa!',
  },
  ERROR: {
    REQUIRED_FIELDS: 'Por favor completa todos los campos',
    INVALID_EMAIL: 'Ingresa un correo electrónico válido',
    PASSWORD_TOO_SHORT: `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`,
    PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden',
    NAME_REQUIRED: 'El nombre es requerido',
    EMAIL_REQUIRED: 'El correo electrónico es requerido',
    PASSWORD_REQUIRED: 'La contraseña es requerida',
    GOOGLE_OAUTH_ERROR: 'Google OAuth no está disponible. Intenta más tarde.',
    GENERIC_ERROR: 'Ha ocurrido un error. Intenta nuevamente.',
  }
};

export default APP_CONFIG; 