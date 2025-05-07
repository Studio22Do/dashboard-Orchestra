import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment, 
  Box, 
  Tabs, 
  Tab,
  Divider,
  Button
} from '@mui/material';
import { Search, ArrowBack } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import AppCard from '../../components/AppCard/AppCard';
import { useAppSelector } from '../../redux/hooks/reduxHooks';
import { selectPurchasedApps } from '../../redux/slices/appsSlice';

const AppCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const purchasedApps = useAppSelector(selectPurchasedApps);

  // Obtener categorías únicas de las apps compradas
  const CATEGORIES = ['All', ...Array.from(new Set(purchasedApps.map(app => app.category)))];

  // Verificar si hay una categoría preseleccionada (desde Dashboard)
  useEffect(() => {
    const preselectedCategory = location.state?.preselectedCategory;
    if (preselectedCategory && CATEGORIES.includes(preselectedCategory)) {
      setActiveCategory(preselectedCategory);
    } else {
      setActiveCategory(CATEGORIES[0]);
    }
  }, [location.state, CATEGORIES]);

  // Filtrar apps según búsqueda y categoría actual
  const filteredApps = purchasedApps.filter(app => {
    const matchesSearch = app.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        app.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          {activeCategory}
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Explora tus aplicaciones agregadas para {activeCategory === 'All' ? 'todas las categorías' : activeCategory.toLowerCase()}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Buscar herramientas..."
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
          filteredApps
            .filter(app => app && (app.id || app.app_id))
            .map(app => (
              <Grid item key={app.app_id || app.id} xs={12} sm={6} md={4}>
                <AppCard {...app} isPurchased={true} showFavorite={true} is_favorite={app.is_favorite} />
              </Grid>
            ))
        ) : (
          <Box sx={{ py: 4, textAlign: 'center', width: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              Aún no has agregado ninguna aplicación. ¡Explora el Dashboard y agrega tus favoritas!
            </Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default AppCatalog; 