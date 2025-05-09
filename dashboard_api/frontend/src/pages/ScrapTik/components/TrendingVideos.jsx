import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Paper,
  Chip,
  Stack,
  Avatar,
  Divider
} from '@mui/material';
import {
  Favorite,
  Comment,
  Share,
  PlayArrow,
  Person,
  Visibility,
  MusicNote,
  Public
} from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { selectAuth } from '../../../redux/slices/authSlice';

const TrendingVideos = ({ setError }) => {
  const { token } = useAppSelector(selectAuth);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/tiktok/trending-videos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setVideos(response.data?.data || []);
        setError && setError(null);
      } catch (err) {
        setError && setError(err.response?.data?.message || 'Error al obtener videos en tendencia');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
    // eslint-disable-next-line
  }, []);

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Videos en Tendencia
      </Typography>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && videos.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No se encontraron videos en tendencia</Typography>
        </Paper>
      )}
      <Grid container spacing={3}>
        {videos.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height={240}
                image={post.cover || post.ai_dynamic_cover || post.origin_cover || 'https://via.placeholder.com/400x240?text=TikTok+Video'}
                alt={post.title || `TikTok Video ${index + 1}`}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={post.author?.avatar}
                    alt={post.author?.nickname || 'Usuario TikTok'}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="subtitle1" noWrap>
                    {post.author?.nickname || 'Usuario de TikTok'}
                  </Typography>
                  <Chip icon={<Public />} size="small" label={post.region || 'TikTok'} sx={{ ml: 1 }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    height: 60,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {post.title || 'Sin descripción'}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Chip icon={<Favorite />} size="small" label={formatNumber(post.digg_count || 0)} />
                  <Chip icon={<Comment />} size="small" label={formatNumber(post.comment_count || 0)} />
                  <Chip icon={<Share />} size="small" label={formatNumber(post.share_count || 0)} />
                  <Chip icon={<Visibility />} size="small" label={formatNumber(post.play_count || 0)} />
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Chip icon={<MusicNote />} size="small" label={post.music_info?.title || 'Sin música'} />
                  <Chip icon={<Person />} size="small" label={post.music_info?.author || 'Autor desconocido'} />
                  <Chip size="small" label={`Duración: ${post.duration || 0}s`} />
                </Stack>
                <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'right' }}>
                  {formatDate(post.create_time)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<PlayArrow />}
                  href={post.play || '#'}
                  target="_blank"
                  disabled={!post.play}
                >
                  Ver Video
                </Button>
                {post.author?.unique_id && (
                  <Button
                    size="small"
                    startIcon={<Person />}
                    href={`https://www.tiktok.com/@${post.author.unique_id}`}
                    target="_blank"
                  >
                    Ver Perfil
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrendingVideos; 