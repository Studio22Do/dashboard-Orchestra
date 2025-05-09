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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Search,
  TrendingUp,
  People,
  Timer,
  Language,
  Devices,
  LocationOn
} from '@mui/icons-material';

const SimilarWebInsights = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insightsData, setInsightsData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Por favor ingresa una URL para analizar');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Aquí irá la lógica de la API cuando esté disponible
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      setInsightsData({
        totalVisits: '1.2M',
        avgVisitDuration: '3:45',
        pagesPerVisit: 4.2,
        bounceRate: '42%',
        trafficSources: {
          direct: '35%',
          search: '45%',
          social: '12%',
          referral: '8%'
        },
        topCountries: [
          { country: 'Estados Unidos', percentage: '45%' },
          { country: 'Reino Unido', percentage: '15%' },
          { country: 'Alemania', percentage: '10%' }
        ],
        deviceSplit: {
          desktop: '55%',
          mobile: '40%',
          tablet: '5%'
        },
        topReferrers: [
          { site: 'google.com', percentage: '35%' },
          { site: 'facebook.com', percentage: '20%' },
          { site: 'twitter.com', percentage: '15%' }
        ]
      });
    } catch (err) {
      console.error('Error analyzing website:', err);
      setError(err.message || 'Error al analizar el sitio web');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Similar Web Insights
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Analiza el tráfico y las métricas de cualquier sitio web
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="URL del sitio web"
                  placeholder="https://ejemplo.com"
                  variant="outlined"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
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
                  {loading ? <CircularProgress size={24} /> : 'Analizar Tráfico'}
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
            Analizando el sitio web...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && insightsData && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Visitas Totales
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">
                      {insightsData.totalVisits}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Duración Promedio
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Timer sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">
                      {insightsData.avgVisitDuration}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Páginas por Visita
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Language sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">
                      {insightsData.pagesPerVisit}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tasa de Rebote
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <People sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">
                      {insightsData.bounceRate}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribución de Dispositivos
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Devices />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Desktop" 
                        secondary={insightsData.deviceSplit.desktop} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Devices />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Móvil" 
                        secondary={insightsData.deviceSplit.mobile} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Devices />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tablet" 
                        secondary={insightsData.deviceSplit.tablet} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Principales Países
                  </Typography>
                  <List>
                    {insightsData.topCountries.map((country, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <LocationOn />
                        </ListItemIcon>
                        <ListItemText 
                          primary={country.country} 
                          secondary={country.percentage} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Principales Referentes
                  </Typography>
                  <List>
                    {insightsData.topReferrers.map((referrer, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Language />
                        </ListItemIcon>
                        <ListItemText 
                          primary={referrer.site} 
                          secondary={referrer.percentage} 
                        />
                      </ListItem>
                    ))}
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

export default SimilarWebInsights; 