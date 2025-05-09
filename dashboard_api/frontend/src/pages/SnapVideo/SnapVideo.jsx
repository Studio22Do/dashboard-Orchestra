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
  Tooltip
} from '@mui/material';
import { 
  ContentCopy,
  Download,
  AutoAwesome,
  Link,
  VideoLibrary,
  Info,
  Warning
} from '@mui/icons-material';

const SnapVideo = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Por favor ingresa la URL del video de Snapchat');
      return;
    }
    
    if (!url.includes('snapchat.com')) {
      setError('Por favor ingresa una URL válida de Snapchat');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Aquí irá la lógica de la API cuando esté disponible
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVideoInfo({
        title: 'Video de Snapchat',
        duration: '00:15',
        size: '2.5 MB',
        quality: '720p',
        thumbnail: 'https://via.placeholder.com/320x180',
        downloadUrl: '#',
        metadata: {
          author: 'Usuario de Snapchat',
          date: new Date().toLocaleDateString(),
          views: '1.2K',
          likes: '150'
        }
      });
    } catch (err) {
      console.error('Error downloading video:', err);
      setError(err.message || 'Error al descargar el video');
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
      <Typography variant="h4" component="h1" gutterBottom>
        Snap Video
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Descarga videos de Snapchat fácilmente
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL del Video"
                  placeholder="https://www.snapchat.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <Link color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={<AutoAwesome />}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Obtener Video'}
                </Button>
              </Grid>
            </Grid>
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
              <Card>
                <CardContent>
                  <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
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
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {videoInfo.title}
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <VideoLibrary />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Duración" 
                        secondary={videoInfo.duration} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <VideoLibrary />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tamaño" 
                        secondary={videoInfo.size} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <VideoLibrary />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Calidad" 
                        secondary={videoInfo.quality} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Información del Video
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Info />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Autor" 
                        secondary={videoInfo.metadata.author} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Info />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Fecha" 
                        secondary={videoInfo.metadata.date} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Info />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Vistas" 
                        secondary={videoInfo.metadata.views} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Info />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Me gusta" 
                        secondary={videoInfo.metadata.likes} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Descargar Video
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Haz clic en el botón para descargar el video
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={handleDownload}
                    >
                      Descargar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Nota:</strong> Asegúrate de tener permiso para descargar el video y respetar los derechos de autor.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default SnapVideo; 