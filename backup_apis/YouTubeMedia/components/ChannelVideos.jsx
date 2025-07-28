import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Paper
} from '@mui/material';
import axios from 'axios';
import { APP_CONFIG } from '../../../config/constants';

const VIDEO_TYPES = [
  { label: 'Videos', value: 'videos' },
  { label: 'Shorts', value: 'shorts' },
  { label: 'Lives', value: 'lives' }
];

const ChannelVideos = ({ channelId }) => {
  const [type, setType] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextToken, setNextToken] = useState(null);

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `${APP_CONFIG.API_URL}/${API_MODE}`;

  const fetchVideos = async (reset = false, token = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        channelId,
        type,
        sortBy: 'newest',
      };
      if (token) params.nextToken = token;
      const response = await axios.get(`${API_BASE_URL}/youtube-media/channel/videos`, { params });
      const items = response.data.items || [];
      setVideos(reset ? items : [...videos, ...items]);
      setNextToken(response.data.nextToken || null);
    } catch (err) {
      setError('Error al cargar videos del canal');
    } finally {
      setLoading(false);
    }
  };

  // Cargar videos al cambiar tipo o canal
  React.useEffect(() => {
    if (channelId) fetchVideos(true);
    // eslint-disable-next-line
  }, [channelId, type]);

  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={type}
          onChange={(_, val) => setType(val)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          {VIDEO_TYPES.map(t => (
            <Tab key={t.value} label={t.label} value={t.value} />
          ))}
        </Tabs>
      </Paper>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>
      )}
      <Grid container spacing={3}>
        {videos.map(video => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
            >
              <CardMedia
                component="img"
                height={180}
                image={video.thumbnails?.[video.thumbnails.length - 1]?.url || 'https://via.placeholder.com/360x202?text=Sin+Imagen'}
                alt={video.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" gutterBottom noWrap>{video.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {video.lengthText} • {video.viewCountText} • {video.publishedTimeText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {nextToken && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="contained" onClick={() => fetchVideos(false, nextToken)} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Cargar más'}
          </Button>
        </Box>
      )}
      {!loading && videos.length === 0 && !error && (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          No se encontraron videos para este canal.
        </Typography>
      )}
    </Box>
  );
};

export default ChannelVideos; 