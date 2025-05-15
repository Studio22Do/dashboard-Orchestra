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
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rankData, setRankData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Por favor ingresa una URL para analizar');
      return;
    }
    
    setLoading(true);
    setError(null);
    setRankData(null);
    
    try {
      const response = await fetch('/api/ahrefs-dr/authority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      console.log('Ahrefs DR API response (frontend):', data);
      
      if (!response.ok || data.error) {
        setError(data.error || 'Error al verificar el ranking del dominio');
        setLoading(false);
        return;
      }

      // Mapear la respuesta de la API a nuestro formato de UI
      setRankData({
        domainRating: data.domain_rating || data.domainRating || 0,
        ahrefsRank: data.ahrefs_rank || data.ahrefsRank || 0,
        backlinks: {
          total: data.backlinks?.total || 0,
          dofollow: data.backlinks?.dofollow || 0,
          nofollow: data.backlinks?.nofollow || 0,
          unique: data.backlinks?.unique || 0
        },
        referringDomains: {
          total: data.referring_domains?.total || 0,
          dofollow: data.referring_domains?.dofollow || 0,
          nofollow: data.referring_domains?.nofollow || 0
        },
        organicKeywords: data.organic_keywords || data.organicKeywords || 0,
        organicTraffic: data.organic_traffic || data.organicTraffic || 0,
        topKeywords: data.top_keywords || data.topKeywords || []
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
        Verifica el Domain Rating y métricas de cualquier sitio web
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="URL"
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
                  {loading ? <CircularProgress size={24} /> : 'Analizar URL'}
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
            Analizando URL...
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

            {rankData.topKeywords && rankData.topKeywords.length > 0 && (
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
            )}
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default AhrefsRankChecker; 