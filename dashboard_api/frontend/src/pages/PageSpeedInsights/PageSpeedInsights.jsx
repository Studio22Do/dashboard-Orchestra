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
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Speed, Accessibility, Code, Search } from '@mui/icons-material';

const categories = [
  { value: '', label: 'Todas', icon: Speed, color: 'default' },
  { value: 'PERFORMANCE', label: 'Performance', icon: Speed, color: 'primary' },
  { value: 'ACCESSIBILITY', label: 'Accesibilidad', icon: Accessibility, color: 'info' },
  { value: 'BEST_PRACTICES', label: 'Mejores Prácticas', icon: Code, color: 'secondary' },
  { value: 'SEO', label: 'SEO', icon: Search, color: 'success' }
];

const strategies = [
  { value: '', label: 'Automático' },
  { value: 'DESKTOP', label: 'Desktop' },
  { value: 'MOBILE', label: 'Mobile' }
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
      const params = new URLSearchParams({
        url: url
      });
      
      if (category) params.append('category', category);
      if (strategy) params.append('strategy', strategy);

      const response = await fetch(`/api/pagespeed-insights/run?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || data.details || 'Error al consultar PageSpeed Insights');
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
      return Math.round((result.lighthouseResult.categories[cat.toLowerCase()]?.score || 0) * 100);
    } catch {
      return 0;
    }
  };

  // Helper para obtener el color basado en el puntaje
  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  // Helpers adicionales para mostrar detalles
  const getJavaScriptDetails = () => {
    try {
      return result.lighthouseResult.audits['bootup-time'].details.items || [];
    } catch {
      return [];
    }
  };

  const getOptimizationSuggestions = () => {
    try {
      const suggestions = [];
      const audits = result.lighthouseResult.audits;
      
      if (audits['uses-rel-preconnect']) {
        suggestions.push({
          title: audits['uses-rel-preconnect'].title,
          description: audits['uses-rel-preconnect'].description
        });
      }
      
      return suggestions;
    } catch {
      return [];
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        PageSpeed Insights
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Analiza el rendimiento, SEO y accesibilidad de cualquier sitio web usando datos de Google PageSpeed Insights.
      </Typography>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mt: 3,
          bgcolor: 'background.paper'
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <TextField
                  fullWidth
            label="URL del sitio web"
                  variant="outlined"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
            sx={{ flex: '2 1 300px' }}
                />
          <FormControl sx={{ minWidth: 200, flex: '1 1 200px' }}>
            <InputLabel id="category-label">Categoría</InputLabel>
            <Select
              labelId="category-label"
              value={category}
                  label="Categoría"
                  onChange={(e) => setCategory(e.target.value)}
                >
              <MenuItem value="PERFORMANCE">Rendimiento</MenuItem>
              <MenuItem value="ACCESSIBILITY">Accesibilidad</MenuItem>
              <MenuItem value="BEST_PRACTICES">Mejores Prácticas</MenuItem>
              <MenuItem value="SEO">SEO</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200, flex: '1 1 200px' }}>
            <InputLabel id="strategy-label">Estrategia</InputLabel>
            <Select
              labelId="strategy-label"
              value={strategy}
                  label="Estrategia"
                  onChange={(e) => setStrategy(e.target.value)}
                >
              <MenuItem value="DESKTOP">Escritorio</MenuItem>
              <MenuItem value="MOBILE">Móvil</MenuItem>
            </Select>
          </FormControl>
                <Button
            variant="contained"
                  type="submit"
                  disabled={loading}
            sx={{ 
              height: '56px',
              flex: '0 0 auto',
              minWidth: '120px'
            }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Analizar URL'}
                </Button>
          </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', my: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Analizando sitio web... Esto puede tomar hasta 30 segundos.
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && result && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
              Resultados del análisis
          </Typography>
            
          <Grid container spacing={2}>
              {categories.slice(1).map((cat) => (
                <Grid item xs={6} sm={3} key={cat.value}>
                  <Tooltip title={`${cat.label}: ${getScore(cat.value)}%`}>
                    <Box>
                      <Chip
                        icon={<cat.icon />}
                        label={`${getScore(cat.value)}%`}
                        color={getScoreColor(getScore(cat.value))}
                        sx={{ width: '100%' }}
                      />
                    </Box>
                  </Tooltip>
            </Grid>
              ))}
            </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              URL Analizada:
            </Typography>
              <Typography variant="body2" color="text.secondary" component="div" sx={{ wordBreak: 'break-all' }}>
              {result.lighthouseResult?.finalUrl || url}
            </Typography>
          </Box>
        </Paper>

          {/* Detalles de JavaScript */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detalles de Tiempo de Ejecución JavaScript
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>URL</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Tiempo Total (ms)</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Evaluación (ms)</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Parsing (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {getJavaScriptDetails().map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                        {item.url === 'Unattributable' ? 'Otros Scripts' : item.url}
                      </td>
                      <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                        {Math.round(item.total)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                        {Math.round(item.scripting)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                        {Math.round(item.scriptParseCompile)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>

          {/* Sugerencias de Optimización */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sugerencias de Optimización
            </Typography>
            {getOptimizationSuggestions().map((suggestion, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {suggestion.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {suggestion.description}
                </Typography>
              </Box>
            ))}
            {getOptimizationSuggestions().length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No hay sugerencias de optimización disponibles para la categoría seleccionada.
              </Typography>
            )}
          </Paper>
        </>
      )}
    </Container>
  );
};

export default PageSpeedInsights; 