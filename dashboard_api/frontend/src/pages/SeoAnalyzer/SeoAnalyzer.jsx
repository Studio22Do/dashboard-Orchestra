import { useState } from 'react';
import axios from 'axios';
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
  CheckCircle,
  Error,
  Warning,
  Info
} from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
const API_BASE_URL = `${API_URL}/${API_MODE}`;

const SeoAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seoData, setSeoData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Por favor ingresa una URL para analizar');
      setSeoData(null); // Limpia resultado anterior si no hay URL
      return;
    }
    
    setLoading(true);
    setError(null);
    setSeoData(null); // Limpia resultado anterior al iniciar análisis
    
    try {
      const response = await axios.post(`${API_BASE_URL}/seo-analyzer/analyze`, { url });
      setSeoData(response.data);
    } catch (err) {
      console.error('Error analyzing SEO:', err);
      setError(err.response?.data?.error || 'Error al analizar el SEO del sitio');
      setSeoData(null); // Limpia resultado anterior si hay error
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  const renderIssuesList = (issues) => {
    if (!issues || issues.length === 0) {
      return (
        <ListItem>
          <ListItemIcon>
            <CheckCircle color="success" />
          </ListItemIcon>
          <ListItemText primary="No se encontraron problemas" />
        </ListItem>
      );
    }

    return issues.map((issue, index) => (
      <ListItem key={index}>
        <ListItemIcon>
          <Warning color="warning" />
        </ListItemIcon>
        <ListItemText primary={issue} />
      </ListItem>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        SEO Analyzer
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Analiza el SEO de cualquier sitio web y obtén recomendaciones para mejorar
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
                  {loading ? <CircularProgress size={24} /> : 'Analizar SEO'}
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

      {!loading && seoData && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Puntuación SEO
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={seoData.score ?? 0} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          backgroundColor: 'background.paper',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getScoreColor(seoData.score ?? 0)
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="h6" color={getScoreColor(seoData.score ?? 0)}>
                      {seoData.score ?? 0}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Información General
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="URL Analizada" 
                        secondary={seoData.url || 'No disponible'} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tipo de Entrada" 
                        secondary={seoData.input_type || 'No disponible'} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="HTTP Status" 
                        secondary={seoData.http_status ?? 'No disponible'} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="¿Usa HTTPS?" 
                        secondary={seoData.using_https === true ? 'Sí' : seoData.using_https === false ? 'No' : 'No disponible'} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tamaño de Contenido (KB)" 
                        secondary={seoData.content_size?.kb ?? 'No disponible'} 
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
                    Headers HTTP
                  </Typography>
                  <List>
                    {seoData.headers && Object.entries(seoData.headers).length > 0 ? (
                      Object.entries(seoData.headers).map(([key, value]) => (
                        <ListItem key={key}>
                          <ListItemIcon>
                            <Info color="info" />
                          </ListItemIcon>
                          <ListItemText primary={key} secondary={value} />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No hay headers disponibles" />
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

export default SeoAnalyzer; 