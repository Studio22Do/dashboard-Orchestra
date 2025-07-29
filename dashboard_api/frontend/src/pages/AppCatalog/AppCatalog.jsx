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
import { selectDensity } from '../../redux/slices/uiSlice';

const AppCatalog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const purchasedApps = useAppSelector(selectPurchasedApps);
  const density = useAppSelector(selectDensity);

  // Obtener categorías únicas de las apps compradas
  const CATEGORIES = ['All', ...Array.from(new Set(purchasedApps.map(app => app.category)))];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Función para obtener el ancho basado en la densidad
  const getItemWidth = () => {
    switch (density) {
      case 'compacta':
        return { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' }; // 4 por fila en desktop
      case 'normal':
        return { xs: '100%', sm: 'calc(50% - 12px)' }; // 2 por fila en desktop
      case 'amplia':
        return { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }; // 3 por fila en desktop
      default:
        return { xs: '100%', sm: 'calc(50% - 12px)' }; // Normal por defecto
    }
  };

  // Función para obtener el gap basado en la densidad
  const getGap = () => {
    switch (density) {
      case 'compacta':
        return '16px'; // Menos espacio para más densidad
      case 'normal':
        return '24px'; // Espacio normal
      case 'amplia':
        return '24px'; // Espacio balanceado para 3 por fila
      default:
        return '24px';
    }
  };

  // Verificar si hay una categoría preseleccionada (desde Dashboard)
  useEffect(() => {
    const preselectedCategory = location.state?.preselectedCategory;
    if (preselectedCategory && CATEGORIES.includes(preselectedCategory)) {
      setActiveCategory(preselectedCategory);
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
    <Box sx={{ width: '100%', px: 0, py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: { xs: 2, md: 6 } }}>
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
      
      <Typography variant="body1" color="text.secondary" paragraph sx={{ px: { xs: 2, md: 6 } }}>
        Explora tus aplicaciones agregadas para {activeCategory === 'All' ? 'todas las categorías' : activeCategory.toLowerCase()}
      </Typography>

      <Box sx={{ mb: 4, px: { xs: 2, md: 6 } }} style={{  }}>
        <TextField
          
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: getGap(), px: '50px' }}>
        {filteredApps.length > 0 ? (
          filteredApps
            .filter(app => app && (app.id || app.app_id))
            .map(app => (
              <Box key={app.app_id || app.id} sx={{ width: getItemWidth(), boxSizing: 'border-box'}}>
                <AppCard {...app} isPurchased={true} showFavorite={true} is_favorite={app.is_favorite} />
              </Box>
            ))
        ) : (
          <Box>
            <Typography variant="body1" color="text.secondary">
              Aún no has agregado ninguna aplicación. ¡Explora el Dashboard y agrega tus favoritas!
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AppCatalog; 