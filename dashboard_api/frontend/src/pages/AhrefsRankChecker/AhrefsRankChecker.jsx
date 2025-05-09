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
import { 
  Search,
  TrendingUp,
  Link,
  Public,
  Language,
  Storage
} from '@mui/icons-material';

const AhrefsRankChecker = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rankData, setRankData] = useState(null);

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
      setRankData({
        domainRating: 65,
        ahrefsRank: 12500,
        backlinks: {
          total: 25000,
          dofollow: 18000,
          nofollow: 7000,
          unique: 15000
        },
        referringDomains: {
          total: 1200,
          dofollow: 800,
          nofollow: 400
        },
        organicKeywords: 8500,
        organicTraffic: 45000,
        topKeywords: [
          { keyword: 'keyword 1', position: 1, volume: '12.5K' },
          { keyword: 'keyword 2', position: 3, volume: '8.2K' },
          { keyword: 'keyword 3', position: 5, volume: '5.1K' }
        ]
      });
    } catch (err) {
      console.error('Error checking domain rank:', err);
      setError(err.message || 'Error al verificar el ranking del dominio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Ahrefs DR & Rank Checker
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Verifica el Domain Rating y ranking de cualquier dominio
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
                  {loading ? <CircularProgress size={24} /> : 'Verificar Ranking'}
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
            Verificando ranking del dominio...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && rankData && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Domain Rating (DR)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">
                      {rankData.domainRating}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={rankData.domainRating} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ahrefs Rank
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Public sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">
                      #{rankData.ahrefsRank.toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`Top ${((rankData.ahrefsRank / 1000000) * 100).toFixed(2)}%`}
                    color="primary"
                    sx={{ mt: 1 }}
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
                        secondary={rankData.backlinks.total.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Dofollow" 
                        secondary={rankData.backlinks.dofollow.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Nofollow" 
                        secondary={rankData.backlinks.nofollow.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Únicos" 
                        secondary={rankData.backlinks.unique.toLocaleString()} 
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
                    Dominios Referentes
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Language />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Total" 
                        secondary={rankData.referringDomains.total.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Language />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Dofollow" 
                        secondary={rankData.referringDomains.dofollow.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Language />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Nofollow" 
                        secondary={rankData.referringDomains.nofollow.toLocaleString()} 
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
                    Tráfico Orgánico
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Storage />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Palabras Clave" 
                        secondary={rankData.organicKeywords.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Storage />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tráfico Mensual" 
                        secondary={rankData.organicTraffic.toLocaleString()} 
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
                    Palabras Clave Principales
                  </Typography>
                  <List>
                    {rankData.topKeywords.map((keyword, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <TrendingUp />
                        </ListItemIcon>
                        <ListItemText 
                          primary={keyword.keyword}
                          secondary={`Posición #${keyword.position} • Volumen: ${keyword.volume}`}
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

export default AhrefsRankChecker; 