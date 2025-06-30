import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const prlabsService = {
    // Chat
    async chat(prompt, model = 'gpt-4') {
        try {
            const response = await axios.post(`${API_URL}/api/prlabs/chat`, {
                prompt,
                model
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Generación de imágenes
    async generateImage(prompt, options = {}) {
        try {
            const response = await axios.post(`${API_URL}/api/prlabs/image`, {
                prompt,
                model: options.model || 'dall-e-3',
                size: options.size || '1024x1024',
                quality: options.quality || 'standard',
                style: options.style || 'vivid'
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Texto a voz
    async textToSpeech(text, options = {}) {
        try {
            const response = await axios.post(`${API_URL}/api/prlabs/voice`, {
                text,
                voice: options.voice || 'alloy',
                model: options.model || 'tts-1'
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Generación de texto
    async generateText(prompt, model = 'gpt-4') {
        try {
            const response = await axios.post(`${API_URL}/api/prlabs/text`, {
                prompt,
                model
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export { prlabsService }; 