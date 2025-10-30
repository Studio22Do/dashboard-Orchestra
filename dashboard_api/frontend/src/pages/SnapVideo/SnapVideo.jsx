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
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  ContentCopy,
  Download,
  AutoAwesome,
  Link,
  VideoLibrary,
  Info,
  Warning,
  Star
} from '@mui/icons-material';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';
import snapVideoIcon from '../../assets/images/apps/icons/snapvideoicon.png';

const SnapVideo = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `${APP_CONFIG.API_URL}/api/${API_MODE}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Por favor ingresa la URL del video');
      return;
    }
    
    setLoading(true);
    setError(null);
    setVideoInfo(null);
    
    try {
      console.log('Enviando petición a:', `${API_BASE_URL}/media-downloader/download`);
      console.log('URL enviada:', url);
      
      const response = await axios.post(`${API_BASE_URL}/media-downloader/download`, { url });
      
      console.log('Respuesta completa:', response.data);
      
      // Verificar si hay error en la respuesta
      if (response.data && response.data.error) {
        console.error('Error de la API externa:', response.data.error);
        setError(`Error de la API: ${response.data.error}. Intenta con una URL diferente o verifica que la URL sea válida.`);
        return;
      }
      
      // Verificar si hay datos en la respuesta
      if (response.data) {
        // Intentar diferentes estructuras de respuesta
        let videoData = null;
        
        // Estructura 1: medias array
        if (response.data.medias && response.data.medias.length > 0) {
          videoData = {
            title: response.data.title || 'Video de Snapchat',
            duration: response.data.duration || 'N/A',
            thumbnail: response.data.thumbnail || '',
            source: response.data.source || 'Snapchat',
            medias: response.data.medias
          };
        }
        // Estructura 2: links array
        else if (response.data.links && response.data.links.length > 0) {
          videoData = {
            title: response.data.title || 'Video de Snapchat',
            duration: response.data.duration || 'N/A',
            thumbnail: response.data.thumbnail || '',
            source: response.data.source || 'Snapchat',
            medias: response.data.links.map(link => ({
              url: link.url || link,
              quality: link.quality || 'HD',
              extension: link.extension || 'mp4'
            }))
          };
        }
        // Estructura 3: url directa
        else if (response.data.url) {
          videoData = {
            title: response.data.title || 'Video de Snapchat',
            duration: response.data.duration || 'N/A',
            thumbnail: response.data.thumbnail || '',
            source: response.data.source || 'Snapchat',
            medias: [{
              url: response.data.url,
              quality: 'HD',
              extension: 'mp4'
            }]
          };
        }
        // Estructura 4: datos en formato diferente
        else if (typeof response.data === 'object') {
          console.log('Estructura de respuesta no reconocida:', response.data);
          setError(`Respuesta recibida pero formato no reconocido. Revisa la consola para más detalles.`);
          return;
        }
        
        if (videoData) {
          setVideoInfo(videoData);
          console.log('Datos del video procesados:', videoData);
        } else {
          setError('No se encontraron enlaces de descarga para esta URL.');
        }
      } else {
        setError('Respuesta vacía del servidor.');
      }
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Respuesta de error:', err.response?.data);
      setError(err.response?.data?.error || err.message || 'Error al obtener el video');
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setVideoInfo(null);
    
    try {
      console.log('Probando endpoint de test...');
      const response = await axios.post(`${API_BASE_URL}/media-downloader/test`, { url: 'test-url' });
      
      console.log('Respuesta de test:', response.data);
      
      if (response.data && response.data.medias && response.data.medias.length > 0) {
        setVideoInfo({
          title: response.data.title,
          duration: response.data.duration,
          thumbnail: response.data.thumbnail,
          source: response.data.source,
          medias: response.data.medias
        });
        console.log('Test exitoso - Frontend funcionando correctamente');
      } else {
        setError('Test falló - No se recibieron datos de prueba');
      }
    } catch (err) {
      console.error('Error en test:', err);
      setError('Error en el test: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    // Aquí irá la lógica de descarga cuando esté disponible
    alert('Función de descarga en desarrollo');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          SnapVideo
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Descarga videos y audio de YouTube, Instagram, TikTok, Facebook y más plataformas
        </Typography>
        <Chip
          icon={<img src={snapVideoIcon} alt="SnapVideo" style={{ width: '20px', height: '20px' }} />}
          label="Descarga de medios de múltiples plataformas"
          color="primary"
          variant="outlined"
          sx={{ mt: 1, mr: 1 }}
        />
        <Chip
          icon={<Star />}
          label="Costo: 2 puntos por descarga"
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="URL del Video"
                  placeholder="https://www.youtube.com/watch?v=... o https://www.instagram.com/reel/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <Link color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'transparent',
                      '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
                      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
                      '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.2)' }
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flex: { xs: '1 1 100%', md: '0 0 auto' } }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
                  sx={{ height: 56, minWidth: 160, textTransform: 'none', fontWeight: 600 }}
                >
                  {loading ? 'Obteniendo...' : 'Obtener Video'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleTest}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Info />}
                  sx={{ height: 56, minWidth: 160, textTransform: 'none' }}
                >
                  {loading ? 'Probando...' : 'Probar Frontend'}
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ mb: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Obteniendo información del video...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && videoInfo && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    {videoInfo.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <Chip icon={<VideoLibrary />} label={`Duración: ${videoInfo.duration}`} />
                    <Chip icon={<Info />} label={`Fuente: ${videoInfo.source}`} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Enlaces de descarga
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {videoInfo.medias.map((media, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, p: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap>
                            {`${media.quality ? media.quality.toUpperCase() : media.extension.toUpperCase()} (${media.extension})`}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {media.url}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" color="primary" href={media.url} target="_blank" rel="noopener noreferrer" startIcon={<Download />}>
                            Descargar
                          </Button>
                        </Box>
                      </Box>
                    ))}
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

export default SnapVideo; 