import { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Breadcrumbs from '../../components/common/Breadcrumbs';

// Base URL de la API
const API_URL = 'http://localhost:5000/api';

const categories = [
  { id: 'latest', label: 'Últimas Noticias' },
  { id: 'world', label: 'Mundo' },
  { id: 'business', label: 'Negocios' },
  { id: 'technology', label: 'Tecnología' },
  { id: 'entertainment', label: 'Entretenimiento' },
  { id: 'sports', label: 'Deportes' },
  { id: 'science', label: 'Ciencia' },
  { id: 'health', label: 'Salud' }
];

const GoogleNews = () => {
  const [activeTab, setActiveTab] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('es-ES');
  const [languages, setLanguages] = useState([
    { value: 'es-ES', label: 'Español' },
    { value: 'en-US', label: 'English' },
    { value: 'fr-FR', label: 'Français' },
    { value: 'de-DE', label: 'Deutsch' }
  ]);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
    setSearchQuery(''); // Limpiar búsqueda al cambiar tab
    fetchNews(newValue);
  };

  const fetchNews = async (category = activeTab) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (searchQuery && searchQuery.trim()) {
        response = await axios.get(`${API_URL}/google-news/search?keyword=${encodeURIComponent(searchQuery)}&lr=${language}`);
      } else if (category === 'latest') {
        response = await axios.get(`${API_URL}/google-news/latest?lr=${language}`);
      } else {
        response = await axios.get(`${API_URL}/google-news/category/${category}?lr=${language}`);
      }
      
      if (response.data && response.data.articles) {
        setNews(response.data.articles);
      } else {
        setNews([]);
        setError('No se encontraron noticias para esta búsqueda.');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.response?.data?.error || err.message || 'Error al obtener noticias');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery || !searchQuery.trim()) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }
    await fetchNews(activeTab);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    // Recargar noticias con el nuevo idioma
    setTimeout(() => {
      fetchNews(activeTab);
    }, 100);
  };

  useEffect(() => {
    // Cargar noticias iniciales
    fetchNews('latest');
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Google News', href: '/apps/google-news' },
          ]}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Google News
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Accede a noticias en tiempo real de todo el mundo con filtros por categoría e idioma
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </Box>

      <Paper sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                label="Buscar noticias"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ej: tecnología, deportes, política..."
                InputProps={{
                  endAdornment: (
                    <IconButton type="submit" disabled={loading}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </form>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Idioma</InputLabel>
              <Select
                value={language}
                label="Idioma"
                onChange={handleLanguageChange}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              label={category.label}
              value={category.id}
            />
          ))}
        </Tabs>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
            Cargando noticias...
          </Typography>
        </Box>
      ) : news.length > 0 ? (
        <Grid container spacing={3}>
          {news.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2 }}>
                    {article.title}
                  </Typography>
                  {article.imageUrl && (
                    <Box
                      component="img"
                      src={article.imageUrl}
                      alt={article.title}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        mb: 2,
                        borderRadius: 1
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {article.description || article.snippet || 'Sin descripción disponible'}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      {article.source} • {new Date(article.publishedAt || article.date).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      href={article.url || article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      fullWidth
                    >
                      Leer más
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron noticias
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery ? 
              `No hay resultados para "${searchQuery}". Intenta con otros términos.` : 
              'Selecciona una categoría o realiza una búsqueda para ver noticias.'
            }
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default GoogleNews; 