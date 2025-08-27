import { useState } from 'react';
import axiosInstance from '../../config/axios';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  CircularProgress,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import { Public, CheckCircle, Cancel, Star } from '@mui/icons-material';
import { useAppDispatch } from '../../redux/hooks/reduxHooks';
import { setBalance } from '../../redux/slices/creditsSlice';
import webStatusIcon from '../../assets/images/apps/icons/webstatusicon.png';

const WebsiteStatus = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const dispatch = useAppDispatch();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `${API_URL}/${API_MODE}/website-status`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError('Por favor ingresa un dominio para verificar');
      return;
    }
    setLoading(true);
    setError(null);
    setStatusData(null);
    try {
      let domain = url.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
      const response = await axiosInstance.post(`${API_BASE_URL}/check`, { domain });
      const data = response.data;
      
      if (data.error) {
        setError(data.message || data.error || 'Error al verificar el estado del sitio');
        setLoading(false);
        return;
      }
      
      setStatusData(data);
      if (data && data.credits_info && typeof data.credits_info.remaining === 'number') {
        dispatch(setBalance(data.credits_info.remaining));
      }
    } catch (err) {
      console.error('Error checking website status:', err);
      setError(err.response?.data?.error || err.message || 'Error al verificar el estado del sitio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Website Status
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Verifica si un sitio web está UP o DOWN en tiempo real.
        </Typography>
        <Chip
          icon={<img src={webStatusIcon} alt="Website Status" style={{ width: '20px', height: '20px' }} />}
          label="Verificación en tiempo real del estado de sitios web"
          color="primary"
          variant="outlined"
          sx={{ mt: 1, mr: 1 }}
        />
        <Chip
          icon={<Star />}
          label="Costo: 1 punto por verificación"
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Dominio"
                  placeholder="ejemplo.com"
                  variant="outlined"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <Public color="action" sx={{ mr: 1 }} />
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
                  {loading ? <CircularProgress size={24} /> : 'Verificar Estado'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      {loading && (
        <Box sx={{ mb: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Verificando estado del sitio...
          </Typography>
        </Box>
      )}
      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      {!loading && statusData && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resultado
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {statusData.status?.toLowerCase() === 'up' ? (
                    <CheckCircle color="success" sx={{ fontSize: 40 }} />
                  ) : (
                    <Cancel color="error" sx={{ fontSize: 40 }} />
                  )}
                  <Box>
                    <Typography variant="h5" color={statusData.status?.toLowerCase() === 'up' ? 'success.main' : 'error.main'}>
                      {statusData.status?.toUpperCase() || 'Desconocido'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {statusData.message || ''}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {statusData.domain && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" color="text.secondary">
                      Dominio verificado
                    </Typography>
                    <Typography variant="h6">
                      {statusData.domain}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default WebsiteStatus; 