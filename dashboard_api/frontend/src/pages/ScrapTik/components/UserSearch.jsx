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
  Paper,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { 
  Search, 
  Verified, 
  Person, 
  VideoLibrary, 
  Favorite,
  Public
} from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { selectAuth } from '../../../redux/slices/authSlice';

const UserSearch = ({ setError }) => {
  const { token } = useAppSelector(selectAuth);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

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
      const response = await axios.get('/api/tiktok/user-by-username', {
        params: { username: cleanUsername },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUserData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching TikTok user:', err);
      setError(err.response?.data?.message || 'Error al obtener información del usuario de TikTok');
      setUserData(null);
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
                  label="Nombre de usuario"
                  placeholder="Ej: charlidamelio, khaby.lame (sin @)"
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

      {!loading && userData && userData.userInfo && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 200 }}>
              <Avatar 
                src={userData.userInfo.user.avatarLarger || userData.userInfo.user.avatarThumb} 
                alt={userData.userInfo.user.uniqueId || username}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {userData.userInfo.user.uniqueId}
                {/* No hay campo verified en la respuesta, si lo agregan, descomentar: */}
                {/* {userData.userInfo.user.verified && <Verified color="primary" fontSize="small" />} */}
              </Typography>
              {userData.userInfo.user.nickname && (
                <Typography variant="body2" color="text.secondary">
                  {userData.userInfo.user.nickname}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              {/* No hay signature en la respuesta, si lo agregan, descomentar: */}
              {/* {userData.userInfo.user.signature && (
                <Typography variant="body1" paragraph>
                  {userData.userInfo.user.signature}
                </Typography>
              )} */}
              <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">
                    {formatNumber(userData.userInfo.stats.followerCount || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Seguidores
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">
                    {formatNumber(userData.userInfo.stats.followingCount || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Siguiendo
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">
                    {formatNumber(userData.userInfo.stats.videoCount || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Videos
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">
                    {formatNumber(userData.userInfo.stats.heartCount || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Me gusta
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 2 }} />
              {/* Puedes agregar más campos aquí si la API los provee */}
            </Box>
          </Box>
        </Paper>
      )}
      
      {!loading && !userData && username && (
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
          <Typography variant="h6">No se encontró información para este usuario</Typography>
          <Typography variant="body2" color="text.secondary">
            Verifica que el nombre de usuario sea correcto o intenta con otro usuario.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default UserSearch; 