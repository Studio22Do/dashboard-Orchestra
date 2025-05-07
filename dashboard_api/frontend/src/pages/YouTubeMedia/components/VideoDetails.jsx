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
      
      try {
        const response = await axios.get('/api/youtube/video/details', {
          params: {
            videoId: video.id,
            urlAccess: 'normal',
            videos: 'auto',
            audios: 'auto'
          }
        });
        
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
                image={video.thumbnail || videoDetails.thumbnail_url || 'https://via.placeholder.com/480x360?text=Video+no+disponible'}
                alt={video.title || videoDetails.title}
              />
            </Grid>
            
            <Grid item xs={12} md={7}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {video.title || videoDetails.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={videoDetails.channel?.thumbnail} 
                    alt={video.channelTitle || videoDetails.channel?.title}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="subtitle1">
                    {video.channelTitle || videoDetails.channel?.title}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Chip 
                    icon={<ViewArray />} 
                    label={`${formatNumber(videoDetails.views || 0)} vistas`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<CalendarToday />} 
                    label={formatDate(video.publishedAt || videoDetails.published)}
                    variant="outlined"
                  />
                  <Chip 
                    icon={<Favorite />} 
                    label={formatNumber(videoDetails.likes || 0) + ' likes'}
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="body1" paragraph>
                  {video.description || videoDetails.description || 'Sin descripción disponible'}
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
                      const tab = document.querySelector('[role="tab"][aria-label="Opciones de Descarga"]');
                      if (tab) tab.click();
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