import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  CardMedia,
  Chip,
  ImageList,
  ImageListItem,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import { Instagram, Bookmark, Link as LinkIcon, AccessTime, Person } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/api';

const StoryViewer = () => {
  const [storyUrl, setStoryUrl] = useState('');
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState('story');

  // Función para procesar URLs a través del proxy
  const getProxyUrl = (url) => {
    if (!url) return null;
    return `${API_URL}/instagram/v2/media/proxy?url=${encodeURIComponent(url)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storyUrl) {
      setError('Por favor ingresa la URL de la historia o highlight');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
      
      const isHighlight = storyUrl.includes('highlights');
      setContentType(isHighlight ? 'highlight' : 'story');
      
      const response = await axios.get(
        `${API_URL}/instagram/v2/story/url?url=${encodeURIComponent(storyUrl)}`,
        config
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      if (isHighlight) {
        if (!response.data.id) {
          throw new Error('No se encontraron datos del highlight');
        }
        
        setStoryData({
          username: response.data.user?.username,
          taken_at: response.data.taken_at,
          title: response.data.title,
          media_items: response.data.media_items || [],
          profile_pic_url: response.data.user?.profile_pic_url,
          cover_media: response.data.cover_media,
          total_items: response.data.total_items,
          showing_items: response.data.showing_items
        });
      } else {
        setStoryData(response.data);
      }
    } catch (err) {
      let errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      
      // Manejar error de rate limit
      if (err.response?.status === 429) {
        const retryAfter = err.response.data.retry_after || 60;
        errorMessage = `Límite de peticiones alcanzado. Por favor espera ${retryAfter} segundos antes de intentar nuevamente.`;
      }
      
      setError(errorMessage);
      setStoryData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderMediaContent = (mediaItem) => {
    const isVideo = mediaItem.media_type === 'video' && mediaItem.video_url;
    const mediaUrl = isVideo ? mediaItem.video_url : mediaItem.thumbnail_url;
    
    if (!mediaUrl) {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No se pudo cargar el contenido multimedia. URL no disponible.
        </Alert>
      );
    }

    return (
      <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Tipo: {mediaItem.media_type} | Fecha: {new Date(mediaItem.taken_at).toLocaleString()}
        </Typography>
        
        {isVideo ? (
          <video
            controls
            src={getProxyUrl(mediaUrl)}
            poster={getProxyUrl(mediaItem.thumbnail_url)}
            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '8px' }}
          />
        ) : (
          <Box sx={{ position: 'relative', width: '100%', minHeight: '200px' }}>
            <CardMedia
              component="img"
              image={getProxyUrl(mediaUrl)}
              alt="Contenido de Instagram"
              sx={{ 
                width: '100%', 
                maxHeight: '500px', 
                objectFit: 'contain',
                borderRadius: '8px'
              }}
              onError={(e) => {
                const fallbackUrl = getProxyUrl(mediaItem.thumbnail_url);
                if (e.target.src !== fallbackUrl) {
                  e.target.src = fallbackUrl;
                }
              }}
            />
          </Box>
        )}
        {mediaItem.caption && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {mediaItem.caption}
          </Typography>
        )}
      </Paper>
    );
  };

  const renderContent = () => {
    if (!storyData) return null;

    return (
      <Box sx={{ mt: 3 }}>
        {storyData.cover_media && (
          <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Portada del Highlight
            </Typography>
            <Box sx={{ position: 'relative', width: '150px', height: '150px' }}>
              <CardMedia
                component="img"
                image={getProxyUrl(storyData.cover_media)}
                alt="Portada del highlight"
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                }}
              />
            </Box>
          </Paper>
        )}

        {storyData.total_items && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            Mostrando {storyData.showing_items} de {storyData.total_items} elementos (más recientes primero)
          </Typography>
        )}

        {storyData.media_items?.map((item, index) => (
          <Box key={item.id || index}>
            {renderMediaContent(item)}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Card sx={{ 
      mb: 4,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 3
    }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h6" sx={{ mr: 2, fontWeight: 'bold' }}>
            Ver Historia o Highlight
          </Typography>
          <Chip 
            icon={contentType === 'highlight' ? <Bookmark /> : <Instagram />}
            label={contentType === 'highlight' ? 'Highlight' : 'Historia'}
            color={contentType === 'highlight' ? 'secondary' : 'primary'}
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        </Box>
        
        {/* Form */}
        <Paper 
          component="form" 
          onSubmit={handleSubmit} 
          elevation={0}
          sx={{ 
            mb: 4,
            p: 3,
            bgcolor: 'background.default',
            borderRadius: 2
          }}
        >
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="URL de Instagram"
              placeholder="https://instagram.com/stories/... o https://instagram.com/stories/highlights/..."
              variant="outlined"
              value={storyUrl}
              onChange={(e) => setStoryUrl(e.target.value)}
              error={!!error}
              helperText={error}
              InputProps={{
                startAdornment: (
                  <LinkIcon color="action" sx={{ mr: 1 }} />
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                height: '50px',
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Ver Contenido'}
            </Button>
          </Stack>
        </Paper>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {!loading && error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2
            }}
          >
            {error}
          </Alert>
        )}

        {/* Content Display */}
        {!loading && storyData && (
          <Box>
            {/* Content Info */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3,
                bgcolor: 'background.default',
                borderRadius: 2
              }}
            >
              <Stack spacing={2}>
                {storyData.username && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {storyData.username}
                    </Typography>
                  </Box>
                )}
                
                {contentType === 'highlight' && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Bookmark sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {storyData.title}
                    </Typography>
                  </Box>
                )}

                {storyData.taken_at && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {new Date(storyData.taken_at * 1000).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>

            {renderContent()}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StoryViewer; 