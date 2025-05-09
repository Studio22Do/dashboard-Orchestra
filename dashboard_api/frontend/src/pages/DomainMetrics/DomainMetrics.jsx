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
  Divider
} from '@mui/material';
import { 
  Search,
  Domain,
  Link,
  Speed,
  Security,
  Storage,
  Language
} from '@mui/icons-material';

const DomainMetrics = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metricsData, setMetricsData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!domain) {
      setError('Por favor ingresa un dominio para analizar');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Aquí irá la lógica de la API cuando esté disponible
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMetricsData({
        domainAuthority: 45,
        pageAuthority: 38,
        spamScore: 2,
        backlinks: {
          total: 12500,
          dofollow: 9800,
          nofollow: 2700
        },
        performance: {
          loadTime: 1.8,
          score: 85
        },
        security: {
          ssl: true,
          malware: false,
          phishing: false
        },
        server: {
          type: 'Apache',
          location: 'United States',
          ip: '192.168.1.1'
        }
      });
    } catch (err) {
      console.error('Error analyzing domain:', err);
      setError(err.message || 'Error al analizar el dominio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Domain Metrics Check
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Analiza métricas y estadísticas de cualquier dominio
      </Typography>

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
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Domain Authority
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Domain sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">
                      {metricsData.domainAuthority}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={metricsData.domainAuthority} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Page Authority
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Link sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">
                      {metricsData.pageAuthority}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={metricsData.pageAuthority} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Backlinks
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Total" 
                        secondary={metricsData.backlinks.total.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Dofollow" 
                        secondary={metricsData.backlinks.dofollow.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Nofollow" 
                        secondary={metricsData.backlinks.nofollow.toLocaleString()} 
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
                    Rendimiento
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Speed />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tiempo de Carga" 
                        secondary={`${metricsData.performance.loadTime}s`} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Speed />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Puntuación" 
                        secondary={`${metricsData.performance.score}/100`} 
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
                    Seguridad
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Security />
                      </ListItemIcon>
                      <ListItemText 
                        primary="SSL" 
                        secondary={metricsData.security.ssl ? 'Activo' : 'Inactivo'} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Security />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Malware" 
                        secondary={metricsData.security.malware ? 'Detectado' : 'No detectado'} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Security />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Phishing" 
                        secondary={metricsData.security.phishing ? 'Detectado' : 'No detectado'} 
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
                    Información del Servidor
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Storage />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tipo" 
                        secondary={metricsData.server.type} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Language />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Ubicación" 
                        secondary={metricsData.server.location} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Storage />
                      </ListItemIcon>
                      <ListItemText 
                        primary="IP" 
                        secondary={metricsData.server.ip} 
                      />
                    </ListItem>
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