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
  IconButton
} from '@mui/material';
import { Send, RecordVoiceOver, ArrowBack } from '@mui/icons-material';
import { prlabsService } from '../../services/prlabs';
import { useNavigate } from 'react-router-dom';

const Voice = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_VERSION = 'beta_v2'; // O usa la variable dinámica que manejes en tu app
      const API_BASE_URL = `/api/${API_VERSION}/prlabs`;
      const response = await fetch(`${API_BASE_URL}/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice })
      });
      if (!response.ok) throw new Error('Error al generar el audio');
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
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
        <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
          <RecordVoiceOver sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Texto a Voz
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Texto"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escribe el texto que quieres convertir a voz..."
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || !text}
                  startIcon={loading ? <CircularProgress size={24} /> : <Send />}
                >
                  Generar Audio
                </Button>
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              {audioUrl && (
                <Grid item xs={12}>
                  <audio controls style={{ width: '100%' }} src={audioUrl} />
                  <Button
                    variant="contained"
                    color="secondary"
                    href={audioUrl}
                    download="voz-generada.mp3"
                    sx={{ mt: 2 }}
                  >
                    Descargar Audio
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Voice; 