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
  CircularProgress,
  Alert,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import axiosInstance from '../../config/axios';
import { 
  Search,
  Domain,
  Link,
  Speed,
  Security,
  Storage,
  Language,
  Star
} from '@mui/icons-material';
import { useAppDispatch } from '../../redux/hooks/reduxHooks';
import { setBalance } from '../../redux/slices/creditsSlice';
import domainIcon from '../../assets/images/apps/icons/domaincheckericon.png';

const DomainMetrics = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const dispatch = useAppDispatch();

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `/api/${API_MODE}/domain-metrics`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!domain) {
      setError('Por favor ingresa un dominio para analizar');
      return;
    }
    setLoading(true);
    setError(null);
    setMetricsData(null);
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}`, {
        domain
      });
      
      const data = response.data;
      setMetricsData(data);
      console.log('Domain Metrics API response (frontend):', data);
      if (data && data.credits_info && typeof data.credits_info.remaining === 'number') {
        dispatch(setBalance(data.credits_info.remaining));
      }
      if (data.error) {
        setError(data.error || 'Error al analizar el dominio');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError(err.message || 'Error al analizar el dominio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Domain Metrics Check
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Analiza métricas y estadísticas de cualquier dominio
        </Typography>
        <Chip
          icon={<img src={domainIcon} alt="Domain Metrics" style={{ width: '20px', height: '20px' }} />}
          label="Análisis completo de métricas de dominio"
          color="primary"
          variant="outlined"
          sx={{ mt: 1, mr: 1 }}
        />
        <Chip
          icon={<Star />}
          label="Costo: 2 puntos por análisis"
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
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <Search color="action" sx={{ mr: 1 }} />
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
                  {loading ? <CircularProgress size={24} /> : 'Analizar Dominio'}
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
            Analizando dominio...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && metricsData && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Moz & Majestic Authority */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Domain Authority (Moz)</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Domain sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">{metricsData.mozDA ?? '-'}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={Number(metricsData.mozDA) || 0} sx={{ height: 10, borderRadius: 5 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Page Authority (Moz)</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Link sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">{metricsData.mozPA ?? '-'}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={Number(metricsData.mozPA) || 0} sx={{ height: 10, borderRadius: 5 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Trust Flow (Majestic)</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Security sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">{metricsData.majesticTF ?? '-'}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={Number(metricsData.majesticTF) || 0} sx={{ height: 10, borderRadius: 5 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Citation Flow (Majestic)</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Speed sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">{metricsData.majesticCF ?? '-'}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={Number(metricsData.majesticCF) || 0} sx={{ height: 10, borderRadius: 5 }} />
                </CardContent>
              </Card>
            </Grid>

            {/* Moz & Majestic Links */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Moz Links</Typography>
                  <Typography variant="h5">{metricsData.mozLinks ?? '-'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Majestic Backlinks</Typography>
                  <Typography variant="h5">{metricsData.majesticLinks ?? '-'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Referring Domains</Typography>
                  <Typography variant="h5">{metricsData.majesticRefDomains ?? '-'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Ref. EDU / GOV</Typography>
                  <Typography variant="body1">EDU: {metricsData.majesticRefEDU ?? '-'}</Typography>
                  <Typography variant="body1">GOV: {metricsData.majesticRefGov ?? '-'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Social Signals */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Facebook Shares</Typography>
                  <Typography variant="h5">{metricsData.FB_shares ?? '-'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Facebook Comments</Typography>
                  <Typography variant="h5">{metricsData.FB_comments ?? '-'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Pinterest Pins</Typography>
                  <Typography variant="h5">{metricsData.pinterest_pins ?? '-'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Stumbles</Typography>
                  <Typography variant="h5">{metricsData.stumbles ?? '-'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Topical Trust Flow */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Topical Trust Flow</Typography>
                  <List>
                    {metricsData.majesticTTF0Name && (
                      <ListItem>
                        <ListItemText primary={metricsData.majesticTTF0Name} secondary={metricsData.majesticTTF0Value ?? '-'} />
                      </ListItem>
                    )}
                    {metricsData.majesticTTF1Name && (
                      <ListItem>
                        <ListItemText primary={metricsData.majesticTTF1Name} secondary={metricsData.majesticTTF1Value ?? '-'} />
                      </ListItem>
                    )}
                    {metricsData.majesticTTF2Name && (
                      <ListItem>
                        <ListItemText primary={metricsData.majesticTTF2Name} secondary={metricsData.majesticTTF2Value ?? '-'} />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default DomainMetrics; 