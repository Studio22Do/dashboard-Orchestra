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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  PlaylistPlay, 
  Search,
  PlayArrow,
  VideoLibrary,
  Download
} from '@mui/icons-material';
import axios from 'axios';

const PlaylistDetails = ({ setError, selectedPlaylist, setSelectedPlaylist, onSelectVideo }) => {
  const [playlistId, setPlaylistId] = useState('');
  const [loading, setLoading] = useState(false);
  const [playlistData, setPlaylistData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!playlistId) {
      setError('Por favor ingresa un ID de lista de reproducción');
      return;
    }
    
    // Extraer el ID de la playlist si el usuario ingresa una URL completa
    let cleanId = playlistId;
    if (playlistId.includes('list=')) {
      const match = playlistId.match(/list=([^&]+)/);
      if (match && match[1]) {
        cleanId = match[1];
      }
    }
    
    setLoading(true);
    
    try {
      const response = await axios.get('/api/youtube/playlist/details', {
        params: { playlistId: cleanId }
      });
      
      setPlaylistData(response.data);
      setSelectedPlaylist(response.data);
      setError(null);
    } catch (err) {
      console.error('Error obteniendo detalles de la lista de reproducción:', err);
      setError(err.response?.data?.error || 'Error al obtener detalles de la lista de reproducción');
      setPlaylistData(null);
      setSelectedPlaylist(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear duración
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) {
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
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
                  label="ID o URL de lista de reproducción"
                  placeholder="Ej: PLhQSOxFylseE_9A5-iG4wQB_UD_doswoS o URL completa"
                  value={playlistId}
                  onChange={(e) => setPlaylistId(e.target.value)}
                  InputProps={{
                    startAdornment: <PlaylistPlay sx={{ mr: 1, color: 'action.active' }} />,
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
                  startIcon={<Search />}
                >
                  {loading ? <CircularProgress size={24} /> : 'Buscar Lista'}
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

      {!loading && playlistData && (
        <Card>
          <Grid container>
            <Grid item xs={12} md={4} sx={{ p: 2 }}>
              <Box component="img" 
                src={playlistData.thumbnail?.url || 'https://via.placeholder.com/480x360?text=Playlist+sin+imagen'} 
                alt={playlistData.title}
                sx={{ width: '100%', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {playlistData.title}
                </Typography>
                
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {playlistData.channel?.title}
                </Typography>
                
                <Typography variant="body2" paragraph>
                  {playlistData.description || 'Sin descripción disponible'}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  {playlistData.videoCount || '0'} videos • 
                  {playlistData.viewCount ? ` ${Number(playlistData.viewCount).toLocaleString()} vistas` : ''}
                </Typography>
                
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  href={`https://www.youtube.com/playlist?list=${playlistData.id}`}
                  target="_blank"
                  sx={{ mt: 2 }}
                >
                  Ver en YouTube
                </Button>
              </CardContent>
            </Grid>
          </Grid>
          
          <Divider />
          
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Videos en esta lista ({playlistData.videos?.length || 0})
            </Typography>
            
            {playlistData.videos && playlistData.videos.length > 0 ? (
              <List>
                {playlistData.videos.map((video, index) => (
                  <ListItem key={index} divider={index < playlistData.videos.length - 1} button onClick={() => onSelectVideo({
                    id: video.id,
                    title: video.title,
                    thumbnail: video.thumbnail?.url,
                    channelTitle: video.channel?.title,
                    description: video.description,
                    publishedAt: video.published
                  })}>
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded" 
                        src={video.thumbnail?.url || 'https://via.placeholder.com/120x90?text=Sin+imagen'} 
                        alt={video.title}
                        sx={{ width: 120, height: 68, mr: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={video.title} 
                      secondary={
                        <>
                          {video.channel?.title}
                          {video.duration ? ` • ${formatDuration(video.duration)}` : ''}
                        </>
                      }
                      primaryTypographyProps={{
                        sx: {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical'
                        }
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Ver detalles del video">
                        <IconButton edge="end" onClick={(e) => {
                          e.stopPropagation();
                          onSelectVideo({
                            id: video.id,
                            title: video.title,
                            thumbnail: video.thumbnail?.url,
                            channelTitle: video.channel?.title,
                            description: video.description,
                            publishedAt: video.published
                          });
                        }}>
                          <VideoLibrary />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar video">
                        <IconButton edge="end" sx={{ ml: 1 }} onClick={(e) => {
                          e.stopPropagation();
                          onSelectVideo({
                            id: video.id,
                            title: video.title,
                            thumbnail: video.thumbnail?.url,
                            channelTitle: video.channel?.title,
                            description: video.description,
                            publishedAt: video.published
                          });
                          // Simular clic en la pestaña de descarga
                          setTimeout(() => {
                            const tab = document.querySelector('[role="tab"][aria-label="Opciones de Descarga"]');
                            if (tab) tab.click();
                          }, 100);
                        }}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                No se encontraron videos en esta lista de reproducción
              </Typography>
            )}
          </Box>
        </Card>
      )}

      {!loading && !playlistData && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.default' }}>
          <PlaylistPlay sx={{ fontSize: 60, color: 'action.active', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Explora listas de reproducción
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Ingresa el ID o URL de una lista de reproducción para ver y descargar sus videos
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default PlaylistDetails; 