import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
            const response = await axios.post(`${API_URL}/api/openai-tts/speech`, {
                input: text,
                voice: options.voice || 'alloy',
                model: options.model || 'tts-1',
                instructions: options.instructions || 'Speak in a natural tone.',
                format: options.format || 'mp3'
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export { openaiTTSService }; 