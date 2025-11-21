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
  ListItemAvatar,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [audioDialogOpen, setAudioDialogOpen] = useState(false);
  const [audioInfo, setAudioInfo] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setData(null);
    setError('');
    setLocations([]);
    setSelectedLocation(null);
    setPage(1);
  };

  const handleInputChange = (field, value) => {
    setSearchInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setPage(1);
    setLoading(true);
    setError('');
    
    try {
      const response = await axiosInstance.get('/api/beta_v2/mediafy/location_info', {
        params: { location_id: location.id }
      });
      
      if (response.data) {
        setData(response.data);
      }
    } catch (err) {
      setError('Error al obtener información de la ubicación: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAudioInfo = async (audioCanonicalId) => {
    if (!audioCanonicalId) return;

    setAudioDialogOpen(true);
    setAudioLoading(true);
    setAudioError('');
    setAudioInfo(null);

    try {
      const response = await axiosInstance.get('/api/beta_v2/mediafy/audio_info', {
        params: { audio_canonical_id: audioCanonicalId }
      });
      const payload = response.data;
      setAudioInfo(payload.data || payload);
    } catch (err) {
      setAudioError(err.response?.data?.error || 'Error al obtener información de audio');
    } finally {
      setAudioLoading(false);
    }
  };

  const handleCloseAudioDialog = () => {
    setAudioDialogOpen(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);
    setPage(1);

    try {
      let endpoint = '';
      let params = {};

      switch (activeTab) {
        case 0: // Profile
          endpoint = '/api/beta_v2/mediafy/profile';
          params = { username: searchInputs.username };
          break;
        case 1: // Hashtag
          endpoint = '/api/beta_v2/mediafy/hashtag';
          params = { hashtag: searchInputs.hashtag };
          break;
        case 2: // Search Users
          endpoint = '/api/beta_v2/mediafy/search_users';
          params = { search_query: searchInputs.search_query };
          break;
        case 3: // Location
          endpoint = '/api/beta_v2/mediafy/location';
          params = { location_query: searchInputs.location_query };
          
          // Para location, primero buscamos las ubicaciones
          try {
            const locationResponse = await axiosInstance.get(endpoint, { params });
            
            if (locationResponse.data && locationResponse.data.data && locationResponse.data.data.items) {
              setLocations(locationResponse.data.data.items);
              setSelectedLocation(null);
              setData(null);
              setLoading(false);
              return; // No continuamos con la búsqueda de posts
            }
          } catch (locationError) {
            setError('Error al buscar ubicaciones: ' + (locationError.response?.data?.error || locationError.message));
            setLoading(false);
            return;
          }
          break;
        case 4: // Reels
          endpoint = '/api/beta_v2/mediafy/reels';
          params = { username: searchInputs.username };
          break;
        case 5: // Stories
          endpoint = '/api/beta_v2/mediafy/stories';
          params = { username: searchInputs.username };
          break;
        case 6: // Highlights
          endpoint = '/api/beta_v2/mediafy/highlights';
          params = { username: searchInputs.username };
          break;
        case 7: // Tagged
          endpoint = '/api/beta_v2/mediafy/tagged';
          params = { username: searchInputs.username };
          break;
        case 8: // Posts
          endpoint = '/api/beta_v2/mediafy/posts';
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
    const innerInput = (() => {
      switch (activeTab) {
        case 0: // Profile
        case 4: // Reels
        case 5: // Stories
        case 6: // Highlights
        case 7: // Tagged
          return (
            <TextField
              fullWidth
              label="Nombre de usuario de Instagram"
              value={searchInputs.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="ej: mrbeast, shakira, cristiano"
              variant="outlined"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.8)', '&.Mui-focused': { color: 'rgba(255, 255, 255, 1)' } },
                '& .MuiInputBase-input': { color: 'white', '&::placeholder': { color: 'rgba(255, 255, 255, 0.65)', opacity: 1 } }
              }}
            />
          );
        case 1: // Hashtag
          return (
            <TextField
              fullWidth
              label="Hashtag a analizar"
              value={searchInputs.hashtag}
              onChange={(e) => handleInputChange('hashtag', e.target.value)}
              placeholder="ej: #summer, #love, #food"
              variant="outlined"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.8)', '&.Mui-focused': { color: 'rgba(255, 255, 255, 1)' } },
                '& .MuiInputBase-input': { color: 'white', '&::placeholder': { color: 'rgba(255, 255, 255, 0.65)', opacity: 1 } }
              }}
            />
          );
        case 2: // Search Users
          return (
            <TextField
              fullWidth
              label="Buscar usuarios"
              value={searchInputs.search_query}
              onChange={(e) => handleInputChange('search_query', e.target.value)}
              placeholder="ej: artistas, fotógrafos, chefs"
              variant="outlined"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.8)', '&.Mui-focused': { color: 'rgba(255, 255, 255, 1)' } },
                '& .MuiInputBase-input': { color: 'white', '&::placeholder': { color: 'rgba(255, 255, 255, 0.65)', opacity: 1 } }
              }}
            />
          );
        case 3: // Location
          return (
            <TextField
              fullWidth
              label="Buscar ubicaciones"
              value={searchInputs.location_query}
              onChange={(e) => handleInputChange('location_query', e.target.value)}
              placeholder="ej: New York, Paris, Tokyo"
              variant="outlined"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.8)', '&.Mui-focused': { color: 'rgba(255, 255, 255, 1)' } },
                '& .MuiInputBase-input': { color: 'white', '&::placeholder': { color: 'rgba(255, 255, 255, 0.65)', opacity: 1 } }
              }}
            />
          );
        default:
          return null;
      }
    })();

    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 0 }}>
              {innerInput}
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' }, minWidth: { xs: '100%', md: '150px' } }}>
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
                  '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
                }}
              >
                {loading ? 'Analizando...' : 'Analizar'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    );
  };

  const renderResults = () => {
    console.log('🔍 [DEBUG] renderResults - data:', !!data, 'activeTab:', activeTab, 'locations:', locations.length);
    
    if (!data && activeTab !== 3) return null;

    switch (activeTab) {
      case 0: // Profile
        return renderProfileResults();
      case 1: // Hashtag
        return renderHashtagResults();
      case 2: // Search Users
        return renderSearchUsersResults();
      case 3: // Location
        return renderLocationResults();
      case 4: // Reels
        return renderReelsResults();
      case 5: // Stories
        return renderStoriesResults();
      case 6: // Highlights
        return renderHighlightsResults();
      case 7: // Tagged
        return renderTaggedResults();
      case 8: // Posts
        return renderPostsResults();
      default:
        return null;
    }
  };

  const renderProfileResults = () => {
    if (!data || !data.data) return null;
    
    const profileData = data.data;
    const profileImageUrl = profileData.profile_pic_url_hd
      || profileData.profile_pic_url
      || profileData.hd_profile_pic_url_info?.url
      || '';
    const isPrivate = profileData.is_private;
    const accountPrivacyLabel = isPrivate ? 'Cuenta privada' : 'Cuenta pública';
    const accountCategory = profileData.category || profileData.account_category || '';
    const externalUrl = profileData.external_url;
    const latestReelDate = profileData.latest_reel_media
      ? new Date(profileData.latest_reel_media * 1000)
      : null;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar 
                src={profileImageUrl} 
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
                  sx={{ mb: 1 }}
                />
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {profileData.biography}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip 
                  label={accountPrivacyLabel} 
                  color={isPrivate ? 'default' : 'success'} 
                  variant="outlined"
                  size="small"
                />
                {accountCategory && (
                  <Chip 
                    label={accountCategory}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                {externalUrl && (
                  <Button
                    component="a"
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="small"
                  >
                    Ver enlace en bio
                  </Button>
                )}
                {latestReelDate && (
                  <Typography variant="caption" color="text.secondary">
                    Último reel: {latestReelDate.toLocaleDateString()}
                  </Typography>
                )}
              </Box>
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
            {profileData.igtv_video_count != null && (
              <Grid item xs={6} md={3}>
                <Card elevation={2}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {profileData.igtv_video_count?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2">Videos IGTV</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderPostsResults = () => {
    if (!data || !data.data || !data.data.items) return null;
    
    const items = data.data.items;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Posts encontrados: {data.data.count || totalItems} resultados
          </Typography>
        </Grid>
        {paginatedItems.map((post, index) => (
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
        {totalPages > 1 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };



  const renderHashtagResults = () => {
    if (!data || !data.data) return null;
    
    const hashtagData = data.data;
    const items = hashtagData.items || [];
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                #{searchInputs.hashtag}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {hashtagData.total?.toLocaleString() || 'N/A'} posts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hashtag analizado exitosamente
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Posts recientes del hashtag
          </Typography>
          <Grid container spacing={2}>
            {paginatedItems.map((post, index) => (
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
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </Grid>
      </Grid>
    );
  };

  const renderSearchUsersResults = () => {
    if (!data || !data.data || !data.data.items) return null;
    
    const items = data.data.items;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Usuarios encontrados: {data.data.count} resultados
          </Typography>
        </Grid>
        {paginatedItems.map((user, index) => (
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
        {totalPages > 1 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderLocationResults = () => {
    console.log('🔍 [DEBUG] renderLocationResults - locations:', locations.length, 'selectedLocation:', !!selectedLocation);
    
    // Si no hay ubicaciones seleccionadas, mostrar la lista de ubicaciones encontradas
    if (locations.length > 0 && !selectedLocation) {
      console.log('🔍 [DEBUG] Mostrando lista de ubicaciones');

      const totalItems = locations.length;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginatedLocations = locations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Ubicaciones encontradas: {locations.length} resultados
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selecciona una ubicación para ver más detalles
            </Typography>
          </Grid>
          {paginatedLocations.map((location, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={2} 
                sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}
                onClick={() => handleLocationSelect(location)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary">
                      {location.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {location.city || location.address || 'Sin dirección'}
                  </Typography>
                  {location.latitude && location.longitude && (
                    <Typography variant="caption" color="text.secondary">
                      📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {totalPages > 1 && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            </Grid>
          )}
        </Grid>
      );
    }

    // Si hay una ubicación seleccionada y datos, mostrar la información detallada
    if (selectedLocation && data && data.data) {
      const locationData = data.data;
      const items = locationData.items || [];
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
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
                  {locationData.location_data?.address_street || locationData.location_data?.city_name || 'Sin dirección'}
                </Typography>
                {locationData.category && (
                  <Chip label={locationData.category} color="primary" sx={{ mt: 1 }} />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Posts recientes de la ubicación
            </Typography>
            <Grid container spacing={2}>
              {paginatedItems.map((post, index) => (
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
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </Grid>
        </Grid>
      );
    }

    return null;
  };

  const renderReelsResults = () => {
    if (!data || !data.data || !data.data.items) return null;
    
    const items = data.data.items;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Reels encontrados: {data.data.count || data.data.items.length} resultados
          </Typography>
        </Grid>
        {paginatedItems.map((reel, index) => {
          const clipsMetadata = reel.clips_metadata || {};
          const originalSound = clipsMetadata.original_sound_info;
          const musicInfo = clipsMetadata.music_info?.music_asset_info;
          const audioCanonicalId = clipsMetadata.audio_canonical_id;

          let audioTitle = '';
          let audioArtist = '';

          if (musicInfo) {
            audioTitle = musicInfo.title || 'Audio';
            audioArtist = musicInfo.display_artist || '';
          } else if (originalSound) {
            audioTitle = originalSound.original_audio_title || 'Audio original';
            audioArtist = originalSound.ig_artist?.username || '';
          }

          return (
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
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {reel.caption.text}
                    </Typography>
                  )}
                  {audioTitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {'🎵 '}{audioTitle}{audioArtist && ` · ${audioArtist}`}
                    </Typography>
                  )}
                  {audioCanonicalId && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenAudioInfo(audioCanonicalId)}
                      >
                        Ver info de audio
                      </Button>
                    </Box>
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
          );
        })}
        {totalPages > 1 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderStoriesResults = () => {
    if (!data || !data.data || !data.data.items) return null;
    
    const items = data.data.items;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Stories encontradas: {data.data.count || data.data.items.length} resultados
          </Typography>
        </Grid>
        {paginatedItems.map((story, index) => (
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
        {totalPages > 1 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderHighlightsResults = () => {
    if (!data || !data.data || !data.data.items) return null;
    
    const items = data.data.items;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Highlights encontrados: {data.data.count || data.data.items.length} resultados
          </Typography>
        </Grid>
        {paginatedItems.map((highlight, index) => (
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
        {totalPages > 1 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderTaggedResults = () => {
    if (!data || !data.data || !data.data.items) return null;
    
    const items = data.data.items;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Posts etiquetados encontrados: {data.data.count || data.data.items.length} resultados
          </Typography>
        </Grid>
        {paginatedItems.map((post, index) => (
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
        {totalPages > 1 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </Grid>
        )}
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
          <Tab icon={<Tag />} label="Análisis de Hashtag" />
          <Tab icon={<Group />} label="Buscar Usuarios" />
          <Tab icon={<LocationOn />} label="Ubicaciones" />
          <Tab icon={<VideoLibrary />} label="Reels" />
          <Tab icon={<PhotoCamera />} label="Stories" />
          <Tab icon={<Collections />} label="Highlights" />
          <Tab icon={<Label />} label="Posts Etiquetados" />
          <Tab icon={<Instagram />} label="Posts" />
        </Tabs>
      </Paper>

      {/* Formulario de búsqueda */}
      {renderSearchForm()}

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Resultados */}
      {renderResults()}

      <Dialog
        open={audioDialogOpen}
        onClose={handleCloseAudioDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Información del audio</DialogTitle>
        <DialogContent dividers>
          {audioLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          {!audioLoading && audioError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {audioError}
            </Alert>
          )}
          {!audioLoading && audioInfo && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {audioInfo.title || 'Audio'}
              </Typography>
              {audioInfo.artist && (
                <Typography variant="body2" color="text.secondary">
                  Artista: @{audioInfo.artist.username}
                </Typography>
              )}
              {typeof audioInfo.duration_in_ms === 'number' && (
                <Typography variant="body2" color="text.secondary">
                  Duración: {(audioInfo.duration_in_ms / 1000).toFixed(1)} s
                </Typography>
              )}
              {typeof audioInfo.total_reels === 'number' && (
                <Typography variant="body2" color="text.secondary">
                  Reels que usan este audio: {audioInfo.total_reels}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAudioDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MediafyAPI;

