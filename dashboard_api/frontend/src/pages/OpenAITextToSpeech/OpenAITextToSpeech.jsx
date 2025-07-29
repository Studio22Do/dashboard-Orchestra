import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import { openaiTTSService } from '../../services/openaiTTS';
import { APP_CONFIG } from '../../config/constants';

const OpenAITextToSpeech = () => {
    const [text, setText] = useState('');
    const [voice, setVoice] = useState('alloy');
    const [instructions, setInstructions] = useState('Speak in a natural tone.');
    const [format, setFormat] = useState('mp3');
    const [audioUrl, setAudioUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!text) {
            setError('Por favor ingresa un texto para convertir');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await openaiTTSService.textToSpeech(text, {
                voice,
                instructions,
                format
            });
            setAudioUrl(response.audio_url);
        } catch (err) {
            setError(err.message || 'Error al generar el audio');
        } finally {
            setLoading(false);
        }
    };

    const handleTest = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${APP_CONFIG.API_URL}/api/${process.env.REACT_APP_MODE || 'beta_v1'}/openai-tts/test`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    text: 'Texto de prueba para verificar la funcionalidad'
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en la prueba');
            }
            
            const data = await response.json();
            setError(`✅ ${data.message}`);
        } catch (err) {
            setError(`❌ ${err.message || 'Error en la prueba'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                OpenAI Text to Speech
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Convierte texto a voz natural usando la tecnología de OpenAI. Soporta múltiples voces e idiomas.
            </Typography>

            <Paper sx={{ p: 3, mt: 3 }}>
                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <TextField
                            label="Texto a convertir"
                            multiline
                            rows={4}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            error={!text && error}
                            helperText={!text && error ? error : ''}
                            required
                        />
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Voz</InputLabel>
                            <Select value={voice} onChange={(e) => setVoice(e.target.value)} label="Voz">
                                <MenuItem value="alloy">Alloy</MenuItem>
                                <MenuItem value="echo">Echo</MenuItem>
                                <MenuItem value="fable">Fable</MenuItem>
                                <MenuItem value="onyx">Onyx</MenuItem>
                                <MenuItem value="nova">Nova</MenuItem>
                                <MenuItem value="shimmer">Shimmer</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Formato</InputLabel>
                            <Select value={format} onChange={(e) => setFormat(e.target.value)} label="Formato">
                                <MenuItem value="mp3">MP3</MenuItem>
                                <MenuItem value="opus">Opus</MenuItem>
                                <MenuItem value="aac">AAC</MenuItem>
                                <MenuItem value="flac">FLAC</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <TextField
                            label="Instrucciones de tono"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Speak in a natural tone."
                        />
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || !text}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Generar Audio'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleTest}
                            disabled={loading}
                        >
                            Probar Funcionalidad
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {audioUrl && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Audio generado:
                        </Typography>
                        <audio controls src={audioUrl} style={{ width: '100%' }} />
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default OpenAITextToSpeech; 