import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
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
import { Search, PlaylistPlay, PlayArrow } from '@mui/icons-material';
import axios from 'axios';
import { APP_CONFIG } from '../../../config/constants';

const PlaylistDetails = ({ setError, selectedPlaylist, setSelectedPlaylist, onSelectVideo }) => {
  const [playlistId, setPlaylistId] = useState('');
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `${APP_CONFIG.API_URL}/${API_MODE}`;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!playlistId.trim()) {
      setError('Por favor ingresa un ID o URL de lista de reproducción.');
      return;
    }
    // Validar que no sea una URL de video
    if (playlistId.includes('watch?v=')) {
      setError('Por favor ingresa un ID o URL de lista de reproducción, no de video.');
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
    console.log('ID de playlist enviado al backend:', cleanId);
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/youtube-media/playlist/details`, {
        params: { playlistId: cleanId }
      });
      setPlaylistData(response.data);
      setSelectedPlaylist(response.data);
      setError(null);
    } catch (err) {
      console.error('Error obteniendo detalles de la lista de reproducción:', err);
      if (err.response) {
        console.error('Respuesta de la API:', err.response.data);
      }
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
                src={playlistData.thumbnails?.[playlistData.thumbnails.length-1]?.url || 'https://via.placeholder.com/480x360?text=Playlist+sin+imagen'} 
                alt={playlistData.title}
                sx={{ width: '100%', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {playlistData.title}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar src={playlistData.channel?.avatar?.[0]?.url} alt={playlistData.channel?.name} sx={{ width: 40, height: 40, mr: 1 }} />
                  <Typography variant="subtitle1" color="text.secondary">
                    {playlistData.channel?.name}
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  {playlistData.description || 'Sin descripción disponible'}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  {playlistData.videoCount || '0'} videos • {playlistData.viewCountText || ''}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {playlistData.publishedTimeText}
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
              Videos en esta lista ({playlistData.videos?.items?.length || 0})
            </Typography>
            {playlistData.videos?.items && playlistData.videos.items.length > 0 ? (
              <List>
                {playlistData.videos.items.map((video, index) => (
                  <ListItem key={video.id} divider={index < playlistData.videos.items.length - 1} button onClick={() => onSelectVideo({
                    id: video.id,
                    title: video.title,
                    thumbnail: video.thumbnails?.[video.thumbnails.length-1]?.url,
                    channelTitle: video.channel?.name,
                    description: video.description,
                    publishedAt: video.publishedTimeText
                  })}>
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded" 
                        src={video.thumbnails?.[video.thumbnails.length-1]?.url || 'https://via.placeholder.com/120x90?text=Sin+imagen'} 
                        alt={video.title}
                        sx={{ width: 120, height: 68, mr: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={video.title} 
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">{video.channel?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{video.lengthText}</Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Ver en YouTube">
                        <IconButton edge="end" onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}>
                          <PlayArrow />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">No hay videos en esta lista.</Typography>
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