import axios from 'axios';
import { APP_CONFIG } from '../config/constants';

const API_URL = APP_CONFIG.API_URL;
const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
const API_BASE_URL = `${API_URL}/api/${API_MODE}`;

// Configuración de axios con el token
const getAxiosConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// Lista de voces disponibles
export const AVAILABLE_VOICES = [
    { id: 'alloy', name: 'Alloy', description: 'Voz neutral y versátil' },
    { id: 'echo', name: 'Echo', description: 'Voz con más profundidad' },
    { id: 'fable', name: 'Fable', description: 'Voz narrativa cálida' },
    { id: 'onyx', name: 'Onyx', description: 'Voz autoritaria y formal' },
    { id: 'nova', name: 'Nova', description: 'Voz juvenil y energética' },
    { id: 'shimmer', name: 'Shimmer', description: 'Voz clara y brillante' }
];

// Instrucciones predefinidas
export const PRESET_INSTRUCTIONS = [
    { id: 'natural', text: 'Speak in a natural tone.' },
    { id: 'energetic', text: 'Speak in a lively and optimistic tone.' },
    { id: 'calm', text: 'Use a calm, soothing voice.' },
    { id: 'professional', text: 'Sound serious and authoritative.' },
    { id: 'friendly', text: 'Speak in a warm and friendly manner.' }
];

// Formatos de salida disponibles
export const OUTPUT_FORMATS = [
    { id: 'mp3', name: 'MP3', description: 'Formato estándar compatible con la mayoría de dispositivos' },
    { id: 'opus', name: 'Opus', description: 'Ideal para streaming y baja latencia' },
    { id: 'aac', name: 'AAC', description: 'Preferido por plataformas móviles' },
    { id: 'flac', name: 'FLAC', description: 'Audio sin pérdida de calidad' }
];

// Servicio principal de Text to Speech
const openaiTTSService = {
    textToSpeech: async (text, options = {}) => {
        try {
            const url = `${API_BASE_URL}/openai-tts/speech`;
            console.log('URL OpenAI TTS:', url);
            
            // Configurar axios para recibir una respuesta blob
            const response = await axios.post(url, {
                input: text,
                voice: options.voice || 'alloy',
                model: options.model || 'tts-1',
                instructions: options.instructions || 'Speak in a natural tone.',
                format: options.format || 'mp3'
            }, {
                ...getAxiosConfig(),
                responseType: 'blob' // Importante: especificar que esperamos un blob
            });

            // Crear URL del blob para reproducción
            const audioUrl = URL.createObjectURL(new Blob([response.data], { type: 'audio/mp3' }));
            return { audio_url: audioUrl };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export { openaiTTSService }; 