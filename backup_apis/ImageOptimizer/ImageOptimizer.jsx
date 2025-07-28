import { useState } from 'react';
import { Container, Typography, Box, Button, Paper, CircularProgress, Alert, FormControlLabel, Switch, TextField } from '@mui/material';
import axios from 'axios';

const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
const API_BASE_URL = `/api/${API_MODE}/image-optimize`;

const ImageOptimizer = () => {
  const [url, setUrl] = useState('');
  const [lossy, setLossy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleOptimize = async () => {
    if (!url.trim()) {
      setError('Por favor ingresa la URL de una imagen pública.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post(`${API_BASE_URL}`, {
        url: url.trim(),
        lossy: lossy ? 1 : 0,
        wait: 1
      });
      setResult(response.data);
    } catch (err) {
      setError('Error al optimizar la imagen: ' + (err.response?.data?.error || err.message || 'Intenta de nuevo'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>Image Optimizer</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Optimiza y comprime imágenes JPEG, PNG y GIF para mejorar el rendimiento de tu web. Powered by ShortPixel.
        </Typography>
        <TextField
          label="URL de la imagen"
          variant="outlined"
          fullWidth
          value={url}
          onChange={e => setUrl(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="https://tusitio.com/imagen.jpg"
        />
        <FormControlLabel
          control={<Switch checked={lossy} onChange={() => setLossy(!lossy)} color="primary" />}
          label={lossy ? 'Compresión Lossy (más fuerte)' : 'Compresión Lossless (sin pérdida)'}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleOptimize}
          disabled={loading || !url}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Optimizar por URL'}
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {result && result.LossyURL && (
          <Box mt={3}>
            <Typography variant="subtitle1" mb={1}>Imagen Optimizada:</Typography>
            <img src={result.LossyURL} alt="Optimizada" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
            <Button
              variant="outlined"
              color="primary"
              href={result.LossyURL}
              target="_blank"
              rel="noopener"
              fullWidth
            >
              Descargar Imagen Optimizada
            </Button>
            {result.LossySize && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Tamaño optimizado: {(result.LossySize/1024).toFixed(2)} KB
                {result.OriginalSize && (
                  <span> (Reducción: {((1 - result.LossySize/result.OriginalSize) * 100).toFixed(1)}%)</span>
                )}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ImageOptimizer; 