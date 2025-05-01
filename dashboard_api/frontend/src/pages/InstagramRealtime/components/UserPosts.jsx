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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Search, 
  Person, 
  FavoriteBorder, 
  ChatBubbleOutline, 
  LocationOn,
  CalendarMonth,
  Public,
  VerifiedUser
} from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { selectAuth } from '../../../redux/slices/authSlice';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

const UserPosts = ({ setError }) => {
  const { token } = useAppSelector(selectAuth);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [postsTab, setPostsTab] = useState(0);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!username) {
      setError('Por favor ingresa un nombre de usuario');
      return;
    }
    
    // Eliminar @ si el usuario lo incluyó
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    
    setLoading(true);
    
    try {
      const response = await axios.get('/api/instagram-realtime/user', {
        params: { username: cleanUsername },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUserData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.message || 'Error al obtener información del usuario');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setPostsTab(newValue);
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
                  label="Nombre de usuario"
                  placeholder="Ingresa el nombre de usuario de Instagram (sin @)"
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
                  {loading ? <CircularProgress size={24} /> : 'Buscar Usuario'}
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

      {!loading && userData && (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3} md={2}>
                <Avatar
                  src={userData.profile_pic_url_hd || userData.profile_pic_url}
                  alt={userData.full_name || userData.username}
                  sx={{ width: 120, height: 120, mx: 'auto' }}
                />
              </Grid>
              <Grid item xs={12} sm={9} md={10}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h5" mr={1}>
                    {userData.username}
                  </Typography>
                  {userData.is_verified && (
                    <VerifiedUser sx={{ color: 'primary.main' }} />
                  )}
                </Box>
                
                {userData.full_name && (
                  <Typography variant="h6" gutterBottom>
                    {userData.full_name}
                  </Typography>
                )}
                
                {userData.biography && (
                  <Typography variant="body1" paragraph>
                    {userData.biography}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                  <Box>
                    <Typography variant="h6">{formatNumber(userData.media_count || 0)}</Typography>
                    <Typography variant="body2" color="text.secondary">Publicaciones</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6">{formatNumber(userData.follower_count || 0)}</Typography>
                    <Typography variant="body2" color="text.secondary">Seguidores</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6">{formatNumber(userData.following_count || 0)}</Typography>
                    <Typography variant="body2" color="text.secondary">Siguiendo</Typography>
                  </Box>
                </Box>
                
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                  {userData.external_url && (
                    <Chip 
                      icon={<Public />} 
                      label={userData.external_url}
                      component="a"
                      href={userData.external_url.startsWith('http') ? userData.external_url : `https://${userData.external_url}`}
                      target="_blank"
                      clickable
                    />
                  )}
                  {userData.city_name && (
                    <Chip 
                      icon={<LocationOn />} 
                      label={userData.city_name}
                    />
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
          
          {userData.timeline_posts && userData.timeline_posts.length > 0 && (
            <Box>
              <Paper sx={{ mb: 2 }}>
                <Tabs 
                  value={postsTab} 
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab label="Cuadrícula" />
                  <Tab label="Lista" />
                </Tabs>
              </Paper>
              
              {postsTab === 0 ? (
                <Grid container spacing={2}>
                  {userData.timeline_posts.map((post, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Box
                        sx={{
                          position: 'relative',
                          pb: '100%', // Proporción cuadrada
                          overflow: 'hidden',
                          borderRadius: 1,
                          '&:hover .overlay': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={post.display_url || post.image_url || 'https://via.placeholder.com/400?text=No+Image'}
                          alt={post.caption?.slice(0, 20) || `Post ${index + 1}`}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <Box
                          className="overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                              <FavoriteBorder sx={{ mr: 0.5 }} />
                              <Typography variant="body2">
                                {formatNumber(post.like_count)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                              <ChatBubbleOutline sx={{ mr: 0.5 }} />
                              <Typography variant="body2">
                                {formatNumber(post.comment_count)}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <List>
                  {userData.timeline_posts.map((post, index) => (
                    <Paper key={index} sx={{ mb: 2 }}>
                      <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                        <ListItemAvatar sx={{ mr: 2 }}>
                          <Avatar 
                            variant="rounded"
                            src={post.display_url || post.image_url || 'https://via.placeholder.com/400?text=No+Image'}
                            alt={post.caption?.slice(0, 20) || `Post ${index + 1}`}
                            sx={{ width: 100, height: 100 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CalendarMonth sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {post.taken_at ? 
                                  formatDistance(new Date(post.taken_at * 1000), new Date(), { 
                                    addSuffix: true,
                                    locale: es
                                  }) : 
                                  'Fecha desconocida'
                                }
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              {post.caption && (
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    mb: 2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {post.caption}
                                </Typography>
                              )}
                              
                              <Stack direction="row" spacing={1} mt={1}>
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
                                {post.location && (
                                  <Chip 
                                    size="small" 
                                    icon={<LocationOn />} 
                                    label={post.location.name} 
                                    variant="outlined" 
                                  />
                                )}
                              </Stack>
                            </Box>
                          }
                        />
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              )}
            </Box>
          )}
          
          {userData.timeline_posts && userData.timeline_posts.length === 0 && (
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography variant="h6">No se encontraron publicaciones para este usuario</Typography>
              <Typography variant="body2" color="text.secondary">
                El usuario no tiene publicaciones o ha restringido la visibilidad de su contenido.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UserPosts; 