import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Tooltip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  YouTube as YouTubeIcon,
  Language as LanguageIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

// Base URL de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
const API_BASE_URL = `${API_URL}/${API_MODE}`;

// Lista actualizada de idiomas soportados
const LANGUAGES = [
  { value: 'en', label: 'Inglés' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Francés' },
  { value: 'de', label: 'Alemán' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Portugués' },
  { value: 'ru', label: 'Ruso' },
  { value: 'zh', label: 'Chino' },
  { value: 'ja', label: 'Japonés' },
  { value: 'ko', label: 'Coreano' },
  { value: 'ar', label: 'Árabe' },
  { value: 'hi', label: 'Hindi' },
  { value: 'tr', label: 'Turco' },
  { value: 'nl', label: 'Holandés' },
  { value: 'pl', label: 'Polaco' }
];

const PLATFORMS = [
  { value: 'direct', label: 'URL Directa', icon: <UploadIcon /> },
  { value: 'youtube', label: 'YouTube', icon: <YouTubeIcon /> }
];

const SpeechToTextAI = () => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('direct');
  const [language, setLanguage] = useState('en');  // Cambiado de 'auto' a 'en'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);

  // Efecto para monitorear transcripciones en cola
  useEffect(() => {
    let intervalId;
    if (taskId && taskStatus !== 'completed' && taskStatus !== 'failed') {
      intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/speech-to-text/queue/${taskId}/status`);
          setTaskStatus(response.data.status);
          
          if (response.data.status === 'completed') {
            const result = await axios.get(`${API_BASE_URL}/speech-to-text/queue/${taskId}/result`);
            handleTranscriptionComplete(result.data);
          } else if (response.data.status === 'failed') {
            setError('La transcripción falló');
            setLoading(false);
          }
        } catch (err) {
          setError(err.response?.data?.error || 'Error al verificar el estado');
          setTaskStatus('failed');
          setLoading(false);
        }
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [taskId, taskStatus]);

  const handleTranscriptionComplete = (result) => {
    setTranscription({
      text: result.text,
      metadata: {
        duration: result.duration,
        words: result.words,
        confidence: result.confidence
      }
    });
    setTaskId(null);
    setTaskStatus(null);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Por favor ingresa una URL');
      return;
    }

    setLoading(true);
    setError(null);
    setTranscription(null);

    try {
      // Usar GET con los parámetros en la URL
      const response = await axios.get(`${API_BASE_URL}/speech-to-text/transcribe`, {
        params: {
          url,
          lang: language,
          task: 'transcribe'
        }
      });
      
      // La respuesta ya viene con el formato correcto
      setTranscription({
        text: response.data.text,
        metadata: {
          duration: response.data.duration,
          words: response.data.words,
          confidence: response.data.confidence
        }
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al transcribir el audio');
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (transcription) {
      navigator.clipboard.writeText(transcription.text);
    }
  };

  const handleDownload = () => {
    if (transcription) {
      const blob = new Blob([transcription.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transcription-${new Date().toISOString()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Speech to Text AI
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Transcribe audio y video desde múltiples fuentes usando IA avanzada
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </Box>

      <Paper sx={{ mb: 4, p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL del Audio/Video"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://ejemplo.com/audio.mp3 o https://youtube.com/watch?v=..."
                helperText="Ingresa la URL del archivo a transcribir"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Plataforma</InputLabel>
                <Select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  label="Plataforma"
                >
                  {PLATFORMS.map((p) => (
                    <MenuItem key={p.value} value={p.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {p.icon}
                        {p.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Idioma</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label="Idioma"
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LanguageIcon />
                        {lang.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || (taskId && taskStatus !== 'failed')}
                startIcon={loading ? <CircularProgress size={24} /> : <UploadIcon />}
                sx={{ height: '56px' }}
              >
                {loading ? 'Procesando...' : 'Transcribir'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {taskId && taskStatus && taskStatus !== 'completed' && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1">
              Estado de la transcripción: {taskStatus}
            </Typography>
            <CircularProgress size={20} sx={{ ml: 2 }} />
          </Box>
        </Alert>
      )}

      {transcription && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Transcripción
            </Typography>
            <Box>
              <Tooltip title="Copiar texto">
                <IconButton onClick={handleCopy}>
                  <CopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Descargar texto">
                <IconButton onClick={handleDownload}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
            {transcription.text}
          </Typography>

          {transcription.metadata && (
            <Grid container spacing={2}>
              {transcription.metadata.duration && (
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Duración: {transcription.metadata.duration}
                  </Typography>
                </Grid>
              )}
              {transcription.metadata.words && (
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Palabras: {transcription.metadata.words}
                  </Typography>
                </Grid>
              )}
              {transcription.metadata.confidence && (
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Confianza: {(transcription.metadata.confidence * 100).toFixed(1)}%
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Paper>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Formatos Soportados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Audio: MP3, WAV, M4A, MPGA
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Video: MP4, MPEG, WEBM
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Plataformas: YouTube, TikTok, Instagram, Facebook, Twitter, Vimeo, LinkedIn
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Límites y Capacidades
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Duración máxima: 2 horas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Tamaño máximo: Sin límite para URLs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Idiomas: Detección automática y selección manual
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SpeechToTextAI; 