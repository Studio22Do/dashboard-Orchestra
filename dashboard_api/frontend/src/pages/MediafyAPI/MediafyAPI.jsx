import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Box,
  Chip,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  Search,
  Person,
  Tag,
  Group,
  LocationOn,
  Star,
  Instagram,
  VideoLibrary,
  PhotoCamera,
  Collections,
  Label
} from '@mui/icons-material';
import axiosInstance from '../../config/axios';

const MediafyAPI = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchInputs, setSearchInputs] = useState({
    username: '',
    search_query: '',
    hashtag: '',
    location_query: ''
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setData(null);
    setError('');
  };

  const handleInputChange = (field, value) => {
    setSearchInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);

    try {
      let endpoint = '';
      let params = {};

      switch (activeTab) {
        case 0: // Profile
          endpoint = '/api/beta_v2/mediafy/profile';
          params = { username: searchInputs.username };
          break;
        case 1: // Search Posts
          endpoint = '/api/beta_v2/mediafy/search_posts';
          params = { search_query: searchInputs.search_query };
          break;
        case 2: // Hashtag
          endpoint = '/api/beta_v2/mediafy/hashtag';
          params = { hashtag: searchInputs.hashtag };
          break;
        case 3: // Search Users
          endpoint = '/api/beta_v2/mediafy/search_users';
          params = { search_query: searchInputs.search_query };
          break;
        case 4: // Location
          endpoint = '/api/beta_v2/mediafy/location';
          params = { location_query: searchInputs.location_query };
          break;
        case 5: // Reels
          endpoint = '/api/beta_v2/mediafy/reels';
          params = { username: searchInputs.username };
          break;
        case 6: // Stories
          endpoint = '/api/beta_v2/mediafy/stories';
          params = { username: searchInputs.username };
          break;
        case 7: // Highlights
          endpoint = '/api/beta_v2/mediafy/highlights';
          params = { username: searchInputs.username };
          break;
        case 8: // Tagged
          endpoint = '/api/beta_v2/mediafy/tagged';
          params = { username: searchInputs.username };
          break;
        default:
          break;
      }

      const response = await axiosInstance.get(endpoint, { params });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const renderSearchForm = () => {
    switch (activeTab) {
      case 0: // Profile
      case 5: // Reels
      case 6: // Stories
      case 7: // Highlights
      case 8: // Tagged
        return (
          <TextField
            fullWidth
            label="Nombre de usuario de Instagram"
            value={searchInputs.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="ej: mrbeast, shakira, cristiano"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        );
      case 1: // Search Posts
        return (
          <TextField
            fullWidth
            label="Buscar posts y reels"
            value={searchInputs.search_query}
            onChange={(e) => handleInputChange('search_query', e.target.value)}
            placeholder="ej: summer, food, travel"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        );
      case 2: // Hashtag
        return (
          <TextField
            fullWidth
            label="Hashtag a analizar"
            value={searchInputs.hashtag}
            onChange={(e) => handleInputChange('hashtag', e.target.value)}
            placeholder="ej: #summer, #love, #food"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        );
      case 3: // Search Users
        return (
          <TextField
            fullWidth
            label="Buscar usuarios"
            value={searchInputs.search_query}
            onChange={(e) => handleInputChange('search_query', e.target.value)}
            placeholder="ej: artistas, fotógrafos, chefs"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        );
      case 4: // Location
        return (
          <TextField
            fullWidth
            label="Buscar ubicaciones"
            value={searchInputs.location_query}
            onChange={(e) => handleInputChange('location_query', e.target.value)}
            placeholder="ej: New York, Paris, Tokyo"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        );
      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!data) return null;

    switch (activeTab) {
      case 0: // Profile
        return renderProfileResults();
      case 1: // Search Posts
        return renderSearchPostsResults();
      case 2: // Hashtag
        return renderHashtagResults();
      case 3: // Search Users
        return renderSearchUsersResults();
      case 4: // Location
        return renderLocationResults();
      case 5: // Reels
        return renderReelsResults();
      case 6: // Stories
        return renderStoriesResults();
      case 7: // Highlights
        return renderHighlightsResults();
      case 8: // Tagged
        return renderTaggedResults();
      default:
        return null;
    }
  };

  const renderProfileResults = () => {
    if (!data.data) return null;
    
    const profileData = data.data;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar 
                src={profileData.profile_pic_url} 
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {profileData.full_name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                @{profileData.username}
              </Typography>
              {profileData.is_verified && (
                <Chip 
                  icon={<Star />} 
                  label="Verificado" 
                  color="primary" 
                  sx={{ mb: 2 }}
                />
              )}
              <Typography variant="body2" color="text.secondary">
                {profileData.biography}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {profileData.follower_count?.toLocaleString() || 'N/A'}
                  </Typography>
                  <Typography variant="body2">Seguidores</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary">
                    {profileData.following_count?.toLocaleString() || 'N/A'}
                  </Typography>
                  <Typography variant="body2">Siguiendo</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {profileData.media_count?.toLocaleString() || 'N/A'}
                  </Typography>
                  <Typography variant="body2">Posts</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {profileData.igtv_video_count?.toLocaleString() || 'N/A'}
                  </Typography>
                  <Typography variant="body2">Videos IGTV</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderSearchPostsResults = () => {
    if (!data.data || !data.data.items) return null;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Posts encontrados: {data.data.count} resultados
          </Typography>
        </Grid>
        {data.data.items.map((post, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={post.user?.profile_pic_url} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {post.user?.full_name || 'Usuario'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{post.user?.username}
                    </Typography>
                  </Box>
                </Box>
                {post.caption && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {post.caption.text}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="primary">
                    ❤️ {post.like_count || 0}
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    💬 {post.comment_count || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderHashtagResults = () => {
    if (!data.data) return null;
    
    const hashtagData = data.data;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                #{hashtagData.name}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {hashtagData.media_count?.toLocaleString() || 'N/A'} posts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hashtagData.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Posts recientes del hashtag
          </Typography>
          <Grid container spacing={2}>
            {hashtagData.recent_media?.map((post, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={post.user?.profile_pic_url} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle2">
                          {post.user?.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {post.caption?.text?.substring(0, 100)}...
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderSearchUsersResults = () => {
    if (!data.data || !data.data.items) return null;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Usuarios encontrados: {data.data.count} resultados
          </Typography>
        </Grid>
        {data.data.items.map((user, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={user.profile_pic_url} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {user.full_name || 'Sin nombre'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{user.username}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {user.is_verified ? 'Verificado' : 'No verificado'}
                    </Typography>
                    <Typography variant="body2">Estado</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="secondary">
                      {user.is_private ? 'Privado' : 'Público'}
                    </Typography>
                    <Typography variant="body2">Tipo</Typography>
                  </Box>
                </Box>
                {user.latest_reel_media > 0 && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Último reel: {new Date(user.latest_reel_media * 1000).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderLocationResults = () => {
    if (!data.data) return null;
    
    const locationData = data.data;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                {locationData.name}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {locationData.media_count?.toLocaleString() || 'N/A'} posts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locationData.address}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Posts recientes de la ubicación
          </Typography>
          <Grid container spacing={2}>
            {locationData.recent_media?.map((post, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={post.user?.profile_pic_url} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle2">
                          {post.user?.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {post.caption?.text?.substring(0, 100)}...
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderReelsResults = () => {
    if (!data.data || !data.data.items) return null;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Reels encontrados: {data.data.count || data.data.items.length} resultados
          </Typography>
        </Grid>
        {data.data.items.map((reel, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={reel.user?.profile_pic_url} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {reel.user?.full_name || 'Usuario'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{reel.user?.username}
                    </Typography>
                  </Box>
                </Box>
                {reel.caption && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {reel.caption.text}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="primary">
                    ❤️ {reel.like_count || 0}
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    💬 {reel.comment_count || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderStoriesResults = () => {
    if (!data.data || !data.data.items) return null;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Stories encontradas: {data.data.count || data.data.items.length} resultados
          </Typography>
        </Grid>
        {data.data.items.map((story, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={story.user?.profile_pic_url} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {story.user?.full_name || 'Usuario'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{story.user?.username}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Duración: {story.duration || 'N/A'}s
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderHighlightsResults = () => {
    if (!data.data || !data.data.items) return null;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Highlights encontrados: {data.data.count || data.data.items.length} resultados
          </Typography>
        </Grid>
        {data.data.items.map((highlight, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {highlight.title || 'Sin título'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {highlight.media_count || 0} elementos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Creado: {highlight.created_at ? new Date(highlight.created_at * 1000).toLocaleDateString() : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderTaggedResults = () => {
    if (!data.data || !data.data.items) return null;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Posts etiquetados encontrados: {data.data.count || data.data.items.length} resultados
          </Typography>
        </Grid>
        {data.data.items.map((post, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={post.user?.profile_pic_url} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {post.user?.full_name || 'Usuario'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{post.user?.username}
                    </Typography>
                  </Box>
                </Box>
                {post.caption && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {post.caption.text}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="primary">
                    ❤️ {post.like_count || 0}
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    💬 {post.comment_count || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Mediafy
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Análisis completo de Instagram: perfiles, posts, hashtags, usuarios, ubicaciones, reels, stories, highlights y más
        </Typography>
        <Chip 
          icon={<Star />} 
          label="Costo: 3 puntos por análisis" 
          color="primary" 
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Tabs de navegación */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Person />} label="Perfil de Usuario" />
          <Tab icon={<Search />} label="Buscar Posts" />
          <Tab icon={<Tag />} label="Análisis de Hashtag" />
          <Tab icon={<Group />} label="Buscar Usuarios" />
          <Tab icon={<LocationOn />} label="Ubicaciones" />
          <Tab icon={<VideoLibrary />} label="Reels" />
          <Tab icon={<PhotoCamera />} label="Stories" />
          <Tab icon={<Collections />} label="Highlights" />
          <Tab icon={<Label />} label="Posts Etiquetados" />
        </Tabs>
      </Paper>

      {/* Formulario de búsqueda */}
      <Paper elevation={3} sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              {renderSearchForm()}
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                sx={{
                  height: '56px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                {loading ? 'Analizando...' : 'Analizar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Resultados */}
      {renderResults()}
    </Container>
  );
};

export default MediafyAPI;

