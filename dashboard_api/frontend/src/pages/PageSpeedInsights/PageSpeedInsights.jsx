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
  Chip
} from '@mui/material';

const categories = [
  { value: '', label: 'Todas' },
  { value: 'performance', label: 'Performance' },
  { value: 'accessibility', label: 'Accesibilidad' },
  { value: 'best-practices', label: 'Mejores Prácticas' },
  { value: 'seo', label: 'SEO' }
];

const strategies = [
  { value: '', label: 'Automático' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' }
];

const PageSpeedInsights = () => {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [strategy, setStrategy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError('Por favor ingresa una URL para analizar');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body = { url };
      if (category) body.category = category;
      if (strategy) body.strategy = strategy;
      const response = await fetch('/api/pagespeed-insights/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Error al consultar PageSpeed Insights');
        setLoading(false);
        return;
      }
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error al consultar PageSpeed Insights');
    } finally {
      setLoading(false);
    }
  };

  // Helper para extraer los puntajes principales
  const getScore = (cat) => {
    try {
      return (
        Math.round(
          (result.lighthouseResult.categories[cat]?.score || 0) * 100
        )
      );
    } catch {
      return 0;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        PageSpeed Insights
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Analiza el rendimiento, SEO y accesibilidad de cualquier sitio web usando datos de Google PageSpeed Insights.
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="URL"
                  placeholder="https://ejemplo.com"
                  variant="outlined"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  error={!!error}
                  helperText={error}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Categoría"
                  SelectProps={{ native: true }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Estrategia"
                  SelectProps={{ native: true }}
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                >
                  {strategies.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ height: '56px', mt: 2 }}
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
      {!loading && result && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resultados principales
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Chip label={`Performance: ${getScore('performance')}`} color="primary" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6} md={3}>
              <Chip label={`SEO: ${getScore('seo')}`} color="success" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6} md={3}>
              <Chip label={`Accesibilidad: ${getScore('accessibility')}`} color="info" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6} md={3}>
              <Chip label={`Best Practices: ${getScore('best-practices')}`} color="secondary" sx={{ width: '100%' }} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              URL Analizada:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {result.lighthouseResult?.finalUrl || url}
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default PageSpeedInsights; 