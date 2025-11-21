import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Box,
  Chip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Business,
  Newspaper,
  Compare,
  Psychology,
  Star,
  ExpandMore,
  Lightbulb,
  Analytics
} from '@mui/icons-material';
import axiosInstance from '../../config/axios';

const PerplexityAPI = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchInputs, setSearchInputs] = useState({
    general: '',
    trends: '',
    market: '',
    news: '',
    comparison: ''
  });
  const [copyStatus, setCopyStatus] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setData(null);
    setError('');
  };

  const handleInputChange = (field, value) => {
    setSearchInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);
    setCopyStatus('');

    try {
      let content = '';
      
      switch (activeTab) {
        case 0: // General
          content = searchInputs.general;
          break;
        case 1: // Trends
          content = searchInputs.trends;
          break;
        case 2: // Market
          content = searchInputs.market;
          break;
        case 3: // News
          content = searchInputs.news;
          break;
        case 4: // Comparison
          content = searchInputs.comparison;
          break;
        default:
          content = searchInputs.general;
      }

      if (!content.trim()) {
        setError('Por favor ingresa una consulta para buscar');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post('/api/beta_v2/perplexity/search', {
        content: content
      });

      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const getMainAnswerText = (responseData) => {
    if (!responseData) return '';
    if (responseData.choices && responseData.choices.content && responseData.choices.content.parts && responseData.choices.content.parts.length > 0) {
      return responseData.choices.content.parts[0].text;
    } else if (responseData.text) {
      return responseData.text;
    } else if (responseData.response) {
      return responseData.response;
    } else if (responseData.answer) {
      return responseData.answer;
    } else if (responseData.content) {
      return responseData.content;
    } else if (responseData.message) {
      return responseData.message;
    }
    return '';
  };

  const handleCopyText = async (text) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyStatus('Texto copiado al portapapeles');
    } catch (err) {
      setCopyStatus('No se pudo copiar el texto');
    }
  };

  const handleDownloadText = (text) => {
    if (!text) return;
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'perplexity_respuesta.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      // En caso de error, solo actualizamos el estado para informar al usuario
      setCopyStatus('No se pudo descargar el texto');
    }
  };

  const renderSearchForm = () => {
    switch (activeTab) {
      case 0: // General
        return (
          <TextField
            fullWidth
            label="Consulta general"
            value={searchInputs.general}
            onChange={(e) => handleInputChange('general', e.target.value)}
            placeholder="ej: ¿Cuáles son las tendencias de IA en 2025?"
            variant="outlined"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        );
      case 1: // Trends
        return (
          <TextField
            fullWidth
            label="Análisis de tendencias"
            value={searchInputs.trends}
            onChange={(e) => handleInputChange('trends', e.target.value)}
            placeholder="ej: Analiza las tendencias de criptomonedas este año"
            variant="outlined"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        );
      case 2: // Market
        return (
          <TextField
            fullWidth
            label="Investigación de mercado"
            value={searchInputs.market}
            onChange={(e) => handleInputChange('market', e.target.value)}
            placeholder="ej: Investigación del mercado de smartphones en Latinoamérica"
            variant="outlined"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        );
      case 3: // News
        return (
          <TextField
            fullWidth
            label="Noticias y actualidad"
            value={searchInputs.news}
            onChange={(e) => handleInputChange('news', e.target.value)}
            placeholder="ej: Noticias sobre tecnología y innovación hoy"
            variant="outlined"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        );
      case 4: // Comparison
        return (
          <TextField
            fullWidth
            label="Comparaciones y análisis"
            value={searchInputs.comparison}
            onChange={(e) => handleInputChange('comparison', e.target.value)}
            placeholder="ej: Compara iPhone vs Android en términos de seguridad"
            variant="outlined"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        );
      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!data) return null;

    // Debug: mostrar la estructura completa de la respuesta
    console.log('Respuesta completa de Perplexity:', data);

    // Si hay error en la respuesta de Perplexity
    if (data.error) {
      return (
        <Alert severity="error" sx={{ mb: 4 }}>
          Error en Perplexity API: {data.error?.message || data.error || 'Error desconocido'}
        </Alert>
      );
    }

    const mainText = getMainAnswerText(data) || 'Respuesta no disponible';

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>
                  Respuesta de Perplexity AI
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleCopyText(mainText)}
                >
                  Copiar texto
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleDownloadText(mainText)}
                >
                  Descargar .txt
                </Button>
              </Box>
              {copyStatus && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, textAlign: 'right' }}>
                  {copyStatus}
                </Typography>
              )}
              
              {/* Contenido principal */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {mainText}
                </Typography>
              </Box>

              {/* Fuentes consultadas si están disponibles */}
              {data.groundingMetadata && data.groundingMetadata.groundingSupports && data.groundingMetadata.groundingSupports.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    <Newspaper sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Fuentes consultadas:
                  </Typography>
                  <Grid container spacing={1}>
                    {data.groundingMetadata.groundingSupports.map((support, index) => (
                      <Grid item key={index}>
                        <Chip
                          label={support.segment?.text?.substring(0, 50) + '...' || `Fuente ${index + 1}`}
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                          onClick={() => {
                            if (support.groundingChunks && support.groundingChunks.length > 0 && support.groundingChunks[0].web) {
                              window.open(support.groundingChunks[0].web.uri, '_blank');
                            }
                          }}
                          clickable
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Búsquedas relacionadas si están disponibles */}
              {data.webSearchQueries && data.webSearchQueries.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    <Analytics sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Búsquedas relacionadas:
                  </Typography>
                  <Grid container spacing={1}>
                    {data.webSearchQueries.map((query, index) => (
                      <Grid item key={index}>
                        <Chip
                          label={query}
                          variant="outlined"
                          color="secondary"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Métricas si están disponibles */}
              {data.metrics && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Métricas de la búsqueda:
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(data.metrics).map(([key, value]) => (
                      <Grid item xs={6} md={3} key={key}>
                        <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h6" color="primary">
                            {value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {key}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const getTabIcon = (tabIndex) => {
    switch (tabIndex) {
      case 0: return <Search />;
      case 1: return <TrendingUp />;
      case 2: return <Business />;
      case 3: return <Newspaper />;
      case 4: return <Compare />;
      default: return <Search />;
    }
  };

  const getTabLabel = (tabIndex) => {
    switch (tabIndex) {
      case 0: return 'Búsqueda General';
      case 1: return 'Análisis de Tendencias';
      case 2: return 'Investigación de Mercado';
      case 3: return 'Noticias y Actualidad';
      case 4: return 'Comparaciones';
      default: return 'Búsqueda';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Perplexity
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Búsquedas inteligentes con IA - Análisis avanzado de Google data
        </Typography>
        <Chip 
          icon={<Star />} 
          label="Costo: 3 puntos por búsqueda" 
          color="primary" 
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Tabs de navegación */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {[0, 1, 2, 3, 4].map((tabIndex) => (
            <Tab 
              key={tabIndex}
              icon={getTabIcon(tabIndex)} 
              label={getTabLabel(tabIndex)}
              sx={{ minHeight: '64px' }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Formulario de búsqueda */}
      <Paper elevation={3} sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={8}>
              {renderSearchForm()}
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                sx={{
                  height: '56px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                {loading ? 'Analizando...' : 'Buscar con IA'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Resultados */}
      {renderResults()}

      {/* Información adicional */}
      {!data && !loading && (
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Lightbulb sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              ¿Cómo usar Perplexity?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Perplexity utiliza inteligencia artificial para analizar y organizar información de Google, 
              proporcionando insights valiosos para investigación, análisis de mercado y toma de decisiones.
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Analytics sx={{ color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle2">Búsquedas Inteligentes</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Consultas naturales procesadas por IA
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <TrendingUp sx={{ color: 'secondary.main', mb: 1 }} />
                  <Typography variant="subtitle2">Análisis de Tendencias</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Identificación de patrones y tendencias
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Business sx={{ color: 'success.main', mb: 1 }} />
                  <Typography variant="subtitle2">Investigación de Mercado</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Insights para decisiones empresariales
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default PerplexityAPI;
