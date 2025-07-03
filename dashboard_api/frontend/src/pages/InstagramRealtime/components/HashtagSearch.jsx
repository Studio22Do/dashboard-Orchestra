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
  Divider,
  CardMedia,
  Paper,
  Chip,
  Stack,
  Avatar,
  CardActions,
  IconButton
} from '@mui/material';
import { 
  Search, 
  Tag, 
  FavoriteBorder, 
  ChatBubbleOutline, 
  PersonOutline,
  ArrowForward
} from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { selectAuth } from '../../../redux/slices/authSlice';

const HashtagSearch = ({ setError }) => {
  const { token } = useAppSelector(selectAuth);
  const [hashtag, setHashtag] = useState('');
  const [loading, setLoading] = useState(false);
  const [hashtagData, setHashtagData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!hashtag) {
      setError('Por favor ingresa un hashtag');
      return;
    }

    // Quitar # si el usuario lo incluyó
    const cleanHashtag = hashtag.startsWith('#') ? hashtag.substring(1) : hashtag;
    
    setLoading(true);
    
    try {
      const response = await axios.get('/api/instagram-realtime/hashtags', {
        params: { hashtag: cleanHashtag },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setHashtagData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching hashtag:', err);
      setError(err.response?.data?.message || 'Error al obtener información del hashtag');
      setHashtagData(null);
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
                  label="Hashtag"
                  placeholder="Ej: fashion, travel, food (sin el símbolo #)"
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

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && hashtagData && (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Tag sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5">#{hashtagData.name || hashtag}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(hashtagData.media_count)} publicaciones
                </Typography>
              </Box>
            </Box>
          </Paper>
          
          {hashtagData.posts && hashtagData.posts.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Tag sx={{ mr: 1 }} /> Posts con este Hashtag
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                {hashtagData.posts.map((post, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height="280"
                        image={post.image_versions2?.candidates?.[0]?.url || 'https://via.placeholder.com/400?text=No+Image'}
                        alt={`Post ${index + 1}`}
                      />
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        {post.caption?.text && (
                          <Typography variant="body2" color="text.secondary" sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}>
                            {post.caption.text}
                          </Typography>
                        )}
                        
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Chip 
                            size="small" 
                            icon={<FavoriteBorder />} 
                            label={formatNumber(post.like_count)} 
                            variant="outlined" 
                          />
                          <Chip 
                            size="small" 
                            icon={<ChatBubbleOutline />} 
                            label={formatNumber(post.comment_count)} 
                            variant="outlined" 
                          />
                        </Stack>
                      </CardContent>
                      
                      {post.user && (
                        <CardActions sx={{ justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src={post.user.profile_pic_url} 
                              sx={{ width: 32, height: 32, mr: 1 }}
                            >
                              <PersonOutline />
                            </Avatar>
                            <Typography variant="body2">
                              {post.user.username}
                            </Typography>
                          </Box>
                        </CardActions>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography variant="h6">No se encontraron publicaciones con este hashtag</Typography>
              <Typography variant="body2" color="text.secondary">
                Intenta con otro hashtag o verifica que esté escrito correctamente.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default HashtagSearch; 