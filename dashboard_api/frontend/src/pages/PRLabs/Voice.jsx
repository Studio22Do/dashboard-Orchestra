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
  MenuItem
} from '@mui/material';
import { Send, RecordVoiceOver } from '@mui/icons-material';
import { prlabsService } from '../../services/prlabs';

const Voice = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await prlabsService.textToSpeech(text, { voice });
      setAudioUrl(response.audio_url);
    } catch (err) {
      setError(err.message || 'Error al generar el audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        <RecordVoiceOver sx={{ mr: 1, verticalAlign: 'bottom' }} />
        Texto a Voz
      </Typography>

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
                  <audio controls style={{ width: '100%' }}>
                    <source src={audioUrl} type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
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