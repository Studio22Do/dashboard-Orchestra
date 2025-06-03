import { useState } from 'react';
import { Container, Typography, Box, Button, Paper, CircularProgress, Alert, FormControlLabel, Switch, Grid, TextField } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';

// Eliminar las constantes de API que ya no se usarán
const API_URL = 'https://pagepeeker-shortpixel-image-optimiser-v1.p.rapidapi.com/v1/reducer.php';
const API_KEY = '9dc7412cabmsh04d2de9d55522bap1643f6jsn6e3113942f4a';
const API_HOST = 'pagepeeker-shortpixel-image-optimiser-v1.p.rapidapi.com';
const SHORTPIXEL_KEY = 'cwacrDK1bRtJNO1BeLsF';

// --- COMPONENTE DEMO PARA URL ---
const UrlOptimizerDemo = () => {
  const [url, setUrl] = useState('');
  const [lossy, setLossy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      console.log('Iniciando optimización por URL');
      
      const params = {
        key: SHORTPIXEL_KEY,
        lossy: lossy ? '1' : '0',
        wait: '30',
        url: url.trim()
      };
      
      console.log('Parámetros:', params);
      
      const response = await axios.get(API_URL, {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        },
        params: params
      });

      console.log('Respuesta:', response.data);
      setResult(response.data);
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Respuesta de error:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Error al optimizar la imagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <TextField
        label="URL de la imagen"
        variant="outlined"
        fullWidth
        value={url}
        onChange={e => setUrl(e.target.value)}
        sx={{ mb: 2 }}
        placeholder="https://tusitio.com/imagen.jpg"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleOptimize}
        disabled={loading || !url}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Optimizar por URL'}
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {result && (
        <Box mt={2}>
          <Box mb={2}>
            <strong>Original:</strong>
            <img src={url} alt="original" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
          </Box>
          <Box mb={2}>
            <strong>Optimizada:</strong>
            {result.LossyURL ? (
              <>
                <img src={result.LossyURL} alt="optimizada" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
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
              </>
            ) : (
              <Alert severity="warning">No se pudo obtener la imagen optimizada.</Alert>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

const ImageOptimizer = () => {
  const [file, setFile] = useState(null);
  const [lossy, setLossy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleOptimize = async () => {
    if (!file) {
      setError('Por favor selecciona una imagen.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      console.log('Preparando datos para enviar:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', SHORTPIXEL_KEY);
      formData.append('lossy', lossy ? '1' : '0');
      formData.append('wait', '1');
      const response = await axios.post('/api/image-optimize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob' // Importante para manejar la respuesta binaria
      });
      const imageUrl = URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      setResult({ optimized_url: imageUrl });
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Respuesta de error:', err.response?.data);
      setError('Error al optimizar la imagen: ' + (err.response?.data?.message || err.message || 'Intenta de nuevo'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <PhotoCamera sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h5" fontWeight={700}>Image Optimizer</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Optimiza y comprime imágenes JPEG, PNG y GIF para mejorar el rendimiento de tu web. Powered by ShortPixel.
        </Typography>
        <Box mb={2}>
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            fullWidth
          >
            Seleccionar Imagen
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </Box>
        {file && (
          <Box mb={2}>
            <Typography variant="body2">Imagen seleccionada: {file.name}</Typography>
          </Box>
        )}
        <FormControlLabel
          control={<Switch checked={lossy} onChange={() => setLossy(!lossy)} color="primary" />}
          label={lossy ? 'Compresión Lossy (más fuerte)' : 'Compresión Lossless (sin pérdida)'}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleOptimize}
          disabled={loading || !file}
          fullWidth
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Optimizar Imagen'}
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
      {result && (
        <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom>Resultado</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Original</Typography>
              <img src={URL.createObjectURL(file)} alt="original" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
              <Typography variant="caption">{file.name} ({(file.size/1024).toFixed(2)} KB)</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Optimizada</Typography>
              {result.LossyURL ? (
                <>
                  <img src={result.LossyURL} alt="optimizada" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
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
                </>
              ) : (
                <Alert severity="warning">No se pudo obtener la imagen optimizada.</Alert>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* NUEVA SECCIÓN: Optimizar por URL */}
      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Probar con URL de Imagen Pública</Typography>
        <UrlOptimizerDemo />
      </Paper>
    </Container>
  );
};

export default ImageOptimizer; 