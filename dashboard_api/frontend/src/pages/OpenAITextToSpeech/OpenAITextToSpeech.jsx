import { useState } from 'react';
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
  Slider,
  Stack
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  VolumeUp,
  Speed,
  RecordVoiceOver,
  Download,
  ContentCopy
} from '@mui/icons-material';

const OpenAITextToSpeech = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  const voices = [
    { value: 'alloy', label: 'Alloy' },
    { value: 'echo', label: 'Echo' },
    { value: 'fable', label: 'Fable' },
    { value: 'onyx', label: 'Onyx' },
    { value: 'nova', label: 'Nova' },
    { value: 'shimmer', label: 'Shimmer' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Por favor ingresa un texto para convertir a voz');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Aquí irá la lógica de la API cuando esté disponible
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulamos una URL de audio
      const mockAudioUrl = 'https://example.com/audio.mp3';
      setAudioUrl(mockAudioUrl);
      
      // Crear elemento de audio
      const audio = new Audio(mockAudioUrl);
      audio.playbackRate = speed;
      setAudioElement(audio);
      
    } catch (err) {
      console.error('Error generating speech:', err);
      setError(err.message || 'Error al generar el audio');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        audioElement.currentTime = 0;
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue);
    if (audioElement) {
      audioElement.playbackRate = newValue;
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'text-to-speech.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        OpenAI Text to Speech
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Convierte texto a voz natural usando la tecnología de OpenAI
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Texto a convertir"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  multiline
                  rows={4}
                  required
                  placeholder="Ingresa el texto que deseas convertir a voz..."
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Voz</InputLabel>
                  <Select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    label="Voz"
                  >
                    {voices.map((voice) => (
                      <MenuItem key={voice.value} value={voice.value}>
                        {voice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ px: 2 }}>
                  <Typography gutterBottom>
                    Velocidad de reproducción
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Speed />
                    <Slider
                      value={speed}
                      onChange={handleSpeedChange}
                      min={0.5}
                      max={2}
                      step={0.1}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Stack>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={<RecordVoiceOver />}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Convertir a Voz'}
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
            Generando audio...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && audioUrl && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Audio Generado
                    </Typography>
                    <Box>
                      <Tooltip title="Copiar texto">
                        <IconButton onClick={handleCopy}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar audio">
                        <IconButton onClick={handleDownload}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton 
                      onClick={handlePlay}
                      color="primary"
                      size="large"
                    >
                      {isPlaying ? <Stop /> : <PlayArrow />}
                    </IconButton>
                    <VolumeUp color="primary" />
                    <Typography variant="body1">
                      {isPlaying ? 'Reproduciendo...' : 'Audio listo para reproducir'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default OpenAITextToSpeech; 