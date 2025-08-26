import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  CardMedia,
  CardActions,
  IconButton,
  Tooltip,
  Divider,
  Skeleton,
  Pagination
} from '@mui/material';
import {
  Search,
  Language,
  Public,
  Business,
  Movie,
  HealthAndSafety,
  Science,
  SportsSoccer,
  Computer,
  TrendingUp,
  AccessTime,
  OpenInNew,
  Share,
  BookmarkBorder,
  Refresh
} from '@mui/icons-material';
import axios from 'axios';

// Configuración de la API
const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = `${API_URL}/${API_MODE}`;

// Configurar axios con el token de autenticación
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const GoogleNews = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [languageRegion, setLanguageRegion] = useState('es-ES');
  const [availableRegions, setAvailableRegions] = useState([]);
  
  // Estado para controlar el estado de carga de las imágenes
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Categorías disponibles
  const categories = [
    { id: 'world', label: 'Mundo', icon: Public, color: 'primary' },
    { id: 'latest', label: 'Últimas', icon: TrendingUp, color: 'secondary' },
    { id: 'business', label: 'Negocios', icon: Business, color: 'success' },
    { id: 'entertainment', label: 'Entretenimiento', icon: Movie, color: 'warning' },
    { id: 'health', label: 'Salud', icon: HealthAndSafety, color: 'error' },
    { id: 'science', label: 'Ciencia', icon: Science, color: 'info' },
    { id: 'sport', label: 'Deportes', icon: SportsSoccer, color: 'success' },
    { id: 'technology', label: 'Tecnología', icon: Computer, color: 'primary' }
  ];

  // Cargar regiones de idioma disponibles
  useEffect(() => {
    loadLanguageRegions();
  }, []);

  const loadLanguageRegions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/google-news/language-regions`);
      if (response.data && response.data.regions) {
        setAvailableRegions(response.data.regions);
      }
    } catch (err) {
      console.log('No se pudieron cargar las regiones de idioma');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setData(null);
    setError('');
    setCurrentPage(1);
    if (newValue < categories.length) {
      fetchNewsByCategory(categories[newValue].id);
    }
  };

  const fetchNewsByCategory = async (category) => {
    setLoading(true);
    setError('');
    setData(null);
    setImageErrors({});
    setImageLoadingStates({});
    setCurrentPage(1);

    try {
      const response = await axios.get(`${API_BASE_URL}/google-news/${category}`, {
        params: { lr: languageRegion }
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener noticias');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) return;

    setLoading(true);
    setError('');
    setData(null);
    setImageErrors({});
    setImageLoadingStates({});
    setCurrentPage(1);

    try {
      const response = await axios.get(`${API_BASE_URL}/google-news/search`, {
        params: { 
          keyword: searchKeyword.trim(),
          lr: languageRegion 
        }
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al buscar noticias');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (event) => {
    setLanguageRegion(event.target.value);
    if (activeTab < categories.length) {
      fetchNewsByCategory(categories[activeTab].id);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderNewsItem = (item, index) => {
    // Inicializar estado de carga si no existe
    if (imageLoadingStates[index] === undefined) {
      setImageLoadingStates(prev => ({ ...prev, [index]: true }));
    }
    
    const imageLoading = imageLoadingStates[index] !== false;
    const imageError = imageErrors[index] || false;
    
    // Función para obtener la URL de la imagen a través del proxy
    const getImageUrl = (originalUrl) => {
      if (!originalUrl) return null;
      
      // Si la URL es de Google News, usar el proxy
      if (originalUrl.includes('news.google.com')) {
        const encodedUrl = encodeURIComponent(originalUrl);
        return `${API_BASE_URL}/google-news/proxy-image?url=${encodedUrl}`;
      }
      
      return originalUrl;
    };
    
    const handleImageLoad = () => {
      setImageLoadingStates(prev => ({ ...prev, [index]: false }));
      setImageErrors(prev => ({ ...prev, [index]: false }));
    };
    
    const handleImageError = () => {
      setImageLoadingStates(prev => ({ ...prev, [index]: false }));
      setImageErrors(prev => ({ ...prev, [index]: true }));
    };

    return (
      <Card 
        key={index} 
        elevation={3} 
        sx={{ 
          height: 400, // Altura fija para todas las tarjetas
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
          overflow: 'hidden',
          borderRadius: 2,
          position: 'relative',
          width: '100%' // Asegurar que ocupe todo el ancho del grid
        }}
      >
        {/* Contenedor de imagen con altura fija */}
        <Box sx={{ 
          position: 'relative',
          height: 200, // Altura fija para todas las imágenes
          backgroundColor: 'grey.100',
          overflow: 'hidden',
          flexShrink: 0 // Evitar que se comprima
        }}>
          {/* Loading skeleton */}
          {imageLoading && (
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'grey.200',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              zIndex: 1
            }}>
              <CircularProgress size={30} />
              <Typography variant="caption" color="text.secondary">
                Cargando...
              </Typography>
            </Box>
          )}
          
          {/* Imagen */}
          <CardMedia
            component="img"
            image={getImageUrl(item.images?.thumbnail)}
            alt={item.title}
            sx={{ 
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              opacity: imageLoading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {/* Badge de categoría */}
          <Box sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 600,
            backdropFilter: 'blur(10px)',
            zIndex: 2
          }}>
            {categories[activeTab]?.label || 'Noticia'}
          </Box>
        </Box>
        
        {/* Contenido de la tarjeta con altura fija */}
        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: 2,
          height: 120, // Altura fija para el contenido
          overflow: 'hidden'
        }}>
          {/* Título con altura fija */}
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontSize: '1rem', 
              fontWeight: 700,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1,
              color: 'text.primary',
              height: '2.6rem', // Altura fija para el título
              flexShrink: 0
            }}
          >
            {item.title}
          </Typography>
          
          {/* Descripción con altura fija */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
              height: '2.8rem', // Altura fija para la descripción
              flexShrink: 0
            }}
          >
            {item.snippet}
          </Typography>
        </CardContent>
        
        {/* Metadatos y acciones con altura fija */}
        <Box sx={{ 
          p: 2,
          pt: 0,
          height: 80, // Altura fija para la sección inferior
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Metadatos */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 1
          }}>
            <Chip
              icon={<AccessTime />}
              label={formatTimestamp(item.timestamp)}
              size="small"
              variant="outlined"
              sx={{ 
                fontSize: '0.7rem',
                height: 24,
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
            {item.publisher && (
              <Chip
                label={item.publisher}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ 
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            )}
          </Box>
          
          {/* Acciones */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 1
          }}>
            <Box>
              {item.newsUrl && (
                <Tooltip title="Ver noticia completa">
                  <IconButton
                    size="small"
                    onClick={() => window.open(item.newsUrl, '_blank')}
                    color="primary"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white'
                      }
                    }}
                  >
                    <OpenInNew />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            
            {item.hasSubnews && (
              <Chip
                label={`${item.subnews?.length || 0} subnoticias`}
                size="small"
                color="success"
                variant="outlined"
                sx={{ 
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            )}
          </Box>
        </Box>
      </Card>
    );
  };

  const renderResults = () => {
    if (!data) return null;

    if (data.error) {
      return (
        <Alert severity="error" sx={{ mb: 4 }}>
          {data.error}
        </Alert>
      );
    }

    const newsItems = data.items || [];
    
    if (newsItems.length === 0) {
      return (
        <Alert severity="info" sx={{ mb: 4 }}>
          No se encontraron noticias para esta categoría.
        </Alert>
      );
    }

    // Calcular paginación
    const totalPages = Math.ceil(newsItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = newsItems.slice(startIndex, endIndex);

    const handlePageChange = (event, value) => {
      setCurrentPage(value);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" color="primary">
            {newsItems.length} noticias encontradas
          </Typography>
          <Button
            startIcon={<Refresh />}
            onClick={() => activeTab < categories.length ? fetchNewsByCategory(categories[activeTab].id) : handleSearch()}
            variant="outlined"
            size="small"
          >
            Actualizar
          </Button>
        </Box>
        
        {/* Grid de noticias con paginación - 3 tarjetas por fila, 4 filas por página */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(3, 1fr)'
          },
          gap: 3,
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto'
        }}>
          {currentItems.map((item, index) => (
            <Box 
              key={startIndex + index}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              {renderNewsItem(item, startIndex + index)}
            </Box>
          ))}
        </Box>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                  minWidth: 40,
                  height: 40
                }
              }}
            />
          </Box>
        )}
        
        {/* Información de paginación */}
        <Box sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
          <Typography variant="body2">
            Mostrando {startIndex + 1}-{Math.min(endIndex, newsItems.length)} de {newsItems.length} noticias
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderSearchForm = () => {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buscar noticias"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="ej: inteligencia artificial, cambio climático, fútbol..."
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'transparent',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&.Mui-focused': {
                      color: 'rgba(255, 255, 255, 1)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Idioma/Región</InputLabel>
                <Select
                  value={languageRegion}
                  onChange={handleLanguageChange}
                  label="Idioma/Región"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'transparent',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                      },
                    },
                    '& .MuiSelect-icon': {
                      color: 'rgba(255, 255, 255, 0.8)',
                    },
                    '& .MuiSelect-select': {
                      color: 'white',
                    },
                  }}
                >
                  <MenuItem value="es-ES">Español (España)</MenuItem>
                  <MenuItem value="es-MX">Español (México)</MenuItem>
                  <MenuItem value="en-US">English (US)</MenuItem>
                  <MenuItem value="en-GB">English (UK)</MenuItem>
                  <MenuItem value="fr-FR">Français (France)</MenuItem>
                  <MenuItem value="de-DE">Deutsch (Deutschland)</MenuItem>
                  <MenuItem value="it-IT">Italiano (Italia)</MenuItem>
                  <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !searchKeyword.trim()}
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
                {loading ? 'Buscando...' : 'Buscar Noticias'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
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
          Google News
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Noticias en tiempo real de múltiples fuentes, categorías y países
        </Typography>
        <Chip 
          icon={<Language />} 
          label="Costo: 1 punto por categoría/búsqueda" 
          color="primary" 
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Formulario de búsqueda */}
      {renderSearchForm()}

      {/* Tabs de categorías */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {categories.map((category, index) => (
            <Tab 
              key={category.id}
              icon={<category.icon />} 
              label={category.label}
              sx={{ minHeight: '64px' }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando noticias...
          </Typography>
        </Box>
      )}

      {/* Resultados */}
      {renderResults()}

      {/* Información adicional */}
      {!data && !loading && (
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              ¿Cómo usar Google News?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selecciona una categoría de las pestañas superiores para ver las últimas noticias, 
              o usa el formulario de búsqueda para encontrar noticias específicas por palabra clave.
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {categories.slice(0, 4).map((category) => (
                <Grid item xs={6} md={3} key={category.id}>
                  <Card elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <category.icon sx={{ color: `${category.color}.main`, mb: 1, fontSize: 40 }} />
                    <Typography variant="subtitle2">{category.label}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default GoogleNews; 