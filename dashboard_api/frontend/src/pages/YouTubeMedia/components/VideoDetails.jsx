import { useState, useEffect } from 'react';
import { 
  Box, 
  Card,
  CardContent,
  CardMedia,
  Typography, 
  Grid, 
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Stack,
  Button,
  Link,
  Avatar
} from '@mui/material';
import { 
  YouTube, 
  Favorite,
  Comment,
  Share,
  PlayArrow,
  Person,
  CalendarToday,
  ViewArray,
  DownloadForOffline
} from '@mui/icons-material';
import axios from 'axios';

const VideoDetails = ({ video, setError }) => {
  const [loading, setLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!video || !video.id) {
        setError('No se ha seleccionado ningún video');
        return;
      }
      
      setLoading(true);
      console.log('Obteniendo detalles para video:', video.id);
      
      try {
        const response = await axios.get('/api/youtube/video/details', {
          params: {
            videoId: video.id
          }
        });
        
        console.log('Detalles recibidos:', response.data);
        setVideoDetails(response.data);
        setError(null);
      } catch (err) {
        console.error('Error obteniendo detalles del video:', err);
        setError(err.response?.data?.error || 'Error al obtener detalles del video');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideoDetails();
  }, [video, setError]);

  // Función para formatear número de vistas
  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para formatear duración
  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    
    // Extraer horas, minutos y segundos
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = match[1] ? match[1] + ':' : '';
    const minutes = match[2] ? (hours && match[2].length === 1 ? '0' + match[2] : match[2]) + ':' : '00:';
    const seconds = match[3] ? (match[3].length === 1 ? '0' + match[3] : match[3]) : '00';
    
    return hours + minutes + seconds;
  };

  return (
    <Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && videoDetails && (
        <Card>
          <Grid container>
            <Grid item xs={12} md={5}>
              <CardMedia
                component="img"
                sx={{ width: '100%', height: 'auto' }}
                image={videoDetails.thumbnail_url || video.thumbnail || 'https://via.placeholder.com/480x360?text=Video+no+disponible'}
                alt={videoDetails.title || video.title}
              />
            </Grid>
            
            <Grid item xs={12} md={7}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {videoDetails.title || video.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={videoDetails.channel?.thumbnail} 
                    alt={videoDetails.channel?.title || video.channelTitle}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="subtitle1">
                    {videoDetails.channel?.title || video.channelTitle}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Chip 
                    icon={<ViewArray />} 
                    label={`${formatNumber(videoDetails.views)} vistas`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<CalendarToday />} 
                    label={formatDate(videoDetails.published || video.publishedAt)}
                    variant="outlined"
                  />
                  <Chip 
                    icon={<Favorite />} 
                    label={formatNumber(videoDetails.likes) + ' likes'}
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="body1" paragraph>
                  {videoDetails.description || video.description || 'Sin descripción disponible'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    startIcon={<PlayArrow />}
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                  >
                    Ver en YouTube
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<DownloadForOffline />}
                    onClick={() => {
                      // Cambiar a la pestaña de opciones de descarga
                      const tabs = document.querySelectorAll('[role="tab"]');
                      const downloadTab = Array.from(tabs).find(tab => tab.textContent.includes('Opciones de Descarga'));
                      if (downloadTab) downloadTab.click();
                    }}
                  >
                    Opciones de Descarga
                  </Button>
                </Stack>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      )}

      {!loading && !videoDetails && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">
            No se pudieron cargar los detalles del video
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Intenta seleccionar otro video o verifica tu conexión a internet
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default VideoDetails; 