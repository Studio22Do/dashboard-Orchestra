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
  Sort
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
  const [keyword, setKeyword] = useState('');
  const [sortType, setSortType] = useState("0");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!keyword) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.get('/api/tiktok/search-posts', {
        params: { 
          keyword,
          count: 30,
          offset: 0,
          use_filters: 0,
          publish_time: 0,
          sort_type: sortType
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSearchResults(response.data);
      setError(null);
    } catch (err) {
      console.error('Error buscando publicaciones:', err);
      setError(err.response?.data?.message || 'Error al buscar publicaciones');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para formatear números grandes
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  // Función para formatear fecha
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
              <Grid item xs={12} md={7}>
                <TextField
                  fullWidth
                  label="Buscar Publicaciones"
                  placeholder="Ej: dance tutorial, cooking tips, etc."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel id="sort-type-label">Ordenar por</InputLabel>
                  <Select
                    labelId="sort-type-label"
                    id="sort-type"
                    value={sortType}
                    label="Ordenar por"
                    onChange={(e) => setSortType(e.target.value)}
                    startAdornment={<Sort sx={{ mr: 0.5, color: 'action.active' }} />}
                  >
                    {sortOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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

      {!loading && searchResults && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Visibility sx={{ mr: 1 }} color="primary" />
              Resultados para "{keyword}"
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchResults.aweme_list?.length > 0 
                ? `Mostrando ${searchResults.aweme_list.length} publicaciones` 
                : 'No se encontraron publicaciones'}
            </Typography>
          </Paper>

          <Grid container spacing={3}>
            {searchResults.aweme_list && searchResults.aweme_list.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height={240}
                    image={post.video?.cover || post.cover_image_url || 'https://via.placeholder.com/400x240?text=TikTok+Video'}
                    alt={post.desc || `TikTok Video ${index + 1}`}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={post.author?.avatar_thumb?.url_list?.[0] || post.author?.avatar_url} 
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
                      {post.desc || 'Sin descripción'}
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                      <Chip icon={<Favorite />} size="small" label={formatNumber(post.statistics?.digg_count || 0)} />
                      <Chip icon={<Comment />} size="small" label={formatNumber(post.statistics?.comment_count || 0)} />
                      <Chip icon={<Share />} size="small" label={formatNumber(post.statistics?.share_count || 0)} />
                    </Stack>
                    
                    <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'right' }}>
                      {formatDate(post.create_time)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<PlayArrow />} 
                      href={post.video?.play_addr?.url_list?.[0] || post.video_url || '#'} 
                      target="_blank"
                      disabled={!post.video?.play_addr?.url_list?.[0] && !post.video_url}
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

            {(!searchResults.aweme_list || searchResults.aweme_list.length === 0) && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6">
                    No se encontraron publicaciones para "{keyword}"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intenta con otros términos de búsqueda o ajusta los filtros
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {!loading && !searchResults && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.default' }}>
          <Search sx={{ fontSize: 60, color: 'action.active', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Busca publicaciones populares de TikTok
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Encuentra videos populares sobre cualquier tema de tu interés
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default PostSearch; 