import axios from 'axios';

const API_HOST = 'speech-to-text-ai.p.rapidapi.com';
const API_BASE_URL = `https://${API_HOST}`;

const headers = {
  'x-rapidapi-host': API_HOST,
  'Content-Type': 'application/x-www-form-urlencoded'
};

class SpeechToTextService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: headers
    });

    // Interceptor para agregar la API key en cada petición
    this.api.interceptors.request.use((config) => {
      config.headers['x-rapidapi-key'] = process.env.REACT_APP_RAPIDAPI_KEY;
      return config;
    });
  }

  // Transcribir directamente desde una URL
  async transcribeFromUrl(url, lang = 'auto') {
    try {
      const response = await this.api.post('/transcribe', null, {
        params: {
          url,
          lang,
          task: 'transcribe'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Encolar una transcripción (para archivos largos)
  async queueTranscription(url, lang = 'auto') {
    try {
      const response = await this.api.post('/queue', null, {
        params: {
          url,
          lang,
          task: 'transcribe'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Verificar estado de una transcripción en cola
  async checkTranscriptionStatus(taskId) {
    try {
      const response = await this.api.get(`/queue/${taskId}/status`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener resultado de una transcripción en cola
  async getTranscriptionResult(taskId) {
    try {
      const response = await this.api.get(`/queue/${taskId}/result`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Manejador de errores
  handleError(error) {
    if (error.response) {
      // Error con respuesta del servidor
      const message = error.response.data?.message || error.response.data?.error || 'Error en el servidor';
      return new Error(message);
    } else if (error.request) {
      // Error sin respuesta del servidor
      return new Error('No se pudo conectar con el servidor');
    } else {
      // Error en la configuración de la petición
      return new Error('Error al procesar la solicitud');
    }
  }
}

export const speechToTextService = new SpeechToTextService(); 