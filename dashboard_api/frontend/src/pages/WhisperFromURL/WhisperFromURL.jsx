import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setBalance } from '../../redux/slices/creditsSlice';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Link,
  AlertTitle
} from '@mui/material';
import {
  Send,
  ContentCopy,
  Delete,
  AudioFile,
  Settings,
  Lightbulb,
  History,
  Download,
  Language,
  Translate,
  Speed
} from '@mui/icons-material';

const WhisperFromURL = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('auto');
  const [model, setModel] = useState('whisper-1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [history, setHistory] = useState([]);

  const languages = [
    { value: 'auto', label: 'Detectar automáticamente' },
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'Inglés' },
    { value: 'fr', label: 'Francés' },
    { value: 'de', label: 'Alemán' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Portugués' }
  ];

  const models = [
    { value: 'whisper-1', label: 'Whisper 1 (Base)' },
    { value: 'whisper-2', label: 'Whisper 2 (Mejorado)' }
  ];

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Por favor ingresa una URL');
      return;
    }
    if (!validateUrl(url)) {
      setError('Por favor ingresa una URL válida');
      return;
    }
    setLoading(true);
    setError(null);
    setTranscription(null);
    
    try {
      // Usar la ruta correcta del backend para Whisper from URL
      const response = await fetch('/api/beta_v2/speech-to-text/whisper-url', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          audio_url: url,
          language,
          model
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al transcribir el audio');
      }
      
      const data = await response.json();
      
      // Actualizar créditos si la respuesta los incluye
      if (data && data.credits_info && typeof data.credits_info.remaining === 'number') {
        dispatch(setBalance(data.credits_info.remaining));
      }
      
      // Extraer la transcripción del objeto response
      const transcriptionText = data.response?.text || data.message || data.text || data.transcription || 'No se recibió transcripción';
      const hasNoSpeech = data.response?.text ? false : (data.message && !data.text);
      
      const newTranscription = {
        url,
        language,
        model,
        text: transcriptionText,
        metadata: {
          duration: data.response?.duration || data.metadata?.duration,
          words: data.response?.text?.split(' ').length || data.metadata?.words,
          confidence: data.response?.confidence || data.metadata?.confidence,
          segments: data.response?.segments || data.metadata?.segments
        },
        timestamp: new Date().toLocaleString(),
        hasNoSpeech: hasNoSpeech
      };
      setTranscription(newTranscription);
      setHistory(prev => [newTranscription, ...prev]);
      setUrl('');
    } catch (err) {
      setError(err.message || 'Error al transcribir el audio');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    if (transcription) {
      const blob = new Blob([transcription.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transcription.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Whisper: Transcripción desde URL
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Transcribe audio desde URLs directas de archivos de audio usando el modelo Whisper de OpenAI
      </Typography>
      
      {/* Chip de costo */}
      <Box sx={{ mb: 3 }}>
        <Chip 
          label="Costo: 1 punto" 
          color="primary" 
          variant="outlined"
          icon={<Speed />}
        />
      </Box>
      
      {/* Alerta informativa */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Formato de URLs</AlertTitle>
        Solo se aceptan URLs directas de archivos de audio (MP3, WAV, M4A, MPGA, AAC, OGG, FLAC, WMA). 
        Para YouTube y otras plataformas, usa "Speech to Text AI".
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="URL del Archivo de Audio"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      placeholder="https://ejemplo.com/audio.mp3"
                      helperText="Solo URLs directas de archivos de audio (MP3, WAV, M4A, MPGA, AAC, OGG, FLAC, WMA)"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Idioma</InputLabel>
                      <Select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        label="Idioma"
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.value} value={lang.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Language />
                              {lang.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Modelo</InputLabel>
                      <Select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        label="Modelo"
                      >
                        {models.map((model) => (
                          <MenuItem key={model.value} value={model.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Speed />
                              {model.label}
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
                      disabled={loading}
                      startIcon={<AudioFile />}
                      sx={{ height: '56px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Transcribir Audio'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {loading && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Transcribiendo audio...
              </Typography>
            </Box>
          )}

          {!loading && error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {transcription && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {transcription.hasNoSpeech ? 'Resultado del Análisis' : 'Transcripción'}
                </Typography>
                {!transcription.hasNoSpeech && (
                  <Box>
                    <Tooltip title="Descargar transcripción">
                      <IconButton onClick={handleDownload} sx={{ mr: 1 }}>
                        <Download />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copiar transcripción">
                      <IconButton onClick={() => handleCopy(transcription.text)}>
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
              
              {transcription.hasNoSpeech ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    {transcription.text}
                  </Typography>
                </Alert>
              ) : (
                <Typography variant="body1" paragraph>
                  {transcription.text}
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip icon={<Language />} 
                      label={languages.find(l => l.value === transcription.language)?.label} 
                      color="primary" />
                <Chip icon={<Speed />} 
                      label={models.find(m => m.value === transcription.model)?.label} />
                <Chip label={`Duración: ${transcription.metadata.duration}`} />
                <Chip label={`Confianza: ${(transcription.metadata.confidence * 100).toFixed(1)}%`} />
                <Chip label={`Palabras: ${transcription.metadata.words}`} />
                <Chip label={`Segmentos: ${transcription.metadata.segments}`} />
              </Box>
              
              <Link href={transcription.url} target="_blank" rel="noopener">
                Ver archivo original
              </Link>
            </Paper>
          )}

          {history.length > 0 && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Historial de Transcripciones
                </Typography>
                <Tooltip title="Limpiar historial">
                  <IconButton onClick={handleClearHistory}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <List>
                {history.map((item, index) => (
                  <Box key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AudioFile />
                            <Typography variant="subtitle1">
                              Transcripción {index + 1}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            {item.hasNoSpeech ? (
                              <Alert severity="info" sx={{ mb: 1 }}>
                                <Typography variant="body2">
                                  {item.text}
                                </Typography>
                              </Alert>
                            ) : (
                              <Typography variant="body2" paragraph>
                                {item.text}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                              <Chip icon={<Language />} 
                                    label={languages.find(l => l.value === item.language)?.label} 
                                    size="small" />
                              <Chip icon={<Speed />} 
                                    label={models.find(m => m.value === item.model)?.label} 
                                    size="small" />
                              <Chip label={`Duración: ${item.metadata.duration}`} size="small" />
                            </Box>
                            <Link href={item.url} target="_blank" rel="noopener" variant="body2">
                              Ver archivo original
                            </Link>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < history.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
                Configuración
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Idioma Seleccionado"
                    secondary={languages.find(l => l.value === language)?.label}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Modelo"
                    secondary={models.find(m => m.value === model)?.label}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sugerencias
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Formatos soportados"
                    secondary="MP3, WAV, M4A, MPGA, AAC, OGG, FLAC, WMA (solo audio)"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Tamaño máximo"
                    secondary="25MB por archivo"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Duración recomendada"
                    secondary="Máximo 30 minutos por archivo"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WhisperFromURL; 