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
  Avatar,
  Chip,
  Stack,
  Tab,
  Tabs,
  CardMedia,
  CardActions,
  IconButton
} from '@mui/material';
import { 
  Tag, 
  Search, 
  Visibility,
  TrendingUp,
  PlayArrow,
  Favorite,
  Comment,
  Share
} from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { selectAuth } from '../../../redux/slices/authSlice';

const HashtagSearch = ({ setError }) => {
  const { token } = useAppSelector(selectAuth);
  const [hashtag, setHashtag] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [hashtagPosts, setHashtagPosts] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedHashtagId, setSelectedHashtagId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!hashtag) {
      setError('Por favor ingresa un hashtag');
      return;
    }

    // Quitar # si el usuario lo incluyó
    const cleanHashtag = hashtag.startsWith('#') ? hashtag.substring(1) : hashtag;
    
    setLoading(true);
    setHashtagPosts(null);
    
    try {
      const response = await axios.get('/api/tiktok/search-hashtags', {
        params: { keyword: cleanHashtag, count: 20 },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSearchResults(response.data);
      setError(null);
    } catch (err) {
      console.error('Error buscando hashtags:', err);
      setError(err.response?.data?.message || 'Error al buscar hashtags');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewHashtagPosts = async (cid) => {
    if (!cid) return;
    
    setSelectedHashtagId(cid);
    setLoading(true);
    
    try {
      const response = await axios.get('/api/tiktok/hashtag-posts', {
        params: { cid, count: 20 },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setHashtagPosts(response.data);
      setActiveTab(1); // Cambiar a la pestaña de publicaciones
    } catch (err) {
      console.error('Error obteniendo publicaciones del hashtag:', err);
      setError(err.response?.data?.message || 'Error al obtener publicaciones del hashtag');
      setHashtagPosts(null);
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

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Buscar Hashtag"
                  placeholder="Ej: dance, funny, tutorial (sin el símbolo #)"
                  value={hashtag}
                  onChange={(e) => setHashtag(e.target.value)}
                  InputProps={{
                    startAdornment: <Tag sx={{ mr: 1, color: 'action.active' }} />,
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
                  {loading ? <CircularProgress size={24} /> : 'Buscar Hashtag'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {(searchResults || hashtagPosts) && (
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab icon={<Search />} label="Resultados de Búsqueda" iconPosition="start" />
              <Tab 
                icon={<Tag />} 
                label="Publicaciones de Hashtag" 
                iconPosition="start" 
                disabled={!hashtagPosts}
              />
            </Tabs>
          </Paper>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && activeTab === 0 && searchResults && (
        <Box>
          <Grid container spacing={3}>
            {searchResults.hashtag_list && searchResults.hashtag_list.map((hashtag, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Tag fontSize="large" color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h6">
                      #{hashtag.hashtag_name || hashtag.title || hashtag.display_title}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'space-around' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Publicaciones
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(hashtag.video_count || hashtag.post_count || hashtag.challenge_info?.stats?.videoCount || 0)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Vistas
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(hashtag.view_count || hashtag.view_count || hashtag.challenge_info?.stats?.viewCount || 0)}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Box sx={{ flexGrow: 1 }} />
                  
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => handleViewHashtagPosts(hashtag.challenge_id || hashtag.cid)}
                    disabled={!hashtag.challenge_id && !hashtag.cid}
                    startIcon={<Visibility />}
                  >
                    Ver Publicaciones
                  </Button>
                </Paper>
              </Grid>
            ))}

            {(!searchResults.hashtag_list || searchResults.hashtag_list.length === 0) && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6">
                    No se encontraron hashtags para "{hashtag}"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intenta con otro término de búsqueda
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {!loading && activeTab === 1 && hashtagPosts && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Tag sx={{ mr: 1 }} color="primary" />
              Publicaciones con el hashtag
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mostrando resultados de publicaciones más populares
            </Typography>
          </Paper>

          <Grid container spacing={3}>
            {hashtagPosts.aweme_list && hashtagPosts.aweme_list.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height={240}
                    image={post.video?.cover || post.cover_image_url || 'https://via.placeholder.com/400x240?text=TikTok+Video'}
                    alt={post.desc || `TikTok Video ${index + 1}`}
                  />
                  <CardContent>
                    <Typography variant="body2" sx={{ mb: 2, height: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {post.desc || 'Sin descripción'}
                    </Typography>
                    
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                      <Chip icon={<Favorite />} size="small" label={formatNumber(post.statistics?.digg_count || 0)} />
                      <Chip icon={<Comment />} size="small" label={formatNumber(post.statistics?.comment_count || 0)} />
                      <Chip icon={<Share />} size="small" label={formatNumber(post.statistics?.share_count || 0)} />
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<PlayArrow />} 
                      href={post.video?.play_addr?.url_list[0] || post.video_url || '#'} 
                      target="_blank"
                      disabled={!post.video?.play_addr?.url_list[0] && !post.video_url}
                    >
                      Ver Video
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}

            {(!hashtagPosts.aweme_list || hashtagPosts.aweme_list.length === 0) && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6">
                    No se encontraron publicaciones para este hashtag
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Es posible que el hashtag sea demasiado nuevo o no tenga publicaciones disponibles
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {!loading && !searchResults && !hashtagPosts && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.default' }}>
          <Tag sx={{ fontSize: 60, color: 'action.active', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Busca hashtags populares de TikTok
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Descubre tendencias y publicaciones populares relacionadas con cualquier tema
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default HashtagSearch; 