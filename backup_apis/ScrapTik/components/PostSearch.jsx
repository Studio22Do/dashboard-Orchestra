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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardMedia,
  CardActions,
  Chip,
  Stack,
  IconButton,
  Avatar
} from '@mui/material';
import { 
  Search, 
  Favorite, 
  Comment, 
  Share, 
  PlayArrow,
  Person,
  Visibility,
  Public,
  Sort,
  MusicNote
} from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { selectAuth } from '../../../redux/slices/authSlice';

const sortOptions = [
  { value: "0", label: "Relevancia" },
  { value: "1", label: "Fecha (reciente)" },
  { value: "2", label: "Más likes" }
];

const PostSearch = ({ setError }) => {
  const { token } = useAppSelector(selectAuth);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username) {
      setError && setError('Por favor ingresa un nombre de usuario');
      return;
    }
    setLoading(true);
    setVideos([]);
    try {
      const response = await axios.get('/api/tiktok/user-videos', {
        params: { username },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVideos(response.data?.data || []);
      setError && setError(null);
    } catch (err) {
      setError && setError(err.response?.data?.message || 'Error al buscar publicaciones');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

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
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Nombre de usuario"
                  placeholder="Ej: charlidamelio, khaby.lame (sin @)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
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
                >
                  {loading ? <CircularProgress size={24} /> : 'Buscar Publicaciones'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && videos.length === 0 && username && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No se encontraron publicaciones para este usuario</Typography>
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

export default PostSearch; 