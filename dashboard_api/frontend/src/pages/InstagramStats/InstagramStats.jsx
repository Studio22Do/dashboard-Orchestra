import { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  Avatar, 
  Skeleton,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { Instagram, Public, Verified, CalendarMonth, PhotoCamera, Highlight, Collections, Group, GroupAdd, Movie, Image } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import StoryViewer from './components/StoryViewer';

// Base URL de la API
const API_URL = 'http://localhost:5000/api';

const InstagramStats = () => {
  const [username, setUsername] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [highlights, setHighlights] = useState(null);
  const [stories, setStories] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [medias, setMedias] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaDetail, setMediaDetail] = useState(null);
  const [mediaDetailLoading, setMediaDetailLoading] = useState(false);
  const [mediaDetailError, setMediaDetailError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setError('Por favor ingresa un nombre de usuario de Instagram');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
      const response = await axios.get(`${API_URL}/instagram/full-profile?username=${username}`, config);
      setProfileData(response.data.profile);
      setHighlights(response.data.highlights);
      setStories(response.data.stories);
      setFollowers(response.data.followers);
      setFollowing(response.data.following);
      setMedias(response.data.medias);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al obtener datos del perfil');
      setProfileData(null);
      setHighlights(null);
      setStories(null);
      setFollowers(null);
      setFollowing(null);
      setMedias(null);
    } finally {
      setLoading(false);
    }
  };

  const extractUsername = (input) => {
    let username = input.replace('@', '');
    if (username.includes('instagram.com/')) {
      username = username.split('instagram.com/')[1];
    }
    username = username.split('?')[0];
    username = username.replace(/\/$/, '');
    return username;
  };

  // Log para depuración de la estructura de medias
  console.log('Medias:', medias);

  // Función para obtener el detalle de un post por code
  const handleOpenMediaDetail = async (media) => {
    setSelectedMedia(media);
    setMediaDetail(null);
    setMediaDetailError(null);
    setMediaDetailLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/instagram/media/by/code?code=${media.code}`
      );
      setMediaDetail(response.data);
    } catch (err) {
      setMediaDetailError('No se pudo cargar el detalle de la publicación.');
    } finally {
      setMediaDetailLoading(false);
    }
  };

  const handleCloseMediaDetail = () => {
    setSelectedMedia(null);
    setMediaDetail(null);
    setMediaDetailError(null);
    setMediaDetailLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Instagram Statistics
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Analiza perfiles de Instagram y obtén estadísticas detalladas
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Nombre de usuario de Instagram"
                  placeholder="username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(extractUsername(e.target.value))}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <Instagram color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Analizar Perfil'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <StoryViewer />

      {loading && (
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && profileData && (
        <Box>
          {/* Perfil básico */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3} md={2}>
                <Avatar
                  src={profileData.profile_pic_url_hd || profileData.profile_pic_url}
                  alt={profileData.full_name || profileData.username}
                  sx={{ width: 120, height: 120, mx: 'auto' }}
                />
              </Grid>
              <Grid item xs={12} sm={9} md={10}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h5" mr={1}>
                    {profileData.username}
                  </Typography>
                  {profileData.is_verified && (
                    <Verified sx={{ color: 'primary.main' }} />
                  )}
                  {profileData.is_business && (
                    <Chip label="Business" color="info" size="small" sx={{ ml: 1 }} />
                  )}
                </Box>
                {profileData.full_name && (
                  <Typography variant="h6" gutterBottom>
                    {profileData.full_name}
                  </Typography>
                )}
                {profileData.biography && (
                  <Typography variant="body1" paragraph>
                    {profileData.biography}
                  </Typography>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Seguidores
                    </Typography>
                    <Typography variant="h6">
                      {profileData.follower_count?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Siguiendo
                    </Typography>
                    <Typography variant="h6">
                      {profileData.following_count?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Publicaciones
                    </Typography>
                    <Typography variant="h6">
                      {profileData.media_count?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Categoría
                    </Typography>
                    <Typography variant="h6">
                      {profileData.category || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
                {profileData.external_url && (
                  <Box sx={{ mt: 2 }}>
                    <Button href={profileData.external_url} target="_blank" rel="noopener" variant="outlined" color="primary">
                      Enlace Externo
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Highlights */}
          {highlights && highlights.data && highlights.data.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                <Highlight sx={{ mr: 1, verticalAlign: 'middle' }} /> Highlights
              </Typography>
              <Grid container spacing={2}>
                {highlights.data.map((hl, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {hl.title || 'Sin título'}
                        </Typography>
                        {hl.cover_media && (
                          <img src={hl.cover_media} alt={hl.title} style={{ width: '100%', borderRadius: 8 }} />
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {hl.media_count} elementos
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* Stories */}
          {stories && stories.data && stories.data.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                <Collections sx={{ mr: 1, verticalAlign: 'middle' }} /> Stories recientes
              </Typography>
              <Grid container spacing={2}>
                {stories.data.map((story, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card>
                      <CardContent>
                        {story.media_url && (
                          <img src={story.media_url} alt={story.caption || 'Story'} style={{ width: '100%', borderRadius: 8 }} />
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {story.caption || 'Sin descripción'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* Followers y Following */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {followers && followers.data && (
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    <Group sx={{ mr: 1, verticalAlign: 'middle' }} /> Seguidores
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {followers.data.length}
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {followers.data.slice(0, 10).map((f, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar src={f.profile_pic_url} sx={{ width: 32, height: 32, mr: 1 }} />
                        <Typography variant="body2">{f.username}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            )}
            {following && following.data && (
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    <GroupAdd sx={{ mr: 1, verticalAlign: 'middle' }} /> Siguiendo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {following.data.length}
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {following.data.slice(0, 10).map((f, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar src={f.profile_pic_url} sx={{ width: 32, height: 32, mr: 1 }} />
                        <Typography variant="body2">{f.username}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* Medias (posts, reels, videos) */}
          {medias && medias.data && medias.data.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                <Image sx={{ mr: 1, verticalAlign: 'middle' }} /> Últimas publicaciones
              </Typography>
              <Grid container spacing={2}>
                {medias.data.slice(0, 12).map((media, idx) => (
                  <Grid item xs={12} sm={6} md={3} key={idx}>
                    <Card sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <CardContent>
                        {media.media_url && (
                          <img src={media.media_url} alt={media.caption || 'Media'} style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }} />
                        )}
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                          {media.caption?.slice(0, 60) || 'Sin descripción'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">❤️ {media.like_count?.toLocaleString() || 0}</Typography>
                          <Typography variant="caption" color="text.secondary">💬 {media.comment_count?.toLocaleString() || 0}</Typography>
                        </Box>
                      </CardContent>
                      <Box sx={{ p: 1, textAlign: 'center' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenMediaDetail(media)}
                        >
                          Ver detalles
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Box>
      )}

      {/* Modal de detalle de publicación */}
      <Dialog open={!!selectedMedia} onClose={handleCloseMediaDetail} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Detalle de publicación
          <IconButton
            aria-label="close"
            onClick={handleCloseMediaDetail}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {mediaDetailLoading && <CircularProgress />}
          {mediaDetailError && <Alert severity="error">{mediaDetailError}</Alert>}
          {mediaDetail && mediaDetail.items && mediaDetail.items[0] && (
            (() => {
              const item = mediaDetail.items[0];
              const isVideo = item.media_type === 2;
              const imageUrl = item.image_versions2?.candidates?.[0]?.url;
              const videoUrl = item.video_versions?.[0]?.url;
              const caption = item.caption?.text || '';
              const likeCount = item.like_count || 0;
              const commentCount = item.comment_count || 0;
              const playCount = item.ig_play_count || item.play_count || 0;
              const takenAt = item.taken_at ? new Date(item.taken_at * 1000).toLocaleString() : '';
              const user = item.user || {};
              const music = item.clips_metadata?.music_info?.music_asset_info?.title;
              const artist = item.clips_metadata?.music_info?.music_asset_info?.display_artist;
              return (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={user.profile_pic_url} alt={user.username} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1">{user.username}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.full_name}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2, textAlign: 'center' }}>
                    {isVideo ? (
                      <video src={videoUrl} controls style={{ maxWidth: '100%', borderRadius: 8 }} />
                    ) : (
                      <img src={imageUrl} alt={caption} style={{ maxWidth: '100%', borderRadius: 8 }} />
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>{caption}</Typography>
                  <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                    <Tooltip title="Likes"><span>❤️ {likeCount.toLocaleString()}</span></Tooltip>
                    <Tooltip title="Comentarios"><span>💬 {commentCount.toLocaleString()}</span></Tooltip>
                    {isVideo && <Tooltip title="Reproducciones"><span>▶️ {playCount.toLocaleString()}</span></Tooltip>}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Publicado: {takenAt}
                  </Typography>
                  {music && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Música: {music} {artist ? `- ${artist}` : ''}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    href={`https://instagram.com/p/${item.code}/`}
                    target="_blank"
                    rel="noopener"
                    sx={{ mt: 2 }}
                  >
                    Ver en Instagram
                  </Button>
                </Box>
              );
            })()
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default InstagramStats; 