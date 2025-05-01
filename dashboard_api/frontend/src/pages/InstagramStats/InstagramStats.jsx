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
  Alert
} from '@mui/material';
import { Instagram, Public, Verified, CalendarMonth, PhotoCamera } from '@mui/icons-material';

// Base URL de la API
const API_URL = 'http://localhost:5000/api';

const InstagramStats = () => {
  const [username, setUsername] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [engagementData, setEngagementData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username) {
      setError('Por favor ingresa un nombre de usuario de Instagram');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No estás autenticado. Por favor inicia sesión.');
      }
      
      // Configurar headers con token de autenticación
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Obtener datos del perfil
      const profileResponse = await axios.get(`${API_URL}/instagram/followers?username=${username}`, config);
      
      // Obtener datos de engagement
      const engagementResponse = await axios.get(`${API_URL}/instagram/engagement?username=${username}`, config);
      
      // Combinar datos
      setProfileData(profileResponse.data);
      setEngagementData(engagementResponse.data);
    } catch (err) {
      console.error('Error fetching Instagram data:', err);
      setError(err.response?.data?.error || err.message || 'Error al obtener datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const extractUsername = (url) => {
    // Eliminar @ si está presente
    let username = url.trim();
    if (username.startsWith('@')) {
      username = username.substring(1);
    }
    
    // Si es una URL, extraer el username
    if (username.includes('instagram.com')) {
      const parts = username.split('/');
      return parts[parts.length - 1].replace(/\/$/, '');
    }
    // Si no es URL, asumir que es directamente el username
    return username;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Instagram Statistics
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Obtén estadísticas detalladas de cualquier perfil público de Instagram
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
          <Paper elevation={2} sx={{ mb: 4, overflow: 'hidden' }}>
            <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Avatar
                    alt={profileData.username}
                    sx={{ width: 80, height: 80, border: '3px solid white' }}
                  >
                    {profileData.username?.[0]?.toUpperCase() || 'I'}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {profileData.username}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {formatNumber(profileData.followers_count)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Seguidores
                    </Typography>
                  </Box>
                </Grid>
                {engagementData && (
                  <>
                    <Grid item xs={6} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {formatNumber(engagementData.likes_count)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Likes
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {formatNumber(engagementData.comments_count)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Comentarios
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Paper>
          
          {engagementData && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Detalles del Perfil
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PhotoCamera sx={{ mr: 1 }} /> Engagement Rate
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {engagementData.engagement_rate ? `${engagementData.engagement_rate.toFixed(2)}%` : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Promedio basado en últimas publicaciones
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarMonth sx={{ mr: 1 }} /> Última actualización
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {engagementData.timestamp ? new Date(engagementData.timestamp).toLocaleString() : 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
          
          <Alert severity="info" sx={{ mt: 4 }}>
            Los datos mostrados son obtenidos de Instagram Statistics API. La precisión depende de la disponibilidad de datos públicos del perfil.
          </Alert>
        </Box>
      )}
    </Container>
  );
};

export default InstagramStats; 