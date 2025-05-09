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
  CheckCircle,
  Error,
  Warning,
  Info
} from '@mui/icons-material';

const SeoAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seoData, setSeoData] = useState(null);

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
      setSeoData({
        score: 85,
        title: {
          length: 55,
          hasKeywords: true,
          issues: []
        },
        meta: {
          description: 'Descripción de ejemplo para el sitio web',
          length: 155,
          hasKeywords: true,
          issues: []
        },
        headings: {
          h1: 1,
          h2: 4,
          h3: 8,
          issues: []
        },
        images: {
          total: 12,
          withAlt: 10,
          withoutAlt: 2,
          issues: ['2 imágenes sin texto alternativo']
        },
        links: {
          total: 45,
          internal: 38,
          external: 7,
          broken: 0,
          issues: []
        },
        performance: {
          loadTime: 2.3,
          issues: []
        },
        mobile: {
          responsive: true,
          issues: []
        },
        security: {
          hasSSL: true,
          issues: []
        }
      });
    } catch (err) {
      console.error('Error analyzing SEO:', err);
      setError(err.message || 'Error al analizar el SEO del sitio');
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
                        value={seoData.score} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          backgroundColor: 'background.paper',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getScoreColor(seoData.score)
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="h6" color={getScoreColor(seoData.score)}>
                      {seoData.score}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Título y Meta Descripción
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        {seoData.title.hasKeywords ? 
                          <CheckCircle color="success" /> : 
                          <Error color="error" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="Título" 
                        secondary={`${seoData.title.length} caracteres`} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        {seoData.meta.hasKeywords ? 
                          <CheckCircle color="success" /> : 
                          <Error color="error" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="Meta Descripción" 
                        secondary={`${seoData.meta.length} caracteres`} 
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
                    Estructura de Encabezados
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="H1" 
                        secondary={`${seoData.headings.h1} encontrado(s)`} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="H2" 
                        secondary={`${seoData.headings.h2} encontrado(s)`} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="H3" 
                        secondary={`${seoData.headings.h3} encontrado(s)`} 
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
                    Imágenes
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Total de Imágenes" 
                        secondary={seoData.images.total} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        {seoData.images.withoutAlt === 0 ? 
                          <CheckCircle color="success" /> : 
                          <Warning color="warning" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="Imágenes sin Alt" 
                        secondary={seoData.images.withoutAlt} 
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
                    Enlaces
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Total de Enlaces" 
                        secondary={seoData.links.total} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Enlaces Internos" 
                        secondary={seoData.links.internal} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Enlaces Externos" 
                        secondary={seoData.links.external} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Problemas Detectados
                  </Typography>
                  <List>
                    {renderIssuesList(seoData.images.issues)}
                    {renderIssuesList(seoData.links.issues)}
                    {renderIssuesList(seoData.performance.issues)}
                    {renderIssuesList(seoData.mobile.issues)}
                    {renderIssuesList(seoData.security.issues)}
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