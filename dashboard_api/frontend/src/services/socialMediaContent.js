import axios from 'axios';
import { APP_CONFIG } from '../config/constants';

const API_URL = APP_CONFIG.API_URL;
const API_MODE = process.env.REACT_APP_MODE || 'beta_v2';
const API_BASE_URL = API_URL.endsWith('/api')
  ? `${API_URL}/${API_MODE}/social-media-content`
  : `${API_URL}/api/${API_MODE}/social-media-content`;

/**
 * Genera contenido para redes sociales usando el backend
 * @param {Object} params
 * @param {string} params.platform - Plataforma destino (ej: 'Instagram', 'Facebook', etc.)
 * @param {string} params.text - Prompt base para la generación
 * @param {string} params.lang - Código de idioma (ej: 'es', 'en')
 * @param {number} params.length - Longitud máxima del contenido
 * @returns {Promise<{content: string, cacheTime: number}>}
 */
export const generateSocialMediaContent = async ({ platform, text, lang = 'es', length = 150 }) => {
  const url = `${API_BASE_URL}/generate`;
  const payload = { platform, text, lang, length };
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.post(url, payload, { headers });
  return response.data;
}; 