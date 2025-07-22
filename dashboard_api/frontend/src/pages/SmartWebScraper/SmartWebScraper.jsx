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
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Search,
  Link as LinkIcon,
  TableChart,
  TextFields,
  ContentCopy,
  Download,
  Code
} from '@mui/icons-material';

const SmartWebScraper = () => {
  const [url, setUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [result, setResult] = useState(null);

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `/api/${API_MODE}/smart-scraper`;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
    setResult(null);
  };

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
      let endpoint = '';
      let payload = { url };

      // Determinar endpoint según la pestaña activa
      switch (activeTab) {
        case 0: // Contenido
          endpoint = '/content';
          if (!prompt) {
            setError('Por favor ingresa una pregunta o instrucción');
            setLoading(false);
            return;
          }
          payload.prompt = prompt;
          break;
        case 1: // Enlaces
          endpoint = '/links';
          break;
        case 2: // Markdown
          endpoint = '/markdown';
          break;
        default:
          throw new Error('Operación no válida');
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al analizar el contenido');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Error al analizar el contenido');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderResult = () => {
    if (!result) return null;

    switch (activeTab) {
      case 0: // Contenido
        return (
          <Box sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {result.generated_text || result.content || 'No se encontró contenido'}
          </Box>
        );

      case 1: // Enlaces
        // Soporta tanto { links: [...] } como array directo
        const linksArray = Array.isArray(result)
          ? result
          : Array.isArray(result.links)
            ? result.links
            : [];

        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Enlaces encontrados: {linksArray.length}
            </Typography>
            {linksArray.length === 0 ? (
              <Typography>No se encontraron enlaces.</Typography>
            ) : (
              linksArray.map((link, index) => {
                // Si es objeto {name, url}
                if (typeof link === 'object' && link !== null) {
                  return (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography
                        component="a"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textDecoration: 'none', color: 'primary.main' }}
                      >
                        {link.name || link.url}
                      </Typography>
                    </Box>
                  );
                }
                // Si es string
                return (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography
                      component="a"
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none', color: 'primary.main' }}
                    >
                      {link}
                    </Typography>
                  </Box>
                );
              })
            )}
          </Box>
        );

      case 2: // Markdown (ahora es el tercer tab)
        return (
          <Box sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {result.markdown || 'No se encontró contenido markdown'}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Smart Web Scraper
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Extrae y analiza contenido web usando IA. Obtén datos estructurados, enlaces, tablas y más.
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<Search />} label="Contenido" />
          <Tab icon={<LinkIcon />} label="Enlaces" />
          <Tab icon={<TextFields />} label="Markdown" />
        </Tabs>
      </Paper>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL del sitio web"
                  placeholder="https://ejemplo.com"
                  variant="outlined"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  error={!!error && !url}
                  helperText={error && !url ? error : ''}
                />
              </Grid>

              {activeTab === 0 && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Pregunta o instrucción"
                    placeholder="¿Qué quieres saber sobre este contenido?"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    error={!!error && !prompt}
                    helperText={error && !prompt ? error : ''}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Analizar Contenido'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', my: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Analizando contenido...
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Resultados del Análisis
            </Typography>
            <Box>
              <Tooltip title="Copiar">
                <IconButton onClick={() => handleCopy(JSON.stringify(result, null, 2))}>
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip title="Descargar">
                <IconButton onClick={() => handleDownload(JSON.stringify(result, null, 2), 'scraping-result.json')}>
                  <Download />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />
          
          {renderResult()}
        </Paper>
      )}
    </Container>
  );
};

export default SmartWebScraper; 