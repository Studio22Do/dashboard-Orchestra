import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import { Send, RecordVoiceOver, ArrowBack } from '@mui/icons-material';
import { prlabsService } from '../../services/prlabs';
import { useNavigate } from 'react-router-dom';
import { PR_LABS_CONFIG } from '../../config/prlabs';
import { useDispatch } from 'react-redux';
import { setBalance, fetchCreditsBalance } from '../../redux/slices/creditsSlice';

const Voice = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectContainerSx = {
    '& .MuiOutlinedInput-root': {
      height: 56,
      borderRadius: 2,
      '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
      '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.2)' }
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 0,
      paddingBottom: 0
    }
  };

  const textareaSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      alignItems: 'flex-start',
      '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
      '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.2)' }
    },
    '& .MuiInputBase-input': {
      padding: '16px',
      lineHeight: 1.5
    }
  };

  const actionButtonSx = {
    height: 56,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600
  };

  const secondaryButtonSx = {
    height: 48,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_VERSION = 'beta_v2';
      // Usar la variable de entorno para la URL base de la API
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/${API_VERSION}/prlabs/voice`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text, voice })
      });

      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.credits_info && typeof data.credits_info.remaining === 'number') {
          dispatch(setBalance(data.credits_info.remaining));
        }
        // Si la API devuelve JSON en vez de audio, no hay audio que reproducir
      } else {
        if (!response.ok) throw new Error('Error al generar el audio');
        const audioBlob = await response.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        // Como no pudimos leer credits_info (binario), refrescamos el balance desde backend
        dispatch(fetchCreditsBalance());
      }
    } catch (err) {
      setError(err.message || 'Error al generar el audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/prlabs')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" gutterBottom sx={{ color: 'white', flex: 1 }}>
          <RecordVoiceOver sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Texto a Voz
        </Typography>
        <Tooltip title="Costo por conversión exitosa (TTS/STT)">
          <Chip color="secondary" label={`Puntos: ${PR_LABS_CONFIG.COSTS.VOICE}`} />
        </Tooltip>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl
                  fullWidth
                  sx={{
                    flex: { xs: '1 1 100%', md: '0 0 220px' },
                    ...selectContainerSx
                  }}
                >
                  <InputLabel>Voz</InputLabel>
                  <Select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    label="Voz"
                  >
                    <MenuItem value="alloy">Alloy</MenuItem>
                    <MenuItem value="echo">Echo</MenuItem>
                    <MenuItem value="fable">Fable</MenuItem>
                    <MenuItem value="onyx">Onyx</MenuItem>
                    <MenuItem value="nova">Nova</MenuItem>
                    <MenuItem value="shimmer">Shimmer</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Texto"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escribe el texto que quieres convertir a voz..."
                  sx={{ flex: '1 1 0', minWidth: 260, ...textareaSx }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !text.trim()}
                  startIcon={loading ? <CircularProgress size={24} /> : <Send />}
                  sx={{ ...actionButtonSx, minWidth: { xs: '100%', md: 200 } }}
                  fullWidth
                >
                  {loading ? 'Generando...' : 'Generar audio'}
                </Button>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}

              {audioUrl && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <audio controls style={{ width: '100%' }} src={audioUrl} />
                  <Button
                    variant="contained"
                    color="secondary"
                    href={audioUrl}
                    download="voz-generada.mp3"
                    sx={secondaryButtonSx}
                  >
                    Descargar audio
                  </Button>
                </Box>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Voice; 