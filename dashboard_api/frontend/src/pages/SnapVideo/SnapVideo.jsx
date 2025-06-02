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
import axios from 'axios';

const SnapVideo = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);

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
      const response = await axios.post('/api/snap-video/download', { url });
      if (response.data && response.data.medias && response.data.medias.length > 0) {
        setVideoInfo({
          title: response.data.title,
          duration: response.data.duration,
          thumbnail: response.data.thumbnail,
          source: response.data.source,
          medias: response.data.medias
        });
      } else {
        setError('No se encontraron enlaces de descarga para esta URL.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al obtener el video');
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
                        <Info />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Fuente" 
                        secondary={videoInfo.source} 
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
                    Enlaces de descarga
                  </Typography>
                  <List>
                    {videoInfo.medias.map((media, idx) => (
                      <ListItem key={idx} alignItems="flex-start">
                        <ListItemIcon>
                          <Download />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${media.quality ? media.quality.toUpperCase() : media.extension.toUpperCase()} (${media.extension})`}
                          secondary={media.url}
                        />
                        <Button
                          variant="outlined"
                          color="primary"
                          href={media.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<Download />}
                        >
                          Descargar
                        </Button>
                      </ListItem>
                    ))}
                  </List>
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