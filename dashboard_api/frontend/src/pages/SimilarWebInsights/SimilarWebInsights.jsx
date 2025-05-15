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
    setInsightsData(null);
    try {
      // Extraer dominio de la URL ingresada
      let domain = url;
      try {
        domain = new URL(url).hostname;
      } catch (e) {
        // Si no es una URL válida, usar el texto tal cual
      }
      const response = await fetch('/api/similarweb/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Error al analizar el sitio web');
        setLoading(false);
        return;
      }
      // Mapear la respuesta real a la estructura de insightsData para la UI
      const visits = data.Traffic?.Visits;
      const totalVisits = visits ? Object.values(visits).slice(-1)[0] : 'N/A';
      const avgVisitDuration = data.Traffic?.Engagement?.TimeOnSite
        ? `${Math.floor(data.Traffic.Engagement.TimeOnSite / 60)}:${String(Math.round(data.Traffic.Engagement.TimeOnSite % 60)).padStart(2, '0')} min`
        : 'N/A';
      const pagesPerVisit = data.Traffic?.Engagement?.PagesPerVisit ?? 'N/A';
      const bounceRate = data.Traffic?.Engagement?.BounceRate
        ? `${Math.round(data.Traffic.Engagement.BounceRate * 100)}%`
        : 'N/A';
      const topCountries = data.Traffic?.TopCountryShares
        ? Object.entries(data.Traffic.TopCountryShares)
            .sort((a, b) => b[1] - a[1])
            .map(([country, share]) => ({
              country,
              percentage: `${Math.round(share * 100)}%`
            }))
        : [];
      const trafficSources = data.Traffic?.Sources ?? {};
      const topKeywords = data.SEOInsights?.TopKeywords ?? [];
      const globalRank = data.Rank?.GlobalRank ?? 'N/A';
      const countryRank = data.Rank?.CountryRank?.Rank ?? 'N/A';
      const countryRankCountry = data.Rank?.CountryRank?.Country ?? '';
      const categoryRank = data.Rank?.CategoryRank?.Rank ?? 'N/A';
      const categoryRankCategory = data.Rank?.CategoryRank?.Category ?? '';
      const title = data.WebsiteDetails?.Title ?? '';
      const description = data.WebsiteDetails?.Description ?? '';
      const category = data.WebsiteDetails?.Category ?? '';
      const images = data.WebsiteDetails?.Images ?? {};
      setInsightsData({
        totalVisits,
        avgVisitDuration,
        pagesPerVisit,
        bounceRate,
        topCountries,
        trafficSources,
        topKeywords,
        globalRank,
        countryRank,
        countryRankCountry,
        categoryRank,
        categoryRankCategory,
        title,
        description,
        category,
        images
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

            {/* Distribución de Dispositivos ahora muestra Fuentes de Tráfico */}
            {insightsData.trafficSources && Object.keys(insightsData.trafficSources).length > 0 && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Fuentes de Tráfico
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Devices />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Directo" 
                          secondary={insightsData.trafficSources.Direct !== undefined ? `${Math.round(insightsData.trafficSources.Direct * 100)}%` : 'N/A'} 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Devices />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Búsqueda" 
                          secondary={insightsData.trafficSources.Search !== undefined ? `${Math.round(insightsData.trafficSources.Search * 100)}%` : 'N/A'} 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Devices />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Social" 
                          secondary={insightsData.trafficSources.Social !== undefined ? `${Math.round(insightsData.trafficSources.Social * 100)}%` : 'N/A'} 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Devices />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Referidos" 
                          secondary={insightsData.trafficSources.Referrals !== undefined ? `${Math.round(insightsData.trafficSources.Referrals * 100)}%` : 'N/A'} 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Devices />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Email" 
                          secondary={insightsData.trafficSources.Mail !== undefined ? `${Math.round(insightsData.trafficSources.Mail * 100)}%` : 'N/A'} 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Devices />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Paid Referrals" 
                          secondary={insightsData.trafficSources['Paid Referrals'] !== undefined ? `${Math.round(insightsData.trafficSources['Paid Referrals'] * 100)}%` : 'N/A'} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Principales Países
                  </Typography>
                  <List>
                    {Array.isArray(insightsData.topCountries) && insightsData.topCountries.map((country, index) => (
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
                    {Array.isArray(insightsData.topReferrers) && insightsData.topReferrers.map((referrer, index) => (
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