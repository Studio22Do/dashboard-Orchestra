import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment, 
  Box, 
  Tabs, 
  Tab,
  Divider
} from '@mui/material';
import { Search } from '@mui/icons-material';
import AppCard from '../../components/AppCard/AppCard';

// Datos de ejemplo para las apps
const APPS_DATA = [
  {
    id: 'instagram-stats',
    title: 'Instagram Statistics',
    description: 'Analiza perfiles de Instagram, obtén estadísticas y monitorea crecimiento',
    imageUrl: 'https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_960_720.jpg',
    category: 'Social Media',
    route: '/apps/instagram',
    apiName: 'Instagram Statistics API'
  },
  {
    id: 'weather-forecast',
    title: 'Weather Forecast',
    description: 'Consulta el pronóstico del tiempo en cualquier ubicación del mundo',
    imageUrl: 'https://cdn.pixabay.com/photo/2013/04/01/09/22/clouds-98536_960_720.png',
    category: 'Weather',
    route: '/apps/weather',
    apiName: 'Weather Forecast API'
  },
  {
    id: 'currency-converter',
    title: 'Currency Converter',
    description: 'Convierte divisas con tasas de cambio en tiempo real',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/23/13/44/currency-exchange-2672531_960_720.png',
    category: 'Finance',
    route: '/apps/currency',
    apiName: 'Currency Exchange API'
  },
  {
    id: 'stock-tracker',
    title: 'Stock Market Tracker',
    description: 'Sigue el rendimiento de acciones y mercados financieros en tiempo real',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/11/27/07/02/financial-2980349_960_720.jpg',
    category: 'Finance',
    route: '/apps/stocks',
    apiName: 'Stock Market API'
  },
  {
    id: 'news-aggregator',
    title: 'News Aggregator',
    description: 'Recopila noticias de diferentes fuentes en un solo lugar',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/06/26/19/03/news-2444778_960_720.jpg',
    category: 'News',
    route: '/apps/news',
    apiName: 'News API'
  },
  {
    id: 'covid-tracker',
    title: 'COVID-19 Tracker',
    description: 'Monitorea estadísticas y tendencias de COVID-19 en todo el mundo',
    imageUrl: 'https://cdn.pixabay.com/photo/2020/04/21/00/40/coronavirus-5071045_960_720.jpg',
    category: 'Health',
    route: '/apps/covid',
    apiName: 'COVID-19 Statistics API'
  }
];

// Categorías únicas para los filtros
const CATEGORIES = ['All', ...Array.from(new Set(APPS_DATA.map(app => app.category)))];

const AppCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filtrar apps según búsqueda y categoría
  const filteredApps = APPS_DATA.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        app.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Catálogo de Apps
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Explora nuestra colección de aplicaciones que utilizan APIs de RapidAPI
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Buscar apps..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Tabs 
          value={activeCategory}
          onChange={(_, newValue) => setActiveCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {CATEGORIES.map(category => (
            <Tab 
              key={category} 
              label={category} 
              value={category} 
              sx={{ 
                textTransform: 'none',
                fontWeight: activeCategory === category ? 'bold' : 'normal'
              }} 
            />
          ))}
        </Tabs>
        
        <Divider />
      </Box>

      <Grid container spacing={3}>
        {filteredApps.length > 0 ? (
          filteredApps.map(app => (
            <Grid key={app.id} xs={12} sm={6} md={4}>
              <AppCard {...app} />
            </Grid>
          ))
        ) : (
          <Box sx={{ py: 4, textAlign: 'center', width: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              No se encontraron apps que coincidan con tu búsqueda.
            </Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default AppCatalog; 