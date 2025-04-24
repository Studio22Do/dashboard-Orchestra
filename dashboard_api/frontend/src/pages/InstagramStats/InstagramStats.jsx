import { useState } from 'react';
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

// Datos simulados de respuesta de la API
const mockApiResponse = {
  username: "instagram",
  fullName: "Instagram",
  biography: "Bringing you closer to the people and things you love. ❤️",
  profilePicUrl: "https://scontent-ams2-1.cdninstagram.com/v/t51.2885-19/281440578_1088265838702675_6233856337905829714_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_cat=1&_nc_ohc=cE3fZVYctRoAX9uNAug&edm=APs17CUBAAAA&ccb=7-5&oh=00_AT_lqEftTaROzTT6hyQSvED2jXAYJQEGhGh1NWCzIWiDCA&oe=62BBD6DE&_nc_sid=978cb9",
  followersCount: 505000000,
  followingCount: 76,
  postsCount: 7162,
  profileUrl: "https://instagram.com/instagram",
  isVerified: true,
  isPrivate: false,
  externalUrl: "https://about.instagram.com/",
};

const InstagramStats = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!profileUrl) {
      setError('Por favor ingresa una URL de perfil de Instagram');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Simulando llamada a la API
    setTimeout(() => {
      setProfileData(mockApiResponse);
      setLoading(false);
    }, 1500);
    
    // Aquí irá la llamada real a la API de RapidAPI cuando tengamos el backend
    // const fetchProfileData = async () => {
    //   try {
    //     const response = await fetch('/api/instagram/profile', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ profileUrl }),
    //     });
    //     const data = await response.json();
    //     setProfileData(data);
    //   } catch (error) {
    //     setError('Error al obtener datos del perfil');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchProfileData();
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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
              <Grid xs={12} md={8}>
                <TextField
                  fullWidth
                  label="URL del perfil de Instagram"
                  placeholder="https://instagram.com/username"
                  variant="outlined"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <Instagram color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid xs={12} md={4}>
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

      {!loading && profileData && (
        <Box>
          <Paper elevation={2} sx={{ mb: 4, overflow: 'hidden' }}>
            <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
              <Grid container spacing={3} alignItems="center">
                <Grid>
                  <Avatar
                    src={profileData.profilePicUrl}
                    alt={profileData.username}
                    sx={{ width: 80, height: 80, border: '3px solid white' }}
                  />
                </Grid>
                <Grid xs>
                  <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {profileData.fullName}
                    {profileData.isVerified && <Verified fontSize="small" />}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    @{profileData.username}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" paragraph>
                {profileData.biography}
              </Typography>
              
              {profileData.externalUrl && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Public fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" component="a" href={profileData.externalUrl} target="_blank" rel="noopener noreferrer">
                    {profileData.externalUrl}
                  </Typography>
                </Box>
              )}
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {formatNumber(profileData.postsCount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Publicaciones
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {formatNumber(profileData.followersCount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Seguidores
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {formatNumber(profileData.followingCount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Siguiendo
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Detalles del Perfil
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhotoCamera sx={{ mr: 1 }} /> Engagement Rate
                    </Typography>
                    <Typography variant="h4" color="primary">
                      4.6%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Promedio basado en últimas publicaciones
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarMonth sx={{ mr: 1 }} /> Frecuencia de Publicación
                    </Typography>
                    <Typography variant="h4" color="primary">
                      3.2
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Publicaciones por semana
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          <Alert severity="info">
            Nota: Estos datos son simulados. En la versión final, se obtendrán datos reales de la API de Instagram Statistics.
          </Alert>
        </Box>
      )}
    </Container>
  );
};

export default InstagramStats; 