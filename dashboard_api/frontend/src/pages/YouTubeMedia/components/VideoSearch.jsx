import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  CircularProgress,
  Paper,
  CardMedia,
  CardActions,
  Divider,
} from '@mui/material';
import { 
  Search, 
  YouTube,
  PlayArrow,
  Person
} from '@mui/icons-material';
import axios from 'axios';

const VideoSearch = ({ setError, onSelectVideo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.get('/api/youtube/search/videos', {
        params: { 
          query: searchTerm,
          maxResults: 20
        }
      });
      
      setSearchResults(response.data);
      setError(null);
    } catch (err) {
      console.error('Error buscando videos:', err);
      setError(err.response?.data?.error || 'Error al buscar videos');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear duración del video (PT1H20M30S a 1:20:30)
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

  // Función para formatear vistas (1000 a 1K, 1000000 a 1M)
  const formatViews = (views) => {
    if (!views && views !== 0) return 'N/A';
    
    if (views < 1000) return views.toString();
    if (views < 1000000) return Math.floor(views / 1000) + 'K';
    return Math.floor(views / 1000000) + 'M';
  };

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Buscar videos"
                  placeholder="Ej: música relajante, tutorial javascript, etc."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ height: '56px' }}
                  startIcon={<YouTube />}
                >
                  {loading ? <CircularProgress size={24} /> : 'Buscar Videos'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && searchResults && searchResults.items && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Resultados para "{searchTerm}"
          </Typography>
          <Grid container spacing={3}>
            {searchResults.items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 6
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    const videoId = item.videoId || (item.id && item.id.videoId) || item.id;
                    console.log('Video seleccionado:', { ...item, id: videoId });
                    onSelectVideo({
                      id: videoId,
                      title: item.title,
                      description: item.description,
                      thumbnail: item.thumbnail || item.thumbnails?.[0]?.url || '',
                      channelTitle: item.channel?.name || item.channelTitle,
                      channelId: item.channel?.id || item.channelId,
                      publishedAt: item.publishedTimeText || item.publishedAt,
                      duration: item.duration,
                      views: item.views
                    });
                  }}
                >
                  <CardMedia
                    component="img"
                    height={140}
                    image={item.thumbnails?.[0]?.url || 'https://via.placeholder.com/360x202?text=Sin+Imagen'}
                    alt={item.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.2,
                        height: '2.4em'
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {item.channel?.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        height: '2.4em'
                      }}
                    >
                      {item.description || 'Sin descripción'}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'center' }}>
                    <Button 
                      size="small" 
                      startIcon={<PlayArrow />}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.youtube.com/watch?v=${item.id}`, '_blank');
                      }}
                    >
                      Ver en YouTube
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {!loading && searchResults && (!searchResults.items || searchResults.items.length === 0) && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            No se encontraron resultados para "{searchTerm}"
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta con otros términos de búsqueda
          </Typography>
        </Paper>
      )}

      {!loading && !searchResults && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.default' }}>
          <YouTube sx={{ fontSize: 60, color: 'action.active', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Busca videos en YouTube
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Encuentra videos, descarga contenido y explora listas de reproducción
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default VideoSearch; 