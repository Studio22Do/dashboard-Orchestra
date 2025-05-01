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
  Avatar,
  Divider,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import { 
  Search, 
  Verified, 
  Person, 
  PhotoLibrary, 
  PeopleOutline
} from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { selectAuth } from '../../../redux/slices/authSlice';

const ProfileSearch = ({ setError }) => {
  const { token } = useAppSelector(selectAuth);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!username) {
      setError('Por favor ingresa un nombre de usuario');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.get('/api/instagram-realtime/profiles', {
        params: { username },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setProfileData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Error al obtener información del perfil');
      setProfileData(null);
    } finally {
      setLoading(false);
    }
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
                  placeholder="Ej: zara, nike, natgeo"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
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
                  {loading ? <CircularProgress size={24} /> : 'Buscar Perfil'}
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

      {!loading && profileData && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 200 }}>
              <Avatar 
                src={profileData.profile_pic_url} 
                alt={profileData.username || username}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {profileData.username}
                {profileData.is_verified && <Verified color="primary" fontSize="small" />}
              </Typography>
              
              {profileData.full_name && (
                <Typography variant="body2" color="text.secondary">
                  {profileData.full_name}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ flex: 1 }}>
              {profileData.biography && (
                <Typography variant="body1" paragraph>
                  {profileData.biography}
                </Typography>
              )}
              
              <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">
                    {profileData.edge_followed_by?.count?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Seguidores
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">
                    {profileData.edge_follow?.count?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Siguiendo
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">
                    {profileData.edge_owner_to_timeline_media?.count?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Publicaciones
                  </Typography>
                </Box>
              </Stack>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Chip 
                    icon={<Person />} 
                    label={profileData.is_private ? 'Cuenta Privada' : 'Cuenta Pública'} 
                    variant="outlined"
                    color={profileData.is_private ? 'secondary' : 'primary'}
                  />
                </Grid>
                
                {profileData.is_business_account && (
                  <Grid item xs={12} sm={6}>
                    <Chip 
                      icon={<PeopleOutline />} 
                      label="Cuenta de Empresa" 
                      variant="outlined"
                      color="primary"
                    />
                  </Grid>
                )}
                
                {profileData.external_url && (
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Sitio web:</strong> {profileData.external_url}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>
          
          {profileData.edge_owner_to_timeline_media?.edges?.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PhotoLibrary sx={{ mr: 1 }} /> Publicaciones Recientes
              </Typography>
              <Grid container spacing={2}>
                {profileData.edge_owner_to_timeline_media.edges.slice(0, 6).map((edge, index) => (
                  <Grid item xs={6} sm={4} md={2} key={index}>
                    <Box
                      component="img"
                      src={edge.node.thumbnail_src || edge.node.display_url}
                      alt={`Post ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 1,
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ProfileSearch; 